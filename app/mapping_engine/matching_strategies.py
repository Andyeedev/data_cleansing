from difflib import SequenceMatcher


def normalize(name: str):
    return name.lower().replace("_source", "").replace("_target", "")


def similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()


def table_score(source, target):
    if source == target:
        return 1.0

    if normalize(source) == normalize(target):
        return 0.95

    return similarity(source, target)


def column_score(src_col, tgt_col):

    score = similarity(src_col["column_name"], tgt_col["column_name"])

    # datatype bonus
    if src_col["data_type"] == tgt_col["data_type"]:
        score += 0.05

    # PK bonus
    if src_col.get("is_primary_key") and tgt_col.get("is_primary_key"):
        score += 0.1

    return min(score, 1.0)