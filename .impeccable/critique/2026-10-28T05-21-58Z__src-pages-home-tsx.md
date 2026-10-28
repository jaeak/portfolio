---
target: home
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\jackl\\Desktop\\Projects\\website\\src\\pages\\Home.tsx"
target_fingerprint: "sha256:0b60ffce2b9cf48e9d9ab798f54f03e59d06f05b50ad00aebdac0c913fbbdaec"
target_path: "C:\\Users\\jackl\\Desktop\\Projects\\website\\src\\pages\\Home.tsx"
timestamp: 2026-10-28T05-21-58Z
slug: src-pages-home-tsx
---
Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Nav active state works; email "copy" toast lasts 1.8s and copying instead of opening mail surprises |
| 2 | Match System / Real World | 2 | "My Life" is vague; fake terminal output; "Other skills" mixes marketing with engineering |
| 3 | User Control and Freedom | 3 | Phone menu Esc/focus fine; terminal + ticker loop forever with no pause |
| 4 | Consistency and Standards | 2 | Mail icon/email button copy instead of mailto; "View projects" scrolls, "View all" navigates; pixel vs Inter buttons |
| 5 | Error Prevention | 3 | Clipboard failure falls back to mailto |
| 6 | Recognition Rather Than Recall | 3 | Icon-only GitHub/LinkedIn/mail in hero; mail action unclear |
| 7 | Flexibility and Efficiency | n/a | Single-path portfolio |
| 8 | Aesthetic and Minimalist Design | 2 | About slogans, ticker duplicating Skills, decorative terminal, 15 flat skills dilute proof |
| 9 | Error Recovery | 3 | NotFound + clipboard fallback |
| 10 | Help and Documentation | n/a | Portfolio needs no help |
| **Total** | | **21/32** | **Acceptable (66%)** |

## Design Specificity Verdict
Half authored, half interchangeable. The proof is specific: Currently-working-on card, spec'd project cards, Racerbot/Scouts photos. The shell around it is generic: stock Unsplash R34 hero (credited to KC Shum in the footer), About slogans "Turning ideas into working systems" / "Build things that matter", fake MiniTerminal, logo ticker repeating Skills, 15-item flat skills grid incl. Excel / Digital Marketing / Video Production.
Deterministic scan: source scan clean (0); live URL scan 24 findings: low-contrast 13 (muted eyebrow/label grey #6a6d73 on #08090c = 3.8:1), numbered-section-labels 5 ("01 / About"…), kicker-above-heading 1 ("My goal"), pulsing-dot 1 (.live-dot), marquee 1 (.ticker-track), overused-font 1 (Inter 72%), undersized-ui-text 1 (10px terminal bar), straggler 1 ("running" orphan in Racerbot bullets). Overlay injection failed (detect.js connection resets); no overlay.

## Priority Issues
1. [P1] Positioning misses AI proof and skills don't trace to projects. Hero now says "Embedded Systems & Edge AI" (fixed during this run), but TECH_SKILLS lacks OpenCV, MediaPipe, scikit-learn, Gemini, STM32, Raspberry Pi, CAN, Embedded C, while listing Excel, Digital Marketing, Video Production. Fix: regroup into ~3 groups ≤6 (Embedded & hardware / AI & vision / Tools), each tied to the project that proves it; drop/demote fluff. /impeccable clarify, /impeccable distill
2. [P1] Not "fast to judge": Projects starts ~2 screens down (1614px desktop, 1843px mobile); Contact ~9 phone screens down. Fix: Projects right after hero; cut or fold MiniTerminal + ticker; About to one paragraph; add a proof line in hero (finalist · PM team of 8 · SFU Racerbot). /impeccable layout
3. [P2] Contact moment weak: primary email action copies instead of mailto; no co-op term/availability or Vancouver; no Resume in Contact; phone menu lacks email; generic "Let's keep in touch." Fix: mailto primary + small copy icon; availability line (term supplied by Jack); Resume in Contact; email in phone menu. /impeccable clarify
4. [P2] Contrast/accessibility: muted grey token 3.8:1 on 12px eyebrows/labels (13 detector hits); project card aria-label={title} hides summary/specs; project titles not headings; endless terminal/ticker/pulsing dot with no pause (WCAG 2.2.2); no skip link; 42px buttons. Fix: raise --dim to ≥0.6 alpha; drop card aria-label + h3 titles; stop loops after one pass or add pause; skip link; 44px targets. /impeccable audit, /impeccable harden
5. [P2] Borrowed hero: stock R34 carries the first impression; headline sits over the grille/headlights at 1280; on mobile name starts ~y460. Fix: use his own imagery (Racerbot car, rear-monitor rig, his BRZ) or move text clear of the subject. /impeccable bolder (or /impeccable shape)

## Persona Red Flags
- Recruiter (60s from LinkedIn): no project on first screen + one scroll; no highlight line; no co-op term/location; no resume button in Contact.
- Jordan: "My Life" unclear; hero mail icon copies silently; "View projects" vs "View all" behave differently.
- Casey: Contact ~9 screens down; Skills ~1350px of scroll on phone; phone menu has no email; name below half-screen of car.
- Sam: card aria-label hides content; no project headings; eyebrow contrast 3.8:1; endless motion; no skip link.
- Riley: homepage shows projects.slice(0,3) with no featured flag; Racerbot/Scouts cards hard-coded in Home.tsx (breaks data-driven rule); logos/ticker load from framerusercontent.com.

## Minor Observations
"Github" casing; "@" and "A little about me" informal vs factual voice; numbered "01 /" eyebrows are decorative; "Skills & tools" vs "Tools I work with" repeat; scroll cue loops forever; footer's main content is a stock-photo credit; "running" orphan in Racerbot bullet.

## Questions to Consider
1. If the R34 isn't Jack's car or work, what does it prove? Would the Racerbot car or his own rig tell the night-drive story with ownership?
2. What if Home had no Skills section and every skill appeared only as a pill on the project that proves it?
3. Should Contact say exactly what he's looking for, when, and where?
