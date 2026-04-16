def _name_similarity(self, a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio() * 100