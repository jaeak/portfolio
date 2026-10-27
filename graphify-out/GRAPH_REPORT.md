# Graph Report - website  (2026-10-27)

## Corpus Check
- 94 files · ~192,661 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .frag 4, .css 2, (none) 1)

## Summary
- 365 nodes · 587 edges · 31 communities (25 shown, 6 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 1% AMBIGUOUS · INFERRED: 62 edges (avg confidence: 0.84)
- Token cost: 423,318 input · 0 output

## Community Hubs (Navigation)
- Layout & Icons
- Navigation & Project Cards
- Photo Galleries & Data
- Node Build & OG Servers
- Framer Content Extraction
- City Light Trails
- Framer Stub API
- Framer Page Transitions
- Framer City Background
- Vercel Config
- NPM Dependencies
- TypeScript Config
- Cars Album
- Brand & Hero Images
- FPGA Toolchain
- SFU Racerbot
- Scouts & Salvation Army
- Events Album
- Site Architecture (README)
- Hiking & Camping
- BCSS Ultimate 2024
- Raspberry Pi 5
- Split Project
- Content Creation
- Snow Lake Hike
- Badminton
- Canary Wharf Reference
- Fonts, Meta & Hero Picks
- Resume & Projects

## God Nodes (most connected - your core abstractions)
1. `react` - 22 edges
2. `GlideLink()` - 20 edges
3. `Home()` - 16 edges
4. `compilerOptions` - 13 edges
5. `Jack Luk Portfolio Site` - 13 edges
6. `Jack Luk Resume` - 12 edges
7. `lucide-react` - 11 edges
8. `thumb()` - 9 edges
9. `GitHubIcon()` - 8 edges
10. `ProjectCard()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `src/data/projects.json` --conceptually_related_to--> `Jack Luk Resume`  [INFERRED]
  README.md → public/Jack_Luk_Resume.pdf
- `OG Link Preview Card (jackluk.com)` --semantically_similar_to--> `Old Framer Link Preview Card`  [INFERRED] [semantically similar]
  public/og.jpg → reference/jack-luk-link-preview.jpg
- `/pagewipe.js page transition` --semantically_similar_to--> `src/lib/glide.ts (sideways page slide)`  [INFERRED] [semantically similar]
  reference/touge/nav.html → README.md
- `Open Graph / Link Preview Meta (jackluk.com/og.jpg)` --references--> `Simon Fraser University (Systems Engineering)`  [INFERRED]
  index.html → public/Jack_Luk_Resume.pdf
- `Spec Plate Project Card Test` --references--> `AI Posture Detection System (OpenCV, MediaPipe)`  [INFERRED]
  reference/touge/spec.html → public/Jack_Luk_Resume.pdf

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Sports and outdoor activities** — public_photos_life_sports_badminton_photo, public_photos_life_ultimate_bcss_2024_photo, public_photos_life_hike_snow_lake_photo [INFERRED 0.75]
- **33rd Richmond Scouts youth leadership and community service** — public_photos_experience_scouts_campfire_campfire_circle, public_photos_experience_scouts_catapults_pioneering_activity, public_photos_experience_salvation_global_news_christmas_meal_service [INFERRED 0.75]
- **FPGA hardware design workflow (simulate, synthesize, deploy)** — public_photos_life_projects_modelsim_modelsim, public_photos_life_projects_fpga_quartus_quartus_prime, public_photos_life_projects_fpga_quartus_de10_standard, public_photos_life_projects_fpga_quartus_fpga_alarm_clock [INFERRED 0.85]
- **Hands-on car modification hobby** — public_photos_life_cars_engine_bay_air_intake_work, public_photos_life_cars_garage_exhaust_install, public_photos_life_cars_sti_light_puddle_light_mod [INFERRED 0.85]
- **R34 photo asset family (source, hero crops, OG card)** — reference_hero_r34_original_source_photo, public_images_hero_r34_small_nissan_skyline_r34_hero, public_images_hero_r34_wide_nissan_skyline_r34_hero, public_og_link_preview_card [INFERRED 0.85]
- **SFU Racerbot hardware + software autonomy stack** — public_photos_experience_racerbot_electronics_autonomous_rc_car, public_photos_experience_racerbot_electronics_lidar_sensor, public_photos_experience_racerbot_workstation_telemetry_dashboard, public_photos_experience_racerbot_workstation_ros_terminal [INFERRED 0.85]
- **Resume projects shown as spec-plate cards** — reference_touge_spec_spec_plate_test, pdf_fpga_digital_alarm_clock, pdf_ai_posture_detection, pdf_automatic_blueberry_sorter [INFERRED 0.85]
- **Framer component test harnesses via framer-stub import map** — reference_touge_back_history_back_test, reference_touge_nav_page_wipe_test, reference_touge_push_push_transition_test, reference_touge_interactive_city_bg_test, reference_touge_interactive_framer_stub [INFERRED 0.85]
- **WebGL fullscreen-triangle background shader experiments** — reference_night_webgl_night_scene, reference_touge_index_touge_scene, reference_water_test_underwater_shader, reference_touge_city_lights_js [INFERRED 0.85]

## Communities (31 total, 6 thin omitted)

### Community 0 - "Layout & Icons"
Cohesion: 0.08
Nodes (36): Brand, Props, Line, Album, Skill, BrandIcon(), CppIcon(), DockerIcon() (+28 more)

### Community 1 - "Navigation & Project Cards"
Cohesion: 0.13
Nodes (25): Props, Project, BackButton(), GlideLink(), plainClick(), ProjectCard(), openLightbox(), RichContent() (+17 more)

### Community 5 - "Photo Galleries & Data"
Cohesion: 0.20
Nodes (16): Photo, Collage(), Gallery(), Lightbox(), PhotoSlot(), thumb(), Beyond(), rowsOf() (+8 more)

### Community 10 - "Node Build & OG Servers"
Cohesion: 0.20
Nodes (5): C, L, S, types, types

### Community 11 - "Framer Content Extraction"
Cohesion: 0.22
Nodes (7): sized(), E, experience, P, projects, sizes, snap

### Community 13 - "City Light Trails"
Cohesion: 0.33
Nodes (7): buildLanes(), catmull(), depthScale(), pointAt(), startLights(), BEACONS, LANES

### Community 8 - "Framer Page Transitions"
Cohesion: 0.24
Nodes (10): saveSpot(), withSaveReturnSpot(), depth(), frame(), newPageReady(), pageRoot(), PageWipe(), resolveRoute() (+2 more)

### Community 9 - "Framer City Background"
Cohesion: 0.24
Nodes (11): buildLanes(), catmull(), CityBackground(), depthAt(), depthScale(), Lights(), Photo(), pointAt() (+3 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.08
Nodes (30): dependencies, lucide-react@^0.460.0, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^6.28.0, simple-icons@^13.21.0, devDependencies, agentation@^3.1.2 (+22 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noUnusedLocals (+6 more)

### Community 12 - "Cars Album"
Cohesion: 0.25
Nodes (9): STI Puddle Light Photo, Garage Exhaust Install Photo, Subaru BRZ Engine Bay Photo, Cars Album, Air Intake / Filter Maintenance, Subaru Boxer Engine, BMW 3 Series (G20), Exhaust Install (+1 more)

### Community 14 - "Brand & Hero Images"
Cohesion: 0.33
Nodes (7): Jack Luk Personal Brand (dark, pixel font, R34), JL Monogram Favicon, Hero R34 Small (Yellow Skyline R34), Hero R34 Wide (Yellow Skyline R34), OG Link Preview Card (jackluk.com), Hero R34 Original Source Photo, Old Framer Link Preview Card

### Community 15 - "FPGA Toolchain"
Cohesion: 0.38
Nodes (7): Terasic DE10-Standard (Cyclone V) FPGA Board, FPGA Alarm Clock Project, Intel Quartus Prime, incr_tb Incrementer Testbench (50 MHz clock), ModelSim HDL Simulator, FPGA Quartus Setup Photo, ModelSim Waveform Screenshot

### Community 16 - "SFU Racerbot"
Cohesion: 0.40
Nodes (6): SFU Racerbot Autonomous RC Car (electronics top view), Front-mounted LiDAR Sensor, Onboard Compute Module and Custom PCBs, SFU Racerbot Development Workstation, ROS Launch Terminal, Racerbot Telemetry / Path Visualization Dashboard

### Community 18 - "Scouts & Salvation Army"
Cohesion: 0.40
Nodes (5): The Salvation Army Red Shield Logo, Global News: Christmas Meals for the Homeless, Scouts Evening Campfire Circle, Scouts Catapult Pioneering Activity, Badminton Player on Indoor Court (reference)

### Community 19 - "Events Album"
Cohesion: 0.50
Nodes (5): Cashflow Basics Presentation Photo, Formal Event Group Photo, Student Conference, Cashflow Basics: Employees (Financial Literacy Talk), Events Album

### Community 2 - "Site Architecture (README)"
Cohesion: 0.07
Nodes (33): FRAG Shader (ridges, sodium lamps, headlights), Glass Cards Layout (About, Projects, Experience, Skills, Contact), Night Mountain Road WebGL Scene, window.__fakeRouter stub, withHistoryBack Test Harness, withHistoryBack (/historyback.js), City Photo Background (/city.jpg) with tint, lights.js startLights() (+25 more)

### Community 20 - "Hiking & Camping"
Cohesion: 0.40
Nodes (5): Backcountry Camp Stove Photo, Cliff Edge Selfie Photo, Backpacking / Camping, Summit Viewpoint over Water, Hikes Album

### Community 21 - "BCSS Ultimate 2024"
Cohesion: 0.40
Nodes (5): BCSS Ultimate Championships 2024, McArthur Island Park, Kamloops, McMath Secondary (team), Sir Winston Churchill Secondary (team), BCSS Ultimate 2024 Photo

### Community 23 - "Raspberry Pi 5"
Cohesion: 0.50
Nodes (4): Debian 13 (trixie) aarch64, fastfetch, Raspberry Pi 5, Raspberry Pi 5 Setup Photo

### Community 24 - "Split Project"
Cohesion: 0.67
Nodes (3): Split (receipt bill-splitting app), Split Project Cover (Receipts Illustration), Working on Split (About Photo)

### Community 25 - "Content Creation"
Cohesion: 0.67
Nodes (3): Social Media Insights Screenshot, Content Creation, 4.17M Views / 1.8M Accounts Reached (90 days)

### Community 26 - "Snow Lake Hike"
Cohesion: 0.67
Nodes (3): Frozen Alpine Lake (possibly Garibaldi Lake), Snow Camping / Backpacking, Snow Lake Hike Photo

### Community 4 - "Fonts, Meta & Hero Picks"
Cohesion: 0.10
Nodes (22): Hero R34 Image Preload (small/wide), index.html App Shell, Open Graph / Link Preview Meta (jackluk.com/og.jpg), /src/main.tsx entry, Hero Section Mock (Hi, I'm Jack), Hero Background Comparison O vs W, Background Options Gallery (Unsplash, A-AD), Display Font Comparison (Orbitron, Michroma, Tektur, Audiowide, Oxanium) (+14 more)

### Community 7 - "Resume & Projects"
Cohesion: 0.16
Nodes (13): Spec Plate Project Card Test, withSpecPlate (/p3style.js), AI Posture Detection System (OpenCV, MediaPipe), Automatic Blueberry Sorter (Arduino, TCS3200, SG90), FPGA Digital Alarm Clock (VHDL, Cyclone V), Jack Luk, 33rd Richmond Scouts Youth Leader, SFU Canadianized Asian Club First Year Lead (+5 more)

## Ambiguous Edges - Review These
- `Subaru Boxer Engine` → `STI Logo Puddle Light Mod`  [AMBIGUOUS]
  public/photos/life/cars-sti-light.webp · relation: conceptually_related_to
- `Global News: Christmas Meals for the Homeless` → `Badminton Player on Indoor Court (reference)`  [AMBIGUOUS]
  reference/badminton-original.png · relation: conceptually_related_to
- `Sir Winston Churchill Secondary (team)` → `BCSS Ultimate 2024 Photo`  [AMBIGUOUS]
  public/photos/life/ultimate-bcss-2024.webp · relation: conceptually_related_to
- `Frozen Alpine Lake (possibly Garibaldi Lake)` → `Snow Lake Hike Photo`  [AMBIGUOUS]
  public/photos/life/hike-snow-lake.webp · relation: conceptually_related_to

## Knowledge Gaps
- **52 isolated node(s):** `Air Intake / Filter Maintenance`, `BMW 3 Series (G20)`, `Exhaust Install`, `JL Monogram Favicon`, `Old Framer Link Preview Card` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 127 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Jack Luk Portfolio Site` connect `Site Architecture (README)` to `Layout & Icons`, `Fonts, Meta & Hero Picks`?**
  _High betweenness centrality (0.209) - this node is a cross-community bridge._
- **What connects `Air Intake / Filter Maintenance`, `BMW 3 Series (G20)`, `Exhaust Install` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Layout & Icons` be split into smaller, more focused modules?**
  _Cohesion score 0.07910014513788098 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Layout & Icons` to `Navigation & Project Cards`, `NPM Dependencies`, `Photo Galleries & Data`, `Framer Page Transitions`, `Framer City Background`, `Framer Style Overrides`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Should `Navigation & Project Cards` be split into smaller, more focused modules?**
  _Cohesion score 0.12762762762762764 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Subaru Boxer Engine` and `STI Logo Puddle Light Mod`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Global News: Christmas Meals for the Homeless` and `Badminton Player on Indoor Court (reference)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._