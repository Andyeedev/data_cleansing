import pytest
from app.services.matching_engine import MatchingEngine
from app.types.matching import DEFAULT_MATCHING_CONFIG


@pytest.fixture
def engine():
  return MatchingEngine(DEFAULT_MATCHING_CONFIG)


class TestExactNameMatch:
  def test_identical_table_names(self, engine):
    source = [{"table_name": "customers", "schema_name": "dbo"}]
    target = [{"table_name": "customers", "schema_name": "dbo"}]
    src_cols = {"dbo.customers": [{"column_name": "id", "data_type": "int"}]}
    tgt_cols = {"dbo.customers": [{"column_name": "id", "data_type": "int"}]}

    candidates = engine.find_candidates(source, target, src_cols, tgt_cols)
    assert len(candidates) == 1
    assert candidates[0].confidence == 100.0
    assert "Exact name match" in candidates[0].match_reason

  def test_different_table_names(self, engine):
    source = [{"table_name": "customers", "schema_name": "dbo"}]
    target = [{"table_name": "client", "schema_name": "dbo"}]
    src_cols = {"dbo.customers": [{"column_name": "id", "data_type": "int"}]}
    tgt_cols = {"dbo.client": [{"column_name": "id", "data_type": "int"}]}

    candidates = engine.find_candidates(source, target, src_cols, tgt_cols)
    assert len(candidates) == 1
    assert candidates[0].confidence < 100.0


class TestSuffixPatternMatch:
  def test_source_target_suffix(self, engine):
    source = [{"table_name": "customers_source", "schema_name": "dbo"}]
    target = [{"table_name": "customers_target", "schema_name": "dbo"}]
    src_cols = {"dbo.customers_source": [{"column_name": "id", "data_type": "int"}]}
    tgt_cols = {"dbo.customers_target": [{"column_name": "id", "data_type": "int"}]}

    candidates = engine.find_candidates(source, target, src_cols, tgt_cols)
    assert len(candidates) == 1
    assert candidates[0].confidence >= 95.0
    assert "Suffix pattern match" in candidates[0].match_reason


class TestColumnSimilarity:
  def test_high_column_similarity(self, engine):
    source = [{"table_name": "cust", "schema_name": "dbo"}]
    target = [{"table_name": "customer", "schema_name": "dbo"}]
    src_cols = {"dbo.cust": [
      {"column_name": "id", "data_type": "int"},
      {"column_name": "name", "data_type": "varchar"},
      {"column_name": "email", "data_type": "varchar"},
    ]}
    tgt_cols = {"dbo.customer": [
      {"column_name": "id", "data_type": "int"},
      {"column_name": "name", "data_type": "varchar"},
      {"column_name": "email", "data_type": "varchar"},
    ]}

    candidates = engine.find_candidates(source, target, src_cols, tgt_cols)
    assert len(candidates) == 1
    assert candidates[0].details.column_similarity == 1.0
    assert candidates[0].confidence >= 50.0

  def test_partial_column_match(self, engine):
    source = [{"table_name": "orders", "schema_name": "dbo"}]
    target = [{"table_name": "purchases", "schema_name": "dbo"}]
    src_cols = {"dbo.orders": [
      {"column_name": "id", "data_type": "int", "is_primary_key": True},
      {"column_name": "total", "data_type": "decimal"},
      {"column_name": "status", "data_type": "varchar"},
    ]}
    tgt_cols = {"dbo.purchases": [
      {"column_name": "order_id", "data_type": "int", "is_primary_key": True},
      {"column_name": "total", "data_type": "decimal"},
      {"column_name": "state", "data_type": "varchar"},
    ]}

    candidates = engine.find_candidates(source, target, src_cols, tgt_cols)
    assert len(candidates) == 1
    assert candidates[0].details.column_similarity > 0.1
    assert candidates[0].details.column_similarity < 1.0
    assert candidates[0].confidence >= 40.0


class TestDatatypeCompatibility:
  def test_compatible_types(self, engine):
    source = [{"table_name": "test", "schema_name": "dbo"}]
    target = [{"table_name": "test", "schema_name": "dbo"}]
    src_cols = {"dbo.test": [{"column_name": "id", "data_type": "int"}]}
    tgt_cols = {"dbo.test": [{"column_name": "id", "data_type": "bigint"}]}

    candidates = engine.find_candidates(source, target, src_cols, tgt_cols)
    assert candidates[0].details.datatype_compatibility == 1.0

  def test_incompatible_types(self, engine):
    source = [{"table_name": "test", "schema_name": "dbo"}]
    target = [{"table_name": "test", "schema_name": "dbo"}]
    src_cols = {"dbo.test": [{"column_name": "id", "data_type": "int"}]}
    tgt_cols = {"dbo.test": [{"column_name": "id", "data_type": "varchar"}]}

    candidates = engine.find_candidates(source, target, src_cols, tgt_cols)
    assert candidates[0].details.datatype_compatibility == 0.0


class TestNoMatch:
  def test_no_candidates(self, engine):
    source = [{"table_name": "alpha", "schema_name": "dbo"}]
    target = [{"table_name": "beta", "schema_name": "dbo"}]
    src_cols = {"dbo.alpha": [{"column_name": "x", "data_type": "int"}]}
    tgt_cols = {"dbo.beta": [{"column_name": "y", "data_type": "geometry"}]}

    candidates = engine.find_candidates(source, target, src_cols, tgt_cols)
    assert len(candidates) == 0

  def test_empty_tables(self, engine):
    candidates = engine.find_candidates([], [], {}, {})
    assert len(candidates) == 0


class TestAmbiguousMatch:
  def test_multiple_candidates(self, engine):
    source = [
      {"table_name": "customers", "schema_name": "dbo"},
      {"table_name": "client", "schema_name": "dbo"},
    ]
    target = [
      {"table_name": "customers", "schema_name": "dbo"},
      {"table_name": "customer_data", "schema_name": "dbo"},
    ]
    src_cols = {
      "dbo.customers": [{"column_name": "id", "data_type": "int"}],
      "dbo.client": [{"column_name": "id", "data_type": "int"}],
    }
    tgt_cols = {
      "dbo.customers": [{"column_name": "id", "data_type": "int"}],
      "dbo.customer_data": [{"column_name": "id", "data_type": "int"}],
    }

    candidates = engine.find_candidates(source, target, src_cols, tgt_cols)
    assert len(candidates) >= 1
    assert candidates[0].confidence >= candidates[-1].confidence


class TestReorderedColumns:
  def test_column_order_irrelevant(self, engine):
    source = [{"table_name": "test", "schema_name": "dbo"}]
    target = [{"table_name": "test", "schema_name": "dbo"}]
    src_cols = {"dbo.test": [
      {"column_name": "a", "data_type": "int"},
      {"column_name": "b", "data_type": "varchar"},
      {"column_name": "c", "data_type": "date"},
    ]}
    tgt_cols = {"dbo.test": [
      {"column_name": "c", "data_type": "date"},
      {"column_name": "a", "data_type": "int"},
      {"column_name": "b", "data_type": "varchar"},
    ]}

    candidates = engine.find_candidates(source, target, src_cols, tgt_cols)
    assert candidates[0].details.column_similarity == 1.0


class TestRenamedColumns:
  def test_renamed_column(self, engine):
    source = [{"table_name": "test", "schema_name": "dbo"}]
    target = [{"table_name": "test", "schema_name": "dbo"}]
    src_cols = {"dbo.test": [{"column_name": "customer_id", "data_type": "int"}]}
    tgt_cols = {"dbo.test": [{"column_name": "cust_id", "data_type": "int"}]}

    candidates = engine.find_candidates(source, target, src_cols, tgt_cols)
    assert candidates[0].details.column_comparisons[0].matched == False
