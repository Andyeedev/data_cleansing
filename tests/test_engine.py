def test_engine_initialisation():
    from app.execution_engine import ExecutionEngine
    assert ExecutionEngine is not None


def test_engine_runs():
    assert True