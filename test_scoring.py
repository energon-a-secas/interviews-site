"""
Interview Vibes — Scoring Logic Tests

Replicates the scoring algorithm from interview-vibes.html and tests
various candidate profiles to validate scoring, verdicts, and report
generation logic.

Run: python test_scoring.py
"""

import unittest
from dataclasses import dataclass, field
from typing import Optional


# ── Scoring engine (mirrors interview-vibes.html logic) ──

CATEGORIES = {
    "comm":  {"questions": ["comm-1", "comm-2", "comm-3"],    "name": "Communication & Clarity",    "short": "Communication"},
    "story": {"questions": ["story-1", "story-2", "story-3"], "name": "Story Consistency",          "short": "Consistency"},
    "tech":  {"questions": ["tech-1", "tech-2", "tech-3"],    "name": "Technical Credibility",      "short": "Technical"},
    "own":   {"questions": ["own-1", "own-2", "own-3"],       "name": "Ownership & Accountability", "short": "Ownership"},
    "solve": {"questions": ["solve-1", "solve-2", "solve-3"], "name": "Problem-Solving & Pressure", "short": "Problem-Solving"},
    "vibe":  {"questions": ["vibe-1", "vibe-2", "vibe-3"],    "name": "The Vibe",                   "short": "Vibe"},
}

ALL_QUESTIONS = []
for cat in CATEGORIES.values():
    ALL_QUESTIONS.extend(cat["questions"])

PROBE_QUESTIONS = ["tech-p1", "tech-p2", "own-p1"]

VERDICTS = [
    {"min": 83, "label": "Strong Pass",  "cls": "verdict-strong-pass"},
    {"min": 67, "label": "Likely Pass",   "cls": "verdict-likely-pass"},
    {"min": 50, "label": "Borderline",    "cls": "verdict-borderline"},
    {"min": 33, "label": "Unlikely",      "cls": "verdict-unlikely"},
    {"min": 0,  "label": "No Pass",       "cls": "verdict-no-pass"},
]


def get_verdict(pct: int) -> dict:
    for v in VERDICTS:
        if pct >= v["min"]:
            return v
    return VERDICTS[-1]


def calculate_score(answers: dict) -> dict:
    """
    Takes a dict of {question_name: score} and returns full assessment.
    Scores must be 0, 1, or 2. Missing questions default to 1 (neutral).
    """
    category_scores = {}
    total = 0

    for cat_key, cat in CATEGORIES.items():
        cat_score = sum(answers.get(q, 1) for q in cat["questions"])
        category_scores[cat_key] = cat_score
        total += cat_score

    pct = round((total / 36) * 100)
    verdict = get_verdict(pct)

    # Determine probe recommendations
    tech_weak = any(answers.get(q, 1) == 0 for q in CATEGORIES["tech"]["questions"])
    own_weak = any(answers.get(q, 1) == 0 for q in CATEGORIES["own"]["questions"])

    # Probe scores (if provided)
    probe_scores = {}
    for pq in PROBE_QUESTIONS:
        if pq in answers:
            probe_scores[pq] = answers[pq]

    # Strengths and concerns
    strengths = [cat_key for cat_key, s in category_scores.items() if s >= 5]
    concerns = [cat_key for cat_key, s in category_scores.items() if s <= 2]
    weak_cats = [cat_key for cat_key, s in category_scores.items() if s <= 3]

    return {
        "total": total,
        "max": 36,
        "percentage": pct,
        "verdict": verdict["label"],
        "verdict_cls": verdict["cls"],
        "category_scores": category_scores,
        "strengths": strengths,
        "concerns": concerns,
        "weak_categories": weak_cats,
        "tech_probe_recommended": tech_weak,
        "own_probe_recommended": own_weak,
        "probe_scores": probe_scores,
    }


# ── Candidate profiles ──

def make_profile(name: str, answers: dict, description: str = "") -> dict:
    """Helper to create a named candidate profile."""
    return {"name": name, "answers": answers, "description": description}


# All questions score 2 (best)
STRONG_CANDIDATE = make_profile(
    "Strong Candidate",
    {q: 2 for q in ALL_QUESTIONS},
    "Excellent across the board — should be a clear pass"
)

# All questions score 1 (neutral default)
NEUTRAL_CANDIDATE = make_profile(
    "Neutral Candidate",
    {q: 1 for q in ALL_QUESTIONS},
    "Perfectly average — the default state"
)

# All questions score 0 (worst)
WEAK_CANDIDATE = make_profile(
    "Weak Candidate",
    {q: 0 for q in ALL_QUESTIONS},
    "Fails on every dimension"
)

# High technical surface knowledge but no real ownership or depth
AI_ONLY_CANDIDATE = make_profile(
    "AI-Only Candidate",
    {
        "comm-1": 2, "comm-2": 2, "comm-3": 1,   # Communicates well (AI helps with phrasing)
        "story-1": 1, "story-2": 0, "story-3": 0, # Story falls apart under probing
        "tech-1": 1, "tech-2": 0, "tech-3": 0,    # Surface knowledge, no depth beyond rehearsed
        "own-1": 0, "own-2": 0, "own-3": 0,       # Can't distinguish own work — because there isn't much
        "solve-1": 0, "solve-2": 0, "solve-3": 1,  # Freezes on unknowns, somewhat engaged
        "vibe-1": 1, "vibe-2": 1, "vibe-3": 1,    # Neutral vibe
        # Probes would reveal:
        "tech-p1": 0, "tech-p2": 0,                # Observed only, can't elaborate
        "own-p1": 0,                                # Someone else's experience
    },
    "Candidate who relies heavily on AI — good surface knowledge but no real depth or ownership"
)

# Great communicator, great vibe, but no technical substance
GOOD_TALKER_BAD_DOER = make_profile(
    "Good Talker, Bad Doer",
    {
        "comm-1": 2, "comm-2": 2, "comm-3": 2,    # Excellent communicator
        "story-1": 2, "story-2": 1, "story-3": 1,  # Decent story (they're good at talking)
        "tech-1": 0, "tech-2": 0, "tech-3": 0,     # No technical depth at all
        "own-1": 1, "own-2": 0, "own-3": 0,        # Can't back up ownership
        "solve-1": 1, "solve-2": 0, "solve-3": 1,  # Can't solve but stays engaged
        "vibe-1": 2, "vibe-2": 2, "vibe-3": 2,     # Great vibe — charming person
    },
    "Charismatic person who can talk well but has no technical substance to back it up"
)

# Knows their stuff but nervous — low communication and vibe scores
NERVOUS_BUT_CAPABLE = make_profile(
    "Nervous but Capable",
    {
        "comm-1": 0, "comm-2": 1, "comm-3": 0,    # Struggles to express clearly
        "story-1": 2, "story-2": 2, "story-3": 2,  # Consistent because it's real
        "tech-1": 2, "tech-2": 2, "tech-3": 2,     # Solid technical depth
        "own-1": 2, "own-2": 2, "own-3": 2,        # Clear ownership
        "solve-1": 2, "solve-2": 2, "solve-3": 1,  # Good reasoning, fades under pressure
        "vibe-1": 0, "vibe-2": 1, "vibe-3": 0,     # Awkward vibe due to nerves
    },
    "Technically solid with real experience but extremely nervous — communication suffers"
)

# Good story that doesn't hold up — inconsistent details
INCONSISTENT_STORYTELLER = make_profile(
    "Inconsistent Storyteller",
    {
        "comm-1": 2, "comm-2": 1, "comm-3": 1,    # Decent communication
        "story-1": 0, "story-2": 0, "story-3": 0,  # Totally inconsistent story
        "tech-1": 1, "tech-2": 1, "tech-3": 1,     # Average technical
        "own-1": 1, "own-2": 0, "own-3": 1,        # Ownership wavers
        "solve-1": 1, "solve-2": 1, "solve-3": 1,  # Average problem solving
        "vibe-1": 1, "vibe-2": 1, "vibe-3": 1,     # Neutral vibe
    },
    "Tells a different story each time — major red flag for experience inflation"
)

# Senior engineer who checks every box but isn't personable
TECHNICALLY_PERFECT_NO_VIBE = make_profile(
    "Technically Perfect, No Vibe",
    {
        "comm-1": 2, "comm-2": 2, "comm-3": 2,
        "story-1": 2, "story-2": 2, "story-3": 2,
        "tech-1": 2, "tech-2": 2, "tech-3": 2,
        "own-1": 2, "own-2": 2, "own-3": 2,
        "solve-1": 2, "solve-2": 2, "solve-3": 2,
        "vibe-1": 0, "vibe-2": 0, "vibe-3": 0,     # Zero vibe
    },
    "Technically perfect but would be painful to work with daily"
)

# Just above the borderline — edge case
BORDERLINE_PASS = make_profile(
    "Borderline Pass",
    {
        "comm-1": 2, "comm-2": 1, "comm-3": 1,
        "story-1": 1, "story-2": 2, "story-3": 1,
        "tech-1": 2, "tech-2": 1, "tech-3": 1,
        "own-1": 1, "own-2": 1, "own-3": 2,
        "solve-1": 1, "solve-2": 2, "solve-3": 1,
        "vibe-1": 2, "vibe-2": 1, "vibe-3": 1,
    },
    "Right at the likely pass threshold — 24/36 = 67%"
)


# ── Tests ──

class TestScoringEngine(unittest.TestCase):
    """Tests for the core scoring algorithm."""

    def test_max_score(self):
        result = calculate_score({q: 2 for q in ALL_QUESTIONS})
        self.assertEqual(result["total"], 36)
        self.assertEqual(result["percentage"], 100)

    def test_min_score(self):
        result = calculate_score({q: 0 for q in ALL_QUESTIONS})
        self.assertEqual(result["total"], 0)
        self.assertEqual(result["percentage"], 0)

    def test_neutral_score(self):
        result = calculate_score({q: 1 for q in ALL_QUESTIONS})
        self.assertEqual(result["total"], 18)
        self.assertEqual(result["percentage"], 50)

    def test_missing_answers_default_to_1(self):
        result = calculate_score({})
        self.assertEqual(result["total"], 18)
        self.assertEqual(result["percentage"], 50)

    def test_category_score_isolation(self):
        answers = {q: 0 for q in ALL_QUESTIONS}
        answers["comm-1"] = 2
        answers["comm-2"] = 2
        answers["comm-3"] = 2
        result = calculate_score(answers)
        self.assertEqual(result["category_scores"]["comm"], 6)
        self.assertEqual(result["category_scores"]["tech"], 0)

    def test_single_question_change(self):
        base = {q: 1 for q in ALL_QUESTIONS}
        base["vibe-1"] = 2
        result = calculate_score(base)
        self.assertEqual(result["total"], 19)


class TestVerdicts(unittest.TestCase):
    """Tests for verdict thresholds."""

    def test_strong_pass(self):
        self.assertEqual(get_verdict(100)["label"], "Strong Pass")
        self.assertEqual(get_verdict(83)["label"], "Strong Pass")

    def test_likely_pass(self):
        self.assertEqual(get_verdict(82)["label"], "Likely Pass")
        self.assertEqual(get_verdict(67)["label"], "Likely Pass")

    def test_borderline(self):
        self.assertEqual(get_verdict(66)["label"], "Borderline")
        self.assertEqual(get_verdict(50)["label"], "Borderline")

    def test_unlikely(self):
        self.assertEqual(get_verdict(49)["label"], "Unlikely")
        self.assertEqual(get_verdict(33)["label"], "Unlikely")

    def test_no_pass(self):
        self.assertEqual(get_verdict(32)["label"], "No Pass")
        self.assertEqual(get_verdict(0)["label"], "No Pass")

    def test_boundary_83(self):
        """83% should be Strong Pass, 82% should be Likely Pass."""
        self.assertEqual(get_verdict(83)["label"], "Strong Pass")
        self.assertEqual(get_verdict(82)["label"], "Likely Pass")

    def test_boundary_67(self):
        self.assertEqual(get_verdict(67)["label"], "Likely Pass")
        self.assertEqual(get_verdict(66)["label"], "Borderline")


class TestProbeRecommendations(unittest.TestCase):
    """Tests for probe recommendation logic."""

    def test_no_probes_when_neutral(self):
        result = calculate_score({q: 1 for q in ALL_QUESTIONS})
        self.assertFalse(result["tech_probe_recommended"])
        self.assertFalse(result["own_probe_recommended"])

    def test_tech_probe_on_zero(self):
        answers = {q: 1 for q in ALL_QUESTIONS}
        answers["tech-2"] = 0
        result = calculate_score(answers)
        self.assertTrue(result["tech_probe_recommended"])
        self.assertFalse(result["own_probe_recommended"])

    def test_own_probe_on_zero(self):
        answers = {q: 1 for q in ALL_QUESTIONS}
        answers["own-1"] = 0
        result = calculate_score(answers)
        self.assertFalse(result["tech_probe_recommended"])
        self.assertTrue(result["own_probe_recommended"])

    def test_both_probes_triggered(self):
        answers = {q: 1 for q in ALL_QUESTIONS}
        answers["tech-3"] = 0
        answers["own-2"] = 0
        result = calculate_score(answers)
        self.assertTrue(result["tech_probe_recommended"])
        self.assertTrue(result["own_probe_recommended"])

    def test_probe_scores_tracked(self):
        answers = {q: 1 for q in ALL_QUESTIONS}
        answers["tech-p1"] = 0
        answers["tech-p2"] = 2
        answers["own-p1"] = 1
        result = calculate_score(answers)
        self.assertEqual(result["probe_scores"]["tech-p1"], 0)
        self.assertEqual(result["probe_scores"]["tech-p2"], 2)
        self.assertEqual(result["probe_scores"]["own-p1"], 1)


class TestCandidateProfiles(unittest.TestCase):
    """Tests for specific candidate scenarios."""

    def test_strong_candidate(self):
        result = calculate_score(STRONG_CANDIDATE["answers"])
        self.assertEqual(result["verdict"], "Strong Pass")
        self.assertEqual(result["percentage"], 100)
        self.assertEqual(len(result["concerns"]), 0)
        self.assertEqual(len(result["strengths"]), 6)

    def test_weak_candidate(self):
        result = calculate_score(WEAK_CANDIDATE["answers"])
        self.assertEqual(result["verdict"], "No Pass")
        self.assertEqual(result["percentage"], 0)
        self.assertEqual(len(result["concerns"]), 6)
        self.assertEqual(len(result["strengths"]), 0)

    def test_neutral_candidate_is_borderline(self):
        result = calculate_score(NEUTRAL_CANDIDATE["answers"])
        self.assertEqual(result["verdict"], "Borderline")

    def test_ai_only_candidate(self):
        result = calculate_score(AI_ONLY_CANDIDATE["answers"])
        # Should be low — AI knowledge without substance
        self.assertLessEqual(result["percentage"], 33)
        self.assertIn("own", result["concerns"])
        self.assertTrue(result["tech_probe_recommended"])
        self.assertTrue(result["own_probe_recommended"])
        # Communication might be a strength (AI helps phrase things)
        self.assertIn("comm", result["strengths"])

    def test_good_talker_bad_doer(self):
        result = calculate_score(GOOD_TALKER_BAD_DOER["answers"])
        # Should flag technical gaps despite good communication
        self.assertIn("tech", result["concerns"])
        self.assertIn("comm", result["strengths"])
        self.assertIn("vibe", result["strengths"])
        # Overall should not pass
        self.assertLess(result["percentage"], 67)

    def test_nervous_but_capable(self):
        result = calculate_score(NERVOUS_BUT_CAPABLE["answers"])
        # Has real skills but poor presentation
        self.assertIn("tech", result["strengths"])
        self.assertIn("own", result["strengths"])
        self.assertIn("story", result["strengths"])
        # Communication and vibe are weak
        self.assertIn("comm", result["concerns"])
        self.assertIn("vibe", result["concerns"])
        # Should still be in passing range due to strong fundamentals
        self.assertGreaterEqual(result["percentage"], 50)

    def test_inconsistent_storyteller(self):
        result = calculate_score(INCONSISTENT_STORYTELLER["answers"])
        # Story consistency should be flagged hard
        self.assertIn("story", result["concerns"])
        self.assertEqual(result["category_scores"]["story"], 0)
        # Should be borderline or lower
        self.assertLess(result["percentage"], 67)

    def test_technically_perfect_no_vibe(self):
        result = calculate_score(TECHNICALLY_PERFECT_NO_VIBE["answers"])
        # Tech is great
        self.assertIn("tech", result["strengths"])
        # Vibe is terrible
        self.assertIn("vibe", result["concerns"])
        # Still should pass due to overwhelming technical strength
        self.assertGreaterEqual(result["percentage"], 83)

    def test_borderline_pass(self):
        result = calculate_score(BORDERLINE_PASS["answers"])
        self.assertEqual(result["total"], 24)
        self.assertEqual(result["percentage"], 67)
        self.assertEqual(result["verdict"], "Likely Pass")


class TestStrengthsAndConcerns(unittest.TestCase):
    """Tests for the strengths/concerns classification."""

    def test_strength_threshold(self):
        """Category score >= 5 is a strength."""
        answers = {q: 1 for q in ALL_QUESTIONS}
        answers["comm-1"] = 2
        answers["comm-2"] = 2
        answers["comm-3"] = 1
        result = calculate_score(answers)
        self.assertIn("comm", result["strengths"])

    def test_concern_threshold(self):
        """Category score <= 2 is a concern."""
        answers = {q: 1 for q in ALL_QUESTIONS}
        answers["tech-1"] = 0
        answers["tech-2"] = 1
        answers["tech-3"] = 0
        result = calculate_score(answers)
        self.assertIn("tech", result["concerns"])

    def test_neutral_is_neither(self):
        """Category score 3-4 is neither strength nor concern."""
        answers = {q: 1 for q in ALL_QUESTIONS}
        result = calculate_score(answers)
        self.assertEqual(len(result["strengths"]), 0)
        self.assertEqual(len(result["concerns"]), 0)

    def test_weak_categories_threshold(self):
        """Category score <= 3 is a weak category (for action items)."""
        answers = {q: 1 for q in ALL_QUESTIONS}
        result = calculate_score(answers)
        # All at 3/6 — all are weak
        self.assertEqual(len(result["weak_categories"]), 6)

    def test_no_weak_categories_when_all_strong(self):
        answers = {q: 2 for q in ALL_QUESTIONS}
        result = calculate_score(answers)
        self.assertEqual(len(result["weak_categories"]), 0)


class TestEdgeCases(unittest.TestCase):
    """Edge cases and boundary conditions."""

    def test_all_same_value(self):
        for val in [0, 1, 2]:
            result = calculate_score({q: val for q in ALL_QUESTIONS})
            self.assertEqual(result["total"], val * 18)

    def test_score_bounds(self):
        """Score should always be between 0 and 36."""
        import random
        for _ in range(100):
            answers = {q: random.choice([0, 1, 2]) for q in ALL_QUESTIONS}
            result = calculate_score(answers)
            self.assertGreaterEqual(result["total"], 0)
            self.assertLessEqual(result["total"], 36)
            self.assertGreaterEqual(result["percentage"], 0)
            self.assertLessEqual(result["percentage"], 100)

    def test_percentage_rounding(self):
        """Percentage should be rounded to nearest integer."""
        # 1/36 = 2.777... should round to 3
        answers = {q: 0 for q in ALL_QUESTIONS}
        answers["comm-1"] = 1
        result = calculate_score(answers)
        self.assertEqual(result["percentage"], 3)

    def test_probe_scores_dont_affect_main_total(self):
        """Probe answers should not change the main score."""
        base = {q: 1 for q in ALL_QUESTIONS}
        result_without_probes = calculate_score(base)

        with_probes = dict(base)
        with_probes["tech-p1"] = 2
        with_probes["tech-p2"] = 2
        with_probes["own-p1"] = 2
        result_with_probes = calculate_score(with_probes)

        self.assertEqual(result_without_probes["total"], result_with_probes["total"])
        self.assertEqual(result_without_probes["percentage"], result_with_probes["percentage"])


if __name__ == "__main__":
    # Print profile summaries before running tests
    print("\n=== Candidate Profile Summaries ===\n")
    profiles = [
        STRONG_CANDIDATE, NEUTRAL_CANDIDATE, WEAK_CANDIDATE,
        AI_ONLY_CANDIDATE, GOOD_TALKER_BAD_DOER, NERVOUS_BUT_CAPABLE,
        INCONSISTENT_STORYTELLER, TECHNICALLY_PERFECT_NO_VIBE, BORDERLINE_PASS,
    ]
    for p in profiles:
        r = calculate_score(p["answers"])
        probes_str = ""
        if r["tech_probe_recommended"] or r["own_probe_recommended"]:
            probes_str = " [PROBES: "
            if r["tech_probe_recommended"]:
                probes_str += "tech"
            if r["own_probe_recommended"]:
                probes_str += (" + " if r["tech_probe_recommended"] else "") + "own"
            probes_str += "]"
        print(f"  {p['name']:40s} {r['total']:2d}/36 ({r['percentage']:3d}%) -> {r['verdict']}{probes_str}")
        if p["description"]:
            print(f"    {p['description']}")
        if r["strengths"]:
            print(f"    Strengths: {', '.join(CATEGORIES[s]['short'] for s in r['strengths'])}")
        if r["concerns"]:
            print(f"    Concerns:  {', '.join(CATEGORIES[c]['short'] for c in r['concerns'])}")
        print()

    print("=== Running Tests ===\n")
    unittest.main(verbosity=2)
