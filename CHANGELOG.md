# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Anti-Cheat Observations** — a collapsed "AI / Coaching Tells" card with six radio-rated observations:
  - Long pause → suddenly fluent / expert answer
  - Generic STAR or blog-post templates
  - Tone or vocabulary shifts mid-interview
  - Looking away from camera / typing before answering
  - Struggling with off-topic or curveball follow-ups
  - Echoing question wording back verbatim
- Sidebar **AI-assist risk** indicator (Low / Medium / High) based on the count of red-flag observations.
- Dedicated **Anti-Cheat Notes** textarea inside the collapsed section for free-form interviewer observations.
- Anti-cheat signals and notes are included in the internal review report; they remain excluded from the candidate feedback report.
- Playwright test coverage for the anti-cheat section, risk indicator, report inclusion/exclusion, and reset behavior.
- **Candidate Sessions** — save, load, rename, delete, import, and export assessments via `localStorage`.
- **Role selector** placeholder in the Candidate card (Individual Contributor / Tech Lead / Engineering Manager).
- Auto-save after form edits with a visible status indicator.
- Sessions drawer accessible from the Candidate card, plus JSON export/import.
- **Keyboard shortcuts** — `1`/`2`/`3` to rate a focused question, `?` for help, `/` to focus the candidate name.
- **Candidate comparison page** (`compare.html`) — side-by-side scores, verdicts, category breakdowns, piece profiles, anti-cheat risk, and notes.
- **Interview timer** — start/pause/reset timer in the sidebar, insert `[MM:SS]` timestamps into notes, and include total duration in the internal report.
- **Print-friendly reports** — Print Report button plus `@media print` styles for a clean printed/PDF output.
- Playwright coverage for sessions, keyboard shortcuts, candidate comparison, roles, timer, and print button.

### Changed

- `README.md` updated to describe sessions, comparison, keyboard shortcuts, timer, role selector, and print report features; file tree and architecture diagrams expanded.
- `CLAUDE.md` updated with the new module list and feature sections.
- `docs/anti-cheat-scenarios.md` cluster rule wording aligned with the count-based risk logic.
