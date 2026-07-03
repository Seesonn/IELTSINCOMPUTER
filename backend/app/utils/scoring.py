"""
Official IELTS raw score to band score conversion tables.
Source: Cambridge IELTS official band score descriptors.
"""

# Reading Academic: raw score -> band score
READING_ACADEMIC_BAND = {
    39: 9.0, 38: 8.5, 37: 8.0, 36: 7.5, 35: 7.0,
    34: 6.5, 33: 6.5, 32: 6.0, 31: 6.0, 30: 5.5,
    29: 5.5, 28: 5.5, 27: 5.0, 26: 5.0, 25: 5.0,
    24: 4.5, 23: 4.5, 22: 4.0, 21: 4.0, 20: 4.0,
    19: 3.5, 18: 3.5, 17: 3.0, 16: 3.0, 15: 2.5,
    14: 2.5, 13: 2.0, 0: 0.0,
}

# Reading General: raw score -> band score
READING_GENERAL_BAND = {
    40: 9.0, 39: 8.5, 38: 8.0, 37: 7.5, 36: 7.0,
    35: 6.5, 34: 6.0, 33: 6.0, 32: 5.5, 31: 5.5,
    30: 5.0, 29: 5.0, 28: 4.5, 27: 4.5, 26: 4.5,
    25: 4.0, 24: 4.0, 23: 3.5, 0: 0.0,
}

# Listening: raw score -> band score (same for Academic & General)
LISTENING_BAND = {
    40: 9.0, 39: 8.5, 37: 8.0, 35: 7.5, 33: 7.0,
    30: 6.5, 27: 6.0, 23: 5.5, 20: 5.0, 16: 4.5,
    13: 4.0, 10: 3.5, 8: 3.0, 6: 2.5, 4: 2.0, 0: 0.0,
}


def _lookup_band(raw: int, table: dict) -> float:
    """Return band score from lookup table, interpolating for missing keys."""
    for threshold in sorted(table.keys(), reverse=True):
        if raw >= threshold:
            return table[threshold]
    return 0.0


def reading_band(raw_score: int, test_type: str = "academic") -> float:
    table = READING_ACADEMIC_BAND if test_type == "academic" else READING_GENERAL_BAND
    return _lookup_band(raw_score, table)


def listening_band(raw_score: int) -> float:
    return _lookup_band(raw_score, LISTENING_BAND)


def round_to_half(value: float) -> float:
    """Round a float to the nearest 0.5."""
    return round(value * 2) / 2


def overall_band(reading: float, listening: float, writing: float, speaking: float) -> float:
    avg = (reading + listening + writing + speaking) / 4
    return round_to_half(avg)
