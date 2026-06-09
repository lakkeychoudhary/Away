# Away — Deployment

## Frontend → GitHub Pages

**Build output:** `apps/web/dist`

**Base path:** `/Away/` (change if repo renamed)

### GitHub Actions

Workflow file: `.github/workflows/deploy-web.yml`

Triggers on push to `main`. Steps: install → build web with `VITE_API_URL` → upload artifact → deploy Pages.

### Manual deploy

```bash
npm run build -w apps/web
# Upload dist/ to gh-pages branch or use `npx gh-pages -d apps/web/dist`
```

### Required env at build time

```
VITE_API_URL=https://api.yourdomain.com
```

Rebuild frontend whenever API URL changes (it's baked into the bundle).

---

## API → Your server

### Build

```bash
npm run build -w apps/api
```

### Run

```bash
NODE_ENV=production node apps/api/dist/index.js
```

### Recommended stack

- **Process manager:** PM2 or systemd
- **Reverse proxy:** Caddy or nginx with HTTPS
- **Firewall:** expose only 443 → proxy → localhost:3001

### CORS

Set `CORS_ORIGIN` to your GitHub Pages URL:

```
CORS_ORIGIN=https://username.github.io
```

For multiple origins, comma-separate (supported in `apps/api/src/config.ts`).

### Health check

```
GET https://api.yourdomain.com/health
```

Use for uptime monitoring.

---

## Checklist before Stardance ship

- [ ] Live demo URL works (Pages)
- [ ] API reachable from public internet
- [ ] README has try-it steps + NASA attribution
- [ ] 2+ devlogs with gifs
- [ ] Public GitHub repo
- [ ] No secrets in git (.env in .gitignore)
