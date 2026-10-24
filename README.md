# portfolio
Learn more about me and my projects

Jack Luk's portfolio site: React + TypeScript, built with Vite. Rebuilt from the Framer version
(night-city car theme).

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Where things live

- `src/pages/` — the four pages: Home, Projects, Project (one per project), Beyond
- `src/data/projects.json`, `src/data/experience.json` — project write-ups and experience entries
- `src/data/site.tsx` — skills, toolkit logos, "Currently working on", photo albums, links
- `src/components/CityBackground.tsx` — the 3D night-city background with light trails
- `src/lib/glide.ts` — the sideways page slide between pages
- `index.html` — page title, link preview tags and the startup dashboard
- `reference/` — the Framer save points and old experiments (not part of the site)

To add or edit a project, change `src/data/projects.json` (the write-up is HTML in `content`).

## Deploy

Hosted as a static site (Vercel). `vercel.json` sends every path to `index.html` so links like
`/projects/animu` work when opened directly. `npm run build` outputs the site to `dist/`.
