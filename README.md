<div align="center">

# Vibe Check

Behavioral interview scorecard. Quantify the vibes with 18 questions, 6 categories, and chess piece archetype matching.

[![Live][badge-site]][url-site]
[![HTML5][badge-html]][url-html]
[![CSS3][badge-css]][url-css]
[![JavaScript][badge-js]][url-js]
[![Claude Code][badge-claude]][url-claude]
[![License][badge-license]](LICENSE)

[badge-site]:    https://img.shields.io/badge/live_site-0063e5?style=for-the-badge&logo=googlechrome&logoColor=white
[badge-html]:    https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[badge-css]:     https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[badge-js]:      https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[badge-claude]:  https://img.shields.io/badge/Claude_Code-CC785C?style=for-the-badge&logo=anthropic&logoColor=white
[badge-license]: https://img.shields.io/badge/license-MIT-404040?style=for-the-badge

[url-site]:   https://interviews.neorgon.com/
[url-html]:   #
[url-css]:    #
[url-js]:     #
[url-claude]: https://claude.ai/code

</div>

---

## Why this exists

With AI, everyone can answer technical questions. The real differentiation is in practical experience, communication, and how people handle pressure. This tool helps interviewers systematically assess behavioral signals that are normally left to gut feeling.

The goal is equilibrium: technical questions test knowledge, but behavioral assessment tests whether that knowledge is real, owned, and usable in a client-facing context.

Based on practical experience from conducting and preparing people for technical interviews (see part-1.md, part-2.md, part-3.md for the full philosophy).

## How it works

- 18 base questions across 6 categories, each scored 0-1-2
- 8 optional probe questions that dig deeper into Technical, Ownership, and Problem-Solving concerns
- A pass probability percentage with verdict (Strong Pass / Likely Pass / Borderline / Unlikely / No Pass)
- Two downloadable markdown reports: one for internal PM review, one for candidate feedback

## Question matrix

### Communication & Clarity

| # | Question | Good (2) | Neutral (1) | Red Flag (0) | What It Measures |
|---|----------|----------|-------------|---------------|------------------|
| 1 | Does this person explain themselves clearly? | Clear, logical, appropriate detail | Gets there but not efficiently | Confusing, jargon-heavy, or can't articulate | Client-facing communication readiness |
| 2 | Can they structure and organize their thoughts? | Beginning-middle-end flow | Partially organized | Jumps between topics, loses the thread | Documentation and standup communication |
| 3 | Do they adapt their level of detail? | Reads the room naturally | Adjusts with prompting | Rigid, same depth regardless of audience | Stakeholder adaptability |

### Story Consistency

| # | Question | Good (2) | Neutral (1) | Red Flag (0) | What It Measures |
|---|----------|----------|-------------|---------------|------------------|
| 4 | Is their experience narrative consistent? | Same story every time | Minor discrepancies | Contradicts themselves | Experience authenticity |
| 5 | Do details hold from different angles? | Solid from any direction | Wavers on rephrasing | Falls apart under angle changes | Depth of actual involvement |
| 6 | Can they provide specific examples? | Names, dates, metrics ready | Needs time but gets there | Vague generalities only | Genuine hands-on experience |

### Technical Credibility

| # | Question | Good (2) | Neutral (1) | Red Flag (0) | What It Measures |
|---|----------|----------|-------------|---------------|------------------|
| 7 | Are there technical gaps in their story? | None — depth matches claims | Some surface-level gaps | Major gaps between claims and knowledge | Resume accuracy |
| 8 | Do they understand the "why" behind decisions? | Explains reasoning and trade-offs | Knows what but not why | Cannot explain any reasoning | Seniority level |
| 9 | Can they go beyond rehearsed answers? | Handles curve balls well | Partially adapts | Stuck on prepared talking points | Battle-tested vs. memorized knowledge |

**Probe questions** (optional, recommended when any question above scores 0):

| # | Probe Question | Good (2) | Neutral (1) | Red Flag (0) |
|---|----------------|----------|-------------|---------------|
| P1 | Does exposure come from hands-on work? | Hands-on with error details | Mixed hands-on and observation | Observed only |
| P2 | Can they elaborate on implementations? | File names, configs, commands | Vague process description | Cannot provide details |

### Ownership & Accountability

| # | Question | Good (2) | Neutral (1) | Red Flag (0) | What It Measures |
|---|----------|----------|-------------|---------------|------------------|
| 10 | Do they distinguish their work from team's? | Clear "I did X, we did Y" | Vague boundaries | Claims everything as solo work | Self-awareness and honesty |
| 11 | Does ownership hold under probing? | Consistent detail throughout | Gets vague when pressed | Story falls apart | Authenticity of claims |
| 12 | Can they explain personal decisions? | Context, constraints, reasoning | Partially explains | Cannot explain own choices | Actual decision-making role |

**Probe question** (optional, recommended when any question above scores 0):

| # | Probe Question | Good (2) | Neutral (1) | Red Flag (0) |
|---|----------------|----------|-------------|---------------|
| P3 | Is this their experience or a coworker's? | Their own with emotional detail | Shared experience | Likely someone else's story |

### Problem-Solving & Pressure

| # | Question | Good (2) | Neutral (1) | Red Flag (0) | What It Measures |
|---|----------|----------|-------------|---------------|------------------|
| 13 | How do they handle not knowing? | Acknowledges and reasons through | Deflects or redirects | Freezes or bluffs | Intellectual honesty |
| 14 | Can they reason in real-time? | Systematic, asks clarifying Qs | Gets there slowly | Cannot work through unknowns | Troubleshooting capability |
| 15 | Do they stay engaged under pressure? | Leans in, stays constructive | Energy fades but persists | Checks out or gets defensive | Client-pressure resilience |

**Probe questions** (optional, recommended when any question above scores 0):

| # | Probe Question | Good (2) | Neutral (1) | Red Flag (0) |
|---|----------------|----------|-------------|---------------|
| P4 | Can they reason through a design trade-off they haven't rehearsed? | Weighs pros/cons, asks clarifying Qs | Partial reasoning | Cannot reason through it |
| P5 | Do they understand what breaks when you change a constraint? | Predicts cascading effects | Guesses | No idea |
| P6 | Can they explain when NOT to use a pattern they mentioned? | Knows limits and downsides | Vague sense | Blindly applies patterns |
| P7 | Can they simplify an over-engineered proposal? | Pushes back with reasoning | Hesitates | Agrees blindly |
| P8 | Can they walk through debugging a system they didn't build? | Systematic approach | Ad hoc guessing | Lost |

### The Vibe

| # | Question | Good (2) | Neutral (1) | Red Flag (0) | What It Measures |
|---|----------|----------|-------------|---------------|------------------|
| 16 | Would you work with this person daily? | Definitely — good energy | Maybe — neutral impression | No — personality concerns | Team fit gut check |
| 17 | Do they show genuine role interest? | Asks specific questions, researched | Somewhat interested | Going through the motions | Engagement predictor |
| 18 | Is their response pace reasonable? | Concise and confident | Slow but eventually gets there | Painfully slow or rambling | Client interaction readiness |

## Piece profile

Based on [The Core Five](https://minibooks.lucianoadonis.com/pages/thesis-the-core-five) framework, the tool maps assessment scores to chess piece archetypes. Each of the 6 assessment categories maps to a dimension:

| Category | Dimension | What It Represents |
|----------|-----------|-------------------|
| Technical Credibility | Power | Raw technical capability and depth |
| Communication & Clarity | Range | Breadth of solutions across contexts |
| Story Consistency | Foresight | Ability to anticipate and plan ahead |
| Ownership & Accountability | Insight | Contextual awareness and decision-making |
| The Vibe | Versatility | Adaptability across teams and situations |
| Problem-Solving & Pressure | Speed | Performance under pressure and deadlines |

### The pieces

| Piece | Profile | Best For |
|-------|---------|----------|
| Queen | High across all dimensions | Leads, architects, people who unblock entire teams |
| Rook | High Power + Speed, low Range/Versatility | Execution-heavy roles with clear, well-defined scope |
| Bishop | High Foresight + Insight, low Power/Speed | Architecture, planning, risk assessment |
| Knight | High Range + Versatility, medium elsewhere | Cross-team problems, innovation, complex environments |
| Pawn | Low across all (currently) | Juniors with promotion potential — placement determines growth |

The tool auto-detects the best-matching piece from scores. Interviewers can override the selection to reflect their own assessment. The piece profile is included in the internal review report.

## Scoring

- **Max score:** 36 (18 questions x 2 points each)
- **Probe questions** are tracked separately and appear in reports but don't affect the main score
- **Pass probability** = (score / 36) x 100%

| Score Range | Percentage | Verdict | Recommendation |
|-------------|------------|---------|----------------|
| 30-36 | 83-100% | Strong Pass | Proceed to client interview |
| 24-29 | 67-82% | Likely Pass | Proceed with targeted prep |
| 18-23 | 50-66% | Borderline | Hold for further evaluation |
| 12-17 | 33-49% | Unlikely | Do not proceed at this time |
| 0-11 | 0-32% | No Pass | Do not proceed |

## Reports

Two markdown files are generated:

### Internal Review (for PM)
- Full scores per question with ratings
- Probe findings (if probes were used)
- Auto-generated strengths and concerns
- Category-specific action items for weak areas
- Overall recommendation based on verdict
- Interviewer notes

### Candidate Feedback
- Diplomatic overall impression
- Strengths highlighted
- Areas for growth with specific, actionable suggestions
- Suggested next steps based on performance level
- Professional and encouraging tone

## Testing

Run the Python test suite to validate scoring logic across different candidate profiles:

```bash
python test_scoring.py
```

Test profiles include: strong candidate, AI-only candidate, inconsistent storyteller, good talker with no substance, nervous but capable, and more.

## Files

- `index.html` — The assessment tool (single-file, no dependencies)
- `test_scoring.py` — Python unit tests for scoring logic
- `part-1.md` — Interview preparation and mindset
- `part-2.md` — Interview phases and the "feeling" factor
- `part-3.md` — Technical question reference

## Usage

Open `index.html` in any browser. No server required. Fill in the assessment during or after an interview, download the reports, share with your PM.

---

<div align="center"><sub>Part of <a href="https://neorgon.com">Neorgon</a></sub></div>
