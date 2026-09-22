# Simran Bansal — Portfolio

Personal portfolio site for Simran Bansal: engineering experience, projects, and hobbies, with motion-led UI and a light/dark theme.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [GSAP](https://gsap.com) + ScrollTrigger
- [lucide-react](https://lucide.dev) icons
- Google Fonts: Bebas Neue, DM Sans, Caveat

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — hero with cycling taglines, works film + logo marquee, about preview |
| `/work` | Experience & projects grid with filters and detail modal |
| `/about` | Full about section |
| `/resume` | Embedded PDF resume |
| `/timeline` | Timeline / under-construction style page |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve production build
npm run lint    # ESLint
```

## Project structure

```
src/app/
  page.js                 # Home
  layout.js               # Root layout, fonts, intro, nav, theme
  globals.css             # Theme tokens, marquee keyframes, shared styles
  about/                  # About page
  work/                   # Work grid, filters, modal, experience data
  resume/                 # PDF iframe
  timeline/               # Timeline page
  components/             # Hero, Works, About, Navbar, Footer, LogoMarquee, etc.
public/
  images/                 # Photos used across the site
  resumes/                # Resume PDF
```

## Content you may want to edit

- **Hero taglines** — `src/app/components/Hero.jsx` (`TAGLINES`)
- **Experience / projects** — `src/app/work/data.js` (`EXPERIENCE`)
- **Logo marquee brands & tools** — `src/app/components/LogoMarquee.jsx` (`LOGOS`); items render as text pills; optional `url` opens in a new tab
- **Resume PDF** — drop a new file under `public/resumes/` and update the path in `src/app/resume/page.js`

## Deploy

Built for [Vercel](https://vercel.com). Push to the connected GitHub repo, or:

```bash
npx vercel
```
