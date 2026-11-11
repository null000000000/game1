#!/usr/bin/env python3
"""Validate the Random Challenge Game challenge library."""
import json
from collections import Counter
from pathlib import Path

path = Path(__file__).with_name("challenges.json")
data = json.loads(path.read_text(encoding="utf-8"))
challenges = data.get("challenges", [])
ids = [c.get("id") for c in challenges]
categories = Counter(c.get("category") for c in challenges)
required = {"SOCIAL", "CREATIVE", "EXPLORE", "FUN", "BRAIN"}
assert len(challenges) == 100, f"Expected 100 challenges, got {len(challenges)}"
assert len(set(ids)) == 100, "Challenge IDs are not unique"
assert set(categories) == required, f"Unexpected categories: {set(categories)}"
assert all(categories[c] == 20 for c in required), f"Category counts: {categories}"
for item in challenges:
    for key in ("id", "category", "title_ar", "description_ar", "duration_minutes", "difficulty"):
        assert item.get(key) not in (None, ""), f"Missing {key} in {item.get('id')}"
    assert item["duration_minutes"] > 0, f"Invalid duration in {item['id']}"
    assert item["difficulty"] in {"easy", "medium"}, f"Invalid difficulty in {item['id']}"
print("OK: 100 unique challenges; 20 in each of 5 categories.")
