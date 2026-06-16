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

- `js/app.js` — Entry point, imports and initializes modules
- `js/state.js` — Shared mutable state (`selectedPiece`)
- `js/data.js` — All constants: CATEGORIES, QUESTION_TEXT, HELP_CONTENT, SUGGESTIONS, VERDICTS, ROLES, DIMENSION_MAP, PIECE_PROFILES, PLACEHOLDER_NAMES
- `js/utils.js` — Small helpers: getVal, getLabel, getCatScore, getVerdict, getCheatRisk, getCandidateName, sanitizeName, today, downloadMarkdown
- `js/scoring.js` — Core calculation: calculate, calculateMetrics, dimMatchScore, calculatePieceMatches, getBestPiece, updatePieceMatrix, updateProbeIndicators
- `js/reports.js` — Report generation: generateInternalReport, generateCandidateReport
- `js/events.js` — Event handlers: help modal, piece selection, reset, downloads, auto-advance, sessions UI
- `js/keyboard.js` — Keyboard shortcuts: 1/2/3 to rate, ? for help, / to focus name
- `js/session.js` — Form state serialization/deserialization helpers and schema version
- `js/storage.js` — localStorage persistence: save, load, rename, delete, import, export sessions
- `js/timer.js` — Interview timer, timestamp insertion, and keyboard shortcut (Ctrl/Cmd+Shift+T)
- `js/compare.js` — Renders `compare.html` side-by-side candidate comparison

### Key data structures

- `CATEGORIES` — maps 6 category keys (comm, story, tech, own, solve, vibe) to their question arrays
- `HELP_CONTENT` — 27 entries with `title`, `objective`, `ask[]`, `lookFor[]` for the help modal (21 base/probe + 6 anti-cheat)
- `PIECE_PROFILES` — 5 chess piece archetypes (queen, rook, bishop, knight, pawn) with expected dimension levels
- `DIMENSION_MAP` — maps 6 category keys to Core Five dimensions (tech->Power, comm->Range, story->Foresight, own->Insight, vibe->Versatility, solve->Speed)

### Probe questions

8 optional probes (tech-p1, tech-p2, own-p1, solve-p1 through solve-p5) live inside `<details>/<summary>` dropdowns. They are tracked separately and do NOT affect the main score. The probe tag changes from "Optional" to "Recommended" when any question in that category scores 0.

### Anti-cheat observations

6 optional AI / Coaching Tells (`cheat-pace`, `cheat-template`, `cheat-tone`, `cheat-device`, `cheat-offtopic`, `cheat-echo`) live in a collapsed `<details>` card after *The Vibe*. They are tracked as probes, do not affect the 0–36 score, and appear only in the internal review report. A sidebar indicator shows Low / Medium / High risk based on the count of red-flag (`0`) observations.

### Candidate sessions

Assessments are auto-saved to `localStorage`. Users can also save explicitly, open a sessions drawer to load/rename/delete/export/import, and start a new session. Session schema is versioned in `js/session.js`.

### Role selector

The Candidate card has a role dropdown (Individual Contributor / Tech Lead / Engineering Manager). The selected role is persisted and included in the internal review report with role-specific emphasis.

### Keyboard shortcuts

When a question group is focused: `1`/`2`/`3` select the left/middle/right rating, `?` opens help, `/` focuses the candidate name.

### Interview timer

A sidebar timer can start/pause/reset. Insert timestamp buttons append `[MM:SS]` to notes and anti-cheat notes; `Ctrl/Cmd+Shift+T` does the same when a notes textarea is focused. Total duration is included in the internal report.

### Candidate comparison

`compare.html` loads two saved sessions and renders scores, verdicts, category breakdowns, piece profiles, anti-cheat risk, and notes side by side.

### Print report

A Print Report button triggers the browser print dialog. `@media print` styles hide chrome, expand details, and show selected radio labels in a clean layout.

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
