# Works Page — Build Spec for Cursor

This file is the single source of truth for building `/work`. Paste it into Cursor when starting the build.

---

## Project context recap (don't change anything here)

- Next.js App Router (`src/app/`)
- Tailwind v4 (`@import "tailwindcss"`, CSS variables for theming)
- GSAP + ScrollTrigger for animations
- Existing route entry animation already done: velvet purple `#2D1B4A` drapes part from center
- `Navbar.jsx` is already configured to stay always visible on `/work`
- `PageTransitionProvider` already wraps the app
- `useIntroComplete()` context already gates initial render

**DO NOT modify:**
- `Navbar.jsx`, `IntroAnimation.jsx`, `PageTransition.jsx`, `Footer.jsx`, `ThemeToggle.jsx`
- `globals.css` — only ADD new keyframes if needed, don't change existing ones
- `layout.js`
- The `/about` and `/timeline` pages

**Existing CSS variables to reuse:**
```
--bg, --text, --muted, --accent (copper #C17A3A in dark, black in light), --surface, --border
```

**Hardcoded colors allowed only:**
- `#C17A3A` (copper accent)
- `#2D1B4A` (velvet purple — page transition only)
- `#fff`

---

## Page architecture

File: `src/app/work/page.js`

Layout (top to bottom):

1. **Header strip** — name top-left (`SIMRAN BANSAL`, Bebas Neue), email + LinkedIn top-right
2. **Info row** (4 columns, flexbox/grid):
   - Column 1: `ABOUT` — short bio paragraph
   - Column 2: `COMPANIES` — icon+name pills
   - Column 3: `TOOLS` — icon+name pills
   - Column 4: `LINKS` — Email, LinkedIn, GitHub, Resume
3. **Filter row** — All / Engineering / Automotive / Leadership / Field Experience
4. **Tile grid section: EXPERIENCE** — featured roles + earlier-experience smaller row
5. **Tile grid section: PROJECTS** — personal projects + hackathons + lab work
6. **Footer** — existing component, no changes

---

## Color palette additions

None. Use existing CSS variables. The only new "color" is the dim state for unfiltered tiles, achieved via opacity (`opacity: 0.25`).

---

## Fonts (already loaded)

- `Bebas_Neue` — name, tile codes, section headers, filter buttons
- `DM_Sans` — body paragraphs, modal narrative, pill labels
- `Caveat` — DO NOT USE on this page (reserved for personal moments)

---

## Section 1: Header strip

Identical pattern to Julia Krantz reference image and your existing About page header.

```
SIMRAN BANSAL                                    ssbansal731@gmail.com ↗
                                                     linkedin.com/in/simransb ↗
```

- Name: Bebas Neue, large (~clamp(3rem, 8vw, 6rem)), per-letter hover roll (same GSAP `yPercent: -50, stagger: 0.03` as Hero)
- Right side: stacked email + LinkedIn, DM_Sans, smaller
- Padding: `px-8 pt-12 pb-8` (or similar — match existing pages' rhythm)
- Border-bottom hairline: `border-b border-[var(--border)]`

---

## Section 2: Info row (the "press-style" columns)

Four columns. On mobile, collapse to single column stack.

### Column 1 — ABOUT

Header label: small caps, Bebas Neue, `text-[var(--muted)]`: `ABOUT`

Body (DM_Sans, normal weight, 14-15px line-height 1.6):

> Computer Engineering student at the University of Alberta with five years of work experience spanning retail floors, construction sites, and engineering teams. Currently a Group Leader at General Motors building Power BI dashboards and automations for manufacturing operations. I started in customer service and on construction sites — that part still shapes how I work. The thread is figuring out how things work and making them work better.

(Simran can edit this later. It's a workable draft.)

### Column 2 — COMPANIES

Header label: `COMPANIES`

Stacked icon+name pills, one per line. Format: `[icon]  Company Name  ↗` (the arrow only if there's a real link)

Order:
1. General Motors (link to gm.com)
2. UAlberta Formula Racing (link if available, else no arrow)
3. Student Works (link to studentworks.com)
4. Modern Kitchens & Construction (link to mkc website when ready — leave `#` placeholder)
5. Hugo Boss
6. Best Buy

**Icon source:** Use `simple-icons` package. Install via `npm install simple-icons`. Import as React components or render the SVG paths. Icons inherit `currentColor` so they'll match `--text` in both light and dark mode.

Where simple-icons has the brand: gm has it, hugo-boss does, bestbuy does. For UAlberta Formula Racing, Student Works, and MKC — use a small generic placeholder square (a simple filled rect with the company's first letter inside, same color as `--text`).

Pill style:
- Padding: `px-3 py-2`
- Border: `1px solid var(--border)`
- Rounded: `rounded-md`
- Hover: subtle copper border on hover (`hover:border-[#C17A3A]`)
- Icon: 16x16, vertical-center aligned with text
- Spacing between pills: `gap-2`

### Column 3 — TOOLS

Header label: `TOOLS`

Same pill format as Companies. Two visual subgroups (no header — just a slight gap or divider line):

**Languages:** Python, Java, C, C++, JavaScript, HTML5, CSS3, VHDL (no simple-icons logo — use letter placeholder)
**Frameworks:** React, Node.js, Next.js, Express, jQuery
**Tools:** Git, Linux, Microsoft Excel, Power BI, Power Automate, Databricks, AutoCAD, KiCAD, SolidWorks, TinkerCAD, Arduino, Raspberry Pi

For Power BI / Power Automate / Databricks: simple-icons has these. For AutoCAD / SolidWorks / TinkerCAD: simple-icons has SolidWorks and AutoCAD; use letter placeholder for TinkerCAD.

**Hover-highlight behavior (THIS IS CRITICAL):**

Each tool pill has a `data-relevance` attribute listing the filter categories where this tool is "relevant" (NOT where it was used — by domain).

Mapping:
- Python, Java, C, C++, JavaScript, HTML5, CSS3, VHDL, React, Node.js, Next.js, Express, jQuery, Git, Linux, Arduino, Raspberry Pi → `engineering`
- Excel, Power BI, Power Automate, Databricks → `engineering`, `leadership` (data tools used in management context)
- AutoCAD, KiCAD, SolidWorks → `engineering`, `automotive`
- TinkerCAD → `engineering`

On `mouseenter` of a tool pill:
- All tiles whose category list does NOT include any of this tool's relevance categories get `opacity: 0.25` and `transition: opacity 0.3s`
- Tiles that match stay at `opacity: 1`
- Also dim other tool pills that don't share any relevance category

On `mouseleave`:
- Reset all opacity to 1

### Column 4 — LINKS

Header label: `LINKS`

Stacked, no icons (or tiny arrow icons), DM_Sans:
- Email ↗
- LinkedIn ↗
- GitHub ↗
- Resume ↗ (links to `/resume.pdf` — placeholder for now, file may not exist yet)

---

## Section 3: Filter row

Centered, between info row and tile grid. ~40px vertical padding above and below.

Buttons (Bebas Neue, `text-sm tracking-wider`):
- ALL (default active)
- ENGINEERING
- AUTOMOTIVE
- LEADERSHIP
- FIELD EXPERIENCE

Style:
- No border by default, just text
- Active state: copper underline (`border-b-2 border-[#C17A3A]`), text stays `var(--text)`
- Inactive state: `text-[var(--muted)]`
- Hover: `text-[var(--text)]` with copper underline on hover
- Spacing between: `gap-8`

Behavior on click:
- The active filter sets a state (`activeFilter`)
- Tiles that don't include `activeFilter` in their `categories` array get `opacity: 0.25` (DIM, not hidden)
- Tiles that match stay at `opacity: 1`
- Smooth transition: `transition: opacity 0.4s ease`
- "ALL" resets all tiles to opacity 1

---

## Section 4: EXPERIENCE tile grid

Section header: `EXPERIENCE` (Bebas Neue, large, `text-[var(--muted)]`, left-aligned, with hairline divider beside or under it like Julia's grid section)

Grid: CSS grid, 4 columns on desktop, 2 on tablet, 1 on mobile. `gap-0` (tiles share borders like Julia's). Tiles separated by `1px solid var(--border)`.

**Tile structure (the "element card" pattern):**

Each tile is a `<button>` (for accessibility) with this internal layout:
```
┌─────────────────────────┐
│ 01                      │  ← top-left index, small Bebas Neue muted
│                         │
│        [optional        │  ← if photo, fills tile background
│         photo bg]       │
│                         │
│ GM                      │  ← bottom-left, large 2-letter code, Bebas Neue
│ Group Leader            │  ← role, DM_Sans normal
│ General Motors          │  ← company, DM_Sans muted
│ 2025 — Present          │  ← year, DM_Sans muted, small
└─────────────────────────┘
```

When tile has a photo: photo fills the background, dark overlay (`bg-black/40` or similar) ensures text is readable. Code/role/company/year sit on top of overlay.

When no photo: solid `var(--surface)` background. Code is visually larger to fill the space.

Tile sizes:
- Default: 1x1 (1 column wide, ~aspect-ratio square or 4:5)
- Featured (`size: "2x"` in data): 2 columns wide, same height
- Earlier-experience tiles (Hugo Boss, Best Buy): 0.5x height row, smaller code, no photos. These render in their own row below the main experience grid with a small label "EARLIER EXPERIENCE" between them.

**Hover state:**
- Tile lifts slightly: `translateY(-4px)`
- Copper hairline appears at bottom: `border-b-2 border-[#C17A3A]`
- Photo (if present) zooms slightly: `scale(1.03)` on the bg image only
- Smooth transition: `0.3s ease`

**Click behavior:** see Section 6 (Modal).

---

## Section 5: PROJECTS tile grid

Same tile system as Experience. Section header: `PROJECTS`.

---

## Section 6: Modal (the expanding-tile combo)

When a tile is clicked:

1. **Background dim** — a fixed full-screen overlay (`bg-black/60 backdrop-blur-sm`) fades in over 0.25s
2. **Tile expansion** — the clicked tile animates from its grid position to a centered modal position. GSAP `Flip` plugin is the cleanest way to do this. The tile's bounding rect is captured, then the tile element (or a clone) is positioned `fixed` at center with target dimensions (`width: min(900px, 92vw); max-height: 90vh`). Animation: 0.5s `power2.inOut`.
3. **Modal content** fades in inside the expanded tile after the expansion lands (0.2s delay)
4. **Close behavior:** click outside, press Escape, or click an X button in the top-right of the modal. Reverses the animation.

**Modal content structure:**

```
[X close button, top-right]

[hero strip — photo if available, else solid bg with large tile code]
  height: 200-260px on desktop

[modal body — padded ~32px]

  TILE_CODE
  Role · Company · Date Range · Location (DM_Sans, muted)

  [narrative paragraph — 2-4 sentences, DM_Sans]

  WHAT I DID
  · bullet
  · bullet
  · bullet

  STACK
  [pill] [pill] [pill]  (smaller pills, same style as info row)

  LINKS
  GitHub ↗   Live ↗   Demo ↗   (if applicable)

  [GALLERY — only if multiple photos]
  thumbnail row, click to swap hero strip

```

Modal scroll: if content overflows, modal body scrolls internally. Background overlay does not scroll.

---

## CONTENT — TILES

This is the data array. Cursor should put this in a separate file: `src/app/work/data.js` exporting `EXPERIENCE` and `PROJECTS` arrays.

### EXPERIENCE (in display order)

```js
export const EXPERIENCE = [
  {
    id: "gm",
    code: "GM",
    role: "Group Leader → Digital Enablement",
    company: "General Motors",
    location: "Oshawa, ON",
    dates: "Sep 2025 — Present",
    year: "2025",
    size: "2x",
    photo: null, // typographic tile
    categories: ["engineering", "automotive", "leadership"],
    stack: ["Power BI", "Excel", "Databricks", "Power Automate", "Microsoft Lists", "JSON"],
    narrative: "Joined GM as a production Group Leader on the manufacturing floor, then moved into Digital Enablement and Continuous Improvement, where I now build the tooling that other Group Leaders use day-to-day. Working with data from Excel, Databricks, and operational systems, I design custom Power BI dashboards and Power Automate flows that turn manual reporting into automated insight.",
    bullets: [
      "Built fully custom Power BI reports using JSON for layouts and DAX for measures, replacing manual spreadsheet workflows used across multiple shifts.",
      "Manipulated and joined data queries from Excel, Databricks, and Microsoft Lists to feed dashboards used in daily continuous-improvement reviews.",
      "Designed Power Automate flows that automate routine reporting tasks for Group Leaders, freeing time for floor coordination and process improvement.",
      "Currently developing internal tools aimed at standardizing how Group Leaders track and act on continuous-improvement metrics.",
    ],
    links: [],
  },
  {
    id: "fsae",
    code: "FS",
    role: "High & Low Voltage Electrical (Member)",
    company: "UAlberta Formula Racing",
    location: "Edmonton, AB",
    dates: "May 2025 — Aug 2025",
    year: "2025",
    size: "1x",
    photo: null,
    categories: ["engineering", "automotive"],
    stack: ["KiCAD", "SolidWorks", "AutoCAD", "3D Printing"],
    narrative: "Joined the UAlberta Formula SAE team during my first season with the club, contributing to the high and low voltage electrical subsystem of the team's electric race car. As a new member, my focus has been on learning the team's standards, supporting senior members on schematic and layout work, and getting hands-on with the design tooling used in EV battery systems.",
    bullets: [
      "Supported the HV/LV electrical team in early system planning and component layout, using KiCAD for schematics and SolidWorks for mechanical fit.",
      "Studied FSAE technical regulations and the team's existing battery management system to understand safety, isolation, and packaging requirements.",
      "Engaged actively in technical meetings and workshops to build foundation skills I'll bring back to the team in the next development cycle.",
    ],
    links: [],
  },
  {
    id: "studentworks",
    code: "SW",
    role: "Project Manager (started as crew)",
    company: "Student Works",
    location: "Edmonton, AB",
    dates: "May 2023 — Aug 2025",
    year: "2023–2025",
    size: "1x",
    photo: "/images/works/outdoorblinds.jpg",
    categories: ["leadership", "field"],
    stack: ["Field Operations", "Crew Coordination", "Client Communication", "Budget Tracking"],
    narrative: "Joined Student Works as a painter on the crew, then was promoted to Project Manager. Over three summers I went from working on sites myself to running multiple painting crews across Edmonton — scheduling, allocating painters by strength, visiting sites to keep work on track, and reporting up to leadership.",
    bullets: [
      "Coordinated multiple painting crews simultaneously, monitoring progress and pushing back delivery times to consistently beat project milestones.",
      "Reduced costs by approximately 20% through tighter delivery scheduling and crew-to-site matching based on individual strengths.",
      "Maintained sustained crew efficiency above 1.2x by communicating expectations clearly and supporting painters on-site when bottlenecks appeared.",
      "Built the management muscle I now rely on at GM — scheduling, accountability, and turning a team of individuals into a working unit.",
    ],
    links: [],
  },
  {
    id: "mkc",
    code: "MK",
    role: "Coordinator (started as labour)",
    company: "Modern Kitchens & Construction",
    location: "Edmonton, AB",
    dates: "Mar 2020 — Aug 2024",
    year: "2020–2024",
    size: "1x",
    photo: "/images/works/customshelf.jpg",
    categories: ["leadership", "field"],
    stack: ["Blueprint Design", "Client Quotes", "Project Coordination", "Web Development"],
    narrative: "Started as labour on the construction side — installing kitchens, working in clients' homes, learning the trade. Over four years I moved into a coordinator role: drafting custom blueprints, running quotes, managing the schedule across overlapping residential and commercial jobs, and working directly with clients through every stage. I also built MKC's website to help the company's online presence (currently being revamped).",
    bullets: [
      "Designed custom kitchen blueprints, presenting drawings to clients and revising them through to final approval before manufacturing.",
      "Coordinated multiple overlapping jobs by communicating with installers, suppliers, and clients to keep deadlines and quality standards aligned.",
      "Performed quotes for residential and commercial clients as part of the estimating team.",
      "Built MKC's company website (currently being revamped) to support customer outreach.",
    ],
    links: [
      // { label: "MKC Website ↗", url: "https://mkc-placeholder.com" }, // uncomment when ready
    ],
  },
];

export const EARLIER_EXPERIENCE = [
  {
    id: "hugoboss",
    code: "HB",
    role: "Sales Associate",
    company: "Hugo Boss",
    location: "Edmonton, AB",
    dates: "Apr — Aug 2023",
    year: "2023",
    size: "0.5x",
    photo: null,
    categories: ["field"],
    stack: ["Consultative Sales", "Client Retention", "Product Knowledge"],
    narrative: "Sales associate at Hugo Boss Premium Outlet during summer 2023. Recognized in district-level competitions for top performance and consistent target achievement.",
    bullets: [
      "Exceeded sales targets through a consultative approach, winning multiple district competitions.",
      "Built repeat-client relationships through detailed product knowledge and personalized outreach.",
      "Worked closely with the team to coordinate floor coverage and the customer experience end-to-end.",
    ],
    links: [],
  },
  {
    id: "bestbuy",
    code: "BB",
    role: "Omni / Fulfillment Specialist",
    company: "Best Buy",
    location: "Edmonton, AB",
    dates: "Oct 2021 — Oct 2022",
    year: "2021–2022",
    size: "0.5x",
    photo: null,
    categories: ["field"],
    stack: ["Customer Service", "Inventory", "Problem Solving"],
    narrative: "First retail role. Split time between Omni (customer-facing support and issue resolution) and Fulfillment (warehouse picking and order delivery to customers).",
    bullets: [
      "Awarded for selling the most memberships in the department (Nov 2021).",
      "Resolved customer issues at the support counter under time pressure, prioritizing a positive end-of-visit experience.",
      "Picked and delivered fulfillment orders accurately, building the warehouse memory needed to be efficient on the floor.",
    ],
    links: [],
  },
];
```

### PROJECTS

```js
export const PROJECTS = [
  {
    id: "caraudio",
    code: "CA",
    role: "Full Audio System Rebuild",
    company: "Personal Project",
    location: "Garage Build",
    dates: "2024",
    year: "2024",
    size: "1x",
    photo: "/images/works/amplifier.jpg",
    gallery: ["/images/works/caraudio.jpg"],
    categories: ["automotive", "engineering"],
    stack: ["Hertz Amplifier", "Subwoofer Wiring", "Signal Routing", "Gain Tuning"],
    narrative: "Stripped and rebuilt the entire audio system in my car. Replaced every speaker, installed a new Hertz amplifier and a subwoofer, ran power and signal lines from scratch through the chassis, and tuned the system end-to-end — gain matching, crossovers, and EQ.",
    bullets: [
      "Replaced all factory speakers with aftermarket components, sized to match the amplifier output.",
      "Installed and wired a new amplifier and subwoofer, including running power directly from the battery and routing signal lines cleanly through the chassis.",
      "Tuned the system manually — set gains by listening for distortion onset, configured high-pass and low-pass crossovers per channel, and tweaked subsonic filters.",
      "Diagnosed and resolved several wiring issues during install without an extra set of hands.",
    ],
    links: [],
  },
  {
    id: "motorcycle",
    code: "MO",
    role: "Yamaha R3 — Maintenance & Tuning",
    company: "Personal Project",
    location: "Edmonton, AB",
    dates: "2023 — Present",
    year: "2023+",
    size: "1x",
    photo: "/images/works/motorcycles.jpg",
    gallery: ["/images/works/oilchange_gadget.jpg"],
    categories: ["automotive"],
    stack: ["Engine Maintenance", "Clutch Mechanics", "Performance Tuning"],
    narrative: "Bought a Yamaha R3 as a cheaper alternative to a car and used it as a hands-on engineering classroom. Started with basic maintenance, learned the clutch mechanism in detail, did cosmetic upgrades, and have been working through performance modifications to make it quicker.",
    bullets: [
      "Performed full oil and filter changes solo (improvised a funnel from a cut water bottle when the angle didn't work — got the job done).",
      "Studied the clutch mechanism end-to-end to understand torque transfer, lever feel, and slip behavior.",
      "Completed cosmetic upgrades and started moving into performance work — intake, exhaust, and tuning research.",
    ],
    links: [],
  },
  {
    id: "pillpal",
    code: "PP",
    role: "PillPal — Pill Dispenser (HackED Beta Winner)",
    company: "Hackathon",
    location: "Edmonton, AB",
    dates: "Nov 2024",
    year: "2024",
    size: "1x",
    photo: null,
    categories: ["engineering"],
    stack: ["HTML/CSS", "Bootstrap", "C++", "Node.js", "Express", "Raspberry Pi Pico H"],
    narrative: "Built an automated pill-dispensing system for elderly users in 24 hours at HackED Beta. Combined a Raspberry Pi Pico H for hardware control with a Node/Express backend and an accessibility-focused front-end. Won the DivE Accessibility Category against 100+ other students.",
    bullets: [
      "Designed the front-end interface focused on accessibility — high-contrast active and hover states, large touch targets, and simple navigation.",
      "Programmed the Raspberry Pi Pico H to control the dispensing mechanism on a schedule, with audio-visual reminders for missed doses.",
      "Integrated hardware and software through a Node/Express backend so dispensing events and confirmations sync reliably.",
      "Won the DivE Accessibility Category in a field of 100+ participants.",
    ],
    links: [],
  },
  {
    id: "freespeech",
    code: "FR",
    role: "FreeSpeech — EEG-to-Text (NATHacks)",
    company: "Hackathon",
    location: "Edmonton, AB",
    dates: "Nov 2024",
    year: "2024",
    size: "1x",
    photo: null,
    categories: ["engineering"],
    stack: ["Python", "Tkinter", "Muselsl", "Random Forest", "XGBoost", "Petal Metrics"],
    narrative: "Built a non-verbal communication tool that reads EEG data from a Muse2 headset and translates motor-thought signals (\"left,\" \"right,\" \"blink\") into UI input. Real-time data streaming, machine-learning classification, and a Tkinter front-end — all in a hackathon timeframe.",
    bullets: [
      "Streamed real-time EEG data from a Muse2 headset using the Muselsl library and Petal Metrics software.",
      "Trained Random Forest and XGBoost models on the captured EEG streams to classify motor-thought commands.",
      "Achieved roughly 70% prediction accuracy on the target commands, enough for a working demo.",
      "Built a Tkinter GUI that the user could control hands-free through the EEG pipeline.",
    ],
    links: [],
  },
  {
    id: "busshelter",
    code: "BS",
    role: "Edmonton Bus Shelter Redesign (Team Lead)",
    company: "ENGG 100 — UAlberta",
    location: "Edmonton, AB",
    dates: "Jan — Apr 2024",
    year: "2024",
    size: "1x",
    photo: "/images/works/3dmodel.jpg",
    categories: ["engineering", "leadership"],
    stack: ["TinkerCAD", "PrusaSlicer", "SketchUp", "Excel", "PowerPoint"],
    narrative: "Led a team of four engineers to redesign Edmonton's bus shelter from scratch within a fixed budget, then 3D-printed a scaled physical model. Presented to an audience of 200+ and earned a perfect 100% on project, presentation, and team cooperation.",
    bullets: [
      "Led a team of 4 engineers from concept to printed prototype within a fixed budget.",
      "Modeled the shelter in TinkerCAD and produced the physical scale model on a Prusa printer.",
      "Held weekly check-ins with each subdivision to keep work aligned with deadlines.",
      "Lead presenter to a 200+ audience; team scored a perfect 100%.",
    ],
    links: [],
  },
  {
    id: "embedded",
    code: "EM",
    role: "Embedded Systems & Lab Work",
    company: "UAlberta Coursework + Personal",
    location: "Edmonton, AB",
    dates: "2024 — Present",
    year: "ongoing",
    size: "1x",
    photo: "/images/works/microcontroler.jpg",
    categories: ["engineering"],
    stack: ["VHDL", "Arduino", "Raspberry Pi", "Digilent Analog Discovery", "C/C++"],
    narrative: "Ongoing coursework and personal experimentation with FPGAs, microcontrollers, and embedded development. Course projects with FPGA dev boards and the Analog Discovery 2 plus side projects with Arduino — building toward more substantial embedded work as I move through the program.",
    bullets: [
      "Worked with FPGA development boards and a Digilent Analog Discovery 2 in coursework, writing VHDL and verifying signals on the bench.",
      "Started Arduino-based personal projects to explore microcontroller programming outside coursework.",
      "Tile will grow as more projects come online — placeholder for ongoing embedded work.",
    ],
    links: [],
  },
  {
    id: "portfolio",
    code: "WB",
    role: "This Portfolio Website",
    company: "Personal Project",
    location: "Self-built",
    dates: "2026",
    year: "2026",
    size: "1x",
    photo: null,
    categories: ["engineering"],
    stack: ["Next.js", "Tailwind v4", "GSAP", "ScrollTrigger", "Vercel"],
    narrative: "The site you're on right now. Built from scratch in Next.js with route-based navigation, a custom intro animation, page transitions, and dual light/dark theming. Inspired by Jasmine Gunarto and Julia Krantz; everything else is mine.",
    bullets: [
      "Designed and built every page, including the intro animation, navbar, and the page-transition curtain system.",
      "Implemented dark/light theming with CSS variables and persistent preference via localStorage.",
      "Heavy use of GSAP and ScrollTrigger for entry animations, replays on scroll, and per-letter hover effects.",
      "Deployed on Vercel with auto-deploys from GitHub.",
    ],
    links: [
      // GitHub link if public
    ],
  },
];
```

---

## Filter category mapping (reference)

For the filter dim-behavior. Each tile already has `categories: []` in the data above. The filter button compares against those.

- `engineering` — GM, FSAE, PillPal, FreeSpeech, BusShelter, Embedded, Portfolio, CarAudio, MKC (web work)
- `automotive` — GM, FSAE, Motorcycle, CarAudio
- `leadership` — GM, StudentWorks, MKC, BusShelter
- `field` — StudentWorks, MKC, HugoBoss, BestBuy

Note: tiles can have multiple categories. A tile is "matched" if ANY of its categories matches the active filter.

---

## Animation specs

### On page enter (after velvet purple drape exits)
- Header strip: fade up + opacity, 0.5s, ease-out
- Info row columns: stagger fade-up, 0.4s each, 0.08s stagger
- Filter row: fade-in only, 0.3s
- Tile grid: stagger fade-up, 0.04s stagger per tile, GSAP ScrollTrigger so it triggers as the user scrolls

### On filter click
- 0.4s opacity transition on tiles
- The active filter button gets a subtle pulse: copper underline scales 1.1 then back to 1, 0.3s

### On tool pill hover (highlight mode)
- 0.3s opacity transition on non-matching tiles AND non-matching tool pills
- Matching tiles get a tiny `border-color` flash to copper for 0.4s on hover-enter

### On tile hover
- 0.3s `translateY(-4px)` and copper bottom hairline
- Photo zoom (if present): 0.5s `scale(1.03)`

### On tile click → modal
- Use GSAP Flip plugin (`npm install gsap` already done; Flip is a registered plugin)
- Tile clones to a fixed position, then Flip animates from grid rect to centered modal rect, 0.5s `power2.inOut`
- Background overlay fades in 0.25s
- Modal body content fades in 0.2s after expansion lands

### Cleanup
- All ScrollTriggers must be killed in cleanup
- All GSAP contexts must use `ctx.revert()`

---

## File structure

Cursor should create:

```
src/app/work/
  page.js              # main page
  data.js              # EXPERIENCE, EARLIER_EXPERIENCE, PROJECTS exports
  WorkHeader.jsx       # name + email + linkedin row
  InfoRow.jsx          # 4-column info section
  CompanyPills.jsx     # company icon+name pills
  ToolPills.jsx        # tool pills with hover-highlight logic
  FilterRow.jsx        # filter buttons
  TileGrid.jsx         # the tile grid with size variants
  Tile.jsx             # individual tile component
  Modal.jsx            # the expanding modal
public/
  images/
    works/             # NEW folder; copy existing images here
      gm.jpg           # NOT YET UPLOADED — use null in data
      customshelf.jpg
      caraudio.jpg
      outdoorblinds.jpg
      amplifier.jpg
      3dmodel.jpg
      oilchange_gadget.jpg
      motorcycles.jpg
      microcontroler.jpg  # note original spelling — fix to microcontroller.jpg if Simran renames
```

---

## Coding rules (project conventions, repeated for safety)

- `"use client"` at top of every component
- `useLayoutEffect` for GSAP setup, with `gsap.context()` and `ctx.revert()` cleanup
- Tailwind v4 syntax: `bg-[var(--bg)]`, `text-[var(--text)]`
- Refs: declare → assign in JSX → null check → `gsap.set` initial state
- ScrollTrigger replay: use `onEnter` + `onEnterBack` for content that should re-animate, AND `onLeave` + `onLeaveBack` to reset
- New CSS keyframes go in `globals.css`, don't inline in components
- Hardcode ONLY `#C17A3A`, `#fff`, and `#2D1B4A` (transition color)

---

## Acceptance criteria

The Works page is done when:

1. ✅ Header strip with name + email + LinkedIn matches existing page rhythm
2. ✅ 4-column info row with About, Companies (with icons), Tools (with icons), Links
3. ✅ Filter row with 5 buttons; clicking dims non-matching tiles
4. ✅ Tool pill hover dims non-relevant tiles
5. ✅ Experience grid renders all 4 main roles with GM as 2x
6. ✅ Earlier-experience row with Hugo Boss + Best Buy as smaller tiles
7. ✅ Projects grid renders all 7 projects
8. ✅ Tile click opens expanding modal with full content
9. ✅ Modal closes on X, Escape, or outside-click
10. ✅ Mobile responsive (single column, filters scroll horizontally if needed)
11. ✅ Dark and light themes both look correct
12. ✅ All photos render where specified; missing photos fall back to typographic tiles cleanly
13. ✅ Velvet purple page-transition entry still works
14. ✅ Navbar stays visible
