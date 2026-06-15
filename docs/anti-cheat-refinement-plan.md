# Anti-Cheat Refinement Plan — Vibe Check

## Goal
Turn the scorecard into a practical interviewer aid for detecting candidates who may be using AI or coached answers during the interview itself, while keeping the existing 18-question / 36-point scoring model intact.

## What the agent reviews found

Four focused reviews converged on the same high-value addition: a **collapsed-by-default anti-cheat observations section** that captures behavioral tells, plus a matching report section and sidebar risk indicator. The existing probes already fight rehearsed answers; the missing piece is a structured place to log the *behavioral* signals that expose AI assistance.

## Decisions

1. **No new base questions.** The 18 × 2 scoring scale, test suite, and reports depend on it. Anti-cheat items will be treated as optional probes (report-only, no score impact).
2. **Radio-group observations, not freeform only.** Reusing the existing 0/1/2 radio pattern lets us leverage `getVal`, `getLabel`, help modals, and reset logic with minimal code.
3. **Computed risk, not a manually entered one.** Interviewers tick what they see; the UI derives Low / Medium / High risk from the pattern of red flags.
4. **Internal report only.** Anti-cheat findings must never leak into the candidate feedback report.
5. **Help content for every observation.** Each tell gets an objective, sample prompts, and what to look for.

## Implementation steps

### 1. Data layer (`js/data.js`)
- Add `CHEAT_NAMES` array: `cheat-pace`, `cheat-template`, `cheat-tone`, `cheat-device`, `cheat-offtopic`, `cheat-echo`.
- Append `CHEAT_NAMES` to `PROBE_NAMES` so reset / auto-advance logic includes them.
- Add entries to `QUESTION_TEXT` and `HELP_CONTENT`.

### 2. UI (`index.html`)
- Insert a new `.card` after **The Vibe** and before **Piece Profile**.
- Use `<details class="probe-dropdown" id="cheat-probes">` collapsed by default.
- Include one `control-group` per cheat observation with help trigger and radio options.
- Add a short hint explaining that these are live observations, not scored.

### 3. Styling (`css/style.css`)
- Add `.cheat-dropdown` / `.cheat-indicator` styles matching existing probe dropdowns.
- Add a small `.risk-badge` style for the sidebar.

### 4. Scoring / indicators (`js/scoring.js`, `js/utils.js`)
- Add `getCheatRisk()` helper that counts red-flag (`0`) cheat answers.
- Return `{ label, cls }` like verdicts: `Low`, `Medium`, `High`.
- Render the badge in the sidebar during `calculate()`.

### 5. Reports (`js/reports.js`)
- In `generateInternalReport`, add an `## Anti-Cheat Signals` section listing each observation, its rating, and any notes.
- Append a recommendation line when risk is Medium or High.
- Keep `generateCandidateReport` unchanged.

### 6. Events (`js/events.js`)
- Ensure `resetAssessment()` clears the new radios and closes the anti-cheat details.
- `buildQuestionOrder()` already picks up probes; confirm the new details behaves like existing probe dropdowns.

### 7. Documentation
- Update `README.md` and `CLAUDE.md` with the new section and intended workflow.
- Create `docs/anti-cheat-scenarios.md` with concrete interview scenarios.

### 8. Tests
- Run `python3 test_scoring.py` (should pass unchanged).
- Run `npm test` and fix any Playwright selectors that are unexpectedly affected by new DOM elements.

## Out-of-topic / curveball probes

Two optional follow-ups, triggered by the observations, can be used live:

- **Domain transfer:** ask the candidate to re-explain their last example as if to a junior intern, or in a different domain.
- **Devil's advocate / constraint swap:** ask them to argue against a decision they just defended, or change one constraint and ask what breaks.

These are documented in the help text rather than added as scored questions.
