# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vibe Check is a behavioral interview scorecard that helps interviewers quantify behavioral observations during candidate interviews. It scores 18 questions across 6 categories (0-1-2 each, max 36), calculates a pass probability percentage, and generates two downloadable Markdown reports (internal PM review + candidate feedback).

**Live:** interviews.neorgon.com

## Commands

```bash
# Serve locally (ES modules require a server)
python3 -m http.server

# Run Playwright E2E tests (60 tests — spins up a local server automatically)
npm test

# Run Playwright tests with browser visible
npm run test:headed

# Run Python scoring logic tests (49 tests across 9 candidate profiles)
npm run test:scoring
# or directly:
python3 test_scoring.py
```

## Architecture

Modular ES module app: `index.html` shell + `css/style.css` + `js/*.js`.

### Module structure

- `js/app.js` — Entry point (<10 lines), imports and initializes
- `js/state.js` — Shared mutable state (`selectedPiece`)
- `js/data.js` — All constants: CATEGORIES, QUESTION_TEXT, HELP_CONTENT, SUGGESTIONS, VERDICTS, DIMENSION_MAP, PIECE_PROFILES, PLACEHOLDER_NAMES
- `js/utils.js` — Small helpers: getVal, getLabel, getCatScore, getVerdict, getCandidateName, sanitizeName, today, downloadMarkdown
- `js/scoring.js` — Core calculation: calculate, dimMatchScore, calculatePieceMatches, getBestPiece, updatePieceMatrix, updateProbeIndicators
- `js/reports.js` — Report generation: generateInternalReport, generateCandidateReport
- `js/events.js` — Event handlers: help modal, piece selection, reset, downloads, auto-advance. Exposes functions on `window.*` for onclick handlers in HTML.

### Key data structures

- `CATEGORIES` — maps 6 category keys (comm, story, tech, own, solve, vibe) to their question arrays
- `HELP_CONTENT` — 21 entries with `title`, `objective`, `ask[]`, `lookFor[]` for the help modal
- `PIECE_PROFILES` — 5 chess piece archetypes (queen, rook, bishop, knight, pawn) with expected dimension levels
- `DIMENSION_MAP` — maps 6 category keys to Core Five dimensions (tech->Power, comm->Range, story->Foresight, own->Insight, vibe->Versatility, solve->Speed)

### Probe questions

8 optional probes (tech-p1, tech-p2, own-p1, solve-p1 through solve-p5) live inside `<details>/<summary>` dropdowns. They are tracked separately and do NOT affect the main score. The probe tag changes from "Optional" to "Recommended" when any question in that category scores 0.

### test_scoring.py

Python unittest suite that replicates the JS scoring algorithm. Contains:
- `calculate_score(answers)` — Python mirror of the JS `calculate()` function
- `dim_match_score(actual, expected)` / `calculate_piece_matches(category_scores)` — Python mirrors of JS piece matching
- 9 candidate profiles and 7 test classes

**Scoring parity**: When modifying scoring logic in the JS modules, the same change must be reflected in `test_scoring.py` and vice versa. This includes piece matching logic.

## Scoring Rules

- 18 base questions x 2 points = 36 max
- Probe questions tracked separately, never added to main total
- Missing answers default to 1 (neutral)
- Category strength threshold: score >= 5 out of 6
- Category concern threshold: score <= 2 out of 6
- Weak category threshold: score <= 3 out of 6 (triggers action items in reports)
