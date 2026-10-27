# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary now:** recruiters and hiring managers screening Systems Engineering co-op candidates, Vancouver / Lower Mainland first. They arrive from a resume, LinkedIn or a link preview and decide in minutes whether to reach out.
- **Later:** the same site grows into a full-time job portfolio after graduation, so it must hold more projects and roles without being rebuilt.
- Secondary visitors (classmates, clubs, friends) are welcome but not the audience design decisions optimize for.

## Product Purpose

Jack Luk's personal portfolio. It shows what he has built and how he works, so that a recruiter or engineer can judge him as a candidate. Success means a visitor reaches out by email or LinkedIn, downloads the resume, or asks for an interview.

## Positioning

Builds across hardware and software, and both halves are real:

- **Hardware and embedded:** FPGA/VHDL, an STM32 and Raspberry Pi linked over CAN bus, sensors and servos, soldering and lab equipment.
- **Software:** the software side leans AI and machine learning. Examples are the posture-detection classifiers (MediaPipe + scikit-learn), Gemini-powered menu and receipt reading in Split, the Gemini + ElevenLabs companion in Sakura Assistant, and OpenCV vision in the rear monitor.

What sets him apart is that each project write-up shows real specs, real results and honest lessons, not just claims.

## Operating Context

- Visitors reach the site through the resume PDF, LinkedIn, GitHub, or the OG link preview at jackluk.com.
- Typical visit: skim the Home page (hero, about, current project, experience, skills, contact), open one or two project pages, maybe glance at Beyond.
- The site is static, built with React + TypeScript + Vite and deployed on Vercel with SPA rewrites. It was rebuilt from an earlier Framer version, whose experiments and save points are in `reference/` (not part of the site).

## Capabilities and Constraints

- Four pages: Home, Projects, Project (one per slug) and Beyond, plus NotFound.
- **Binding:** content is data-driven. Projects and experience live in `src/data/projects.json` and `src/data/experience.json` (project write-ups are HTML in `content`). Skills, links and albums live in `src/data/site.tsx`, and photos in `src/data/photos.ts`. New content must be addable by editing data, not components.
- Photo slots that are still empty show "Photo spot" placeholders only in local dev. The live site omits them.

## Brand Commitments

- **Voice (binding):** plain and factual. Use concrete specs, measured results and lessons learned, with no marketing hype or inflated claims.
- **Beyond page (binding):** the personal-life albums (Hikes, Recent Art, Sports, Cars, Events) stay. The site presents a person, not only a resume.
- **Not binding:** the current look (yellow R34 hero, touge night-city background, car-culture personality, Inter + Pixelify Sans) is the incumbent world, not a commitment, and a redesign may replace it.
- **Name and links:** Jack Luk, with links to GitHub `jaeak` and LinkedIn `jack-luk`.

## Evidence on Hand

- **Projects:** FPGA Digital Alarm Clock (ENSC 252, team of 2), AI Posture Detection System (Greater Vancouver Regional Science Fair finalist), Automatic Blueberry Sorter (ENSC 100W, project manager for a team of 8), Split (ProtoHacks, team of 4), Animu, and Sakura Assistant (StormHacks 2026, team of 4). Write-ups, diagrams and covers are in `src/data/projects.json`.
- **Current work:** the Vision-Based Rear Monitor (Raspberry Pi 5 + OpenCV, STM32, CAN bus), described in `src/data/site.tsx`.
- **Experience:**
  - SFU Racerbot (onboard Jetson computer).
  - 33rd Richmond Scouts youth leader (Medal for Good Service, DEA, 5 years of service).
  - STEM tutor.
  - Salvation Army Christmas outreach, featured on Global News.
- **Assets:**
  - The resume at `public/Jack_Luk_Resume.pdf`.
  - Photos in `public/photos/` (about, experience, life).
  - The OG card at `public/og.jpg` and the favicon.
- **Absent:** no testimonials, references, employer quotes, metrics beyond those in the write-ups, or work-term results exist. Never fabricate them.

## Product Principles

1. **Proof over claims.** Every skill or strength should trace back to a project, spec, result or photo on the site.
2. **Hardware and AI software, side by side.** Neither half reads as a footnote to the other.
3. **Fast to judge.** A recruiter should get who Jack is, what he builds, and how to contact him from the first screen and one scroll.
4. **Grows without a rebuild.** New projects, roles and photos go in through data. The structure has to scale from co-op portfolio to full-time portfolio.
5. **A person, not a resume.** Beyond and the personal details stay. They are part of why someone remembers him.
