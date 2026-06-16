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

### Changed

- `README.md` now describes the Anti-Cheat Observations feature and mentions anti-cheat tells in the file tree.
- `CLAUDE.md` updated with the new `HELP_CONTENT` count and anti-cheat data structures.
- `docs/anti-cheat-scenarios.md` cluster rule wording aligned with the count-based risk logic.
