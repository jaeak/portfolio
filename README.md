# Portfolio
Learn more about me and my projects: **[jackluk.com](https://jackluk.com)**

Systems Engineering @ Simon Fraser University, focused on embedded
systems and edge AI. 

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Where things live

- `src/pages/` — Home, Projects, Project (one page per project), Beyond (life outside of work)
- `src/data/projects.json` — project write-ups (HTML in `content`), card tags in `specs`, page number tiles in `stats`
- `src/data/experience.json` — experience and community entries
- `src/data/site.tsx` — skills, toolkit logos, "Currently working on", photo albums, links
- `src/data/photos.ts` — which photos go with each experience and project
- `src/components/WaveMesh.tsx` — the moving dot-wave hero (follows the cursor, or phone tilt on mobile)
- `src/lib/glide.ts` — the sideways slide between pages
- `public/` — photos (`public/photos/`), the resume PDF and the link preview image (`og.jpg`)
- `index.html` — page title and link preview tags
- `reference/` — old experiments and save points (not part of the site)

To add or edit a project, change `src/data/projects.json`.

## Deploy

Hosted on Cloudflare Workers (static assets, see `wrangler.jsonc`). Every push to `main` on
GitHub rebuilds and deploys automatically. `npm run build` outputs the site to `dist/`, and
`not_found_handling: single-page-application` lets links like `/projects/animu` open directly.
