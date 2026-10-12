# CloudLaunch – Static Website Deployment (Cloud Hosting & Edge CDN)

A responsive, dependency-free static website (HTML/CSS/JS) deployed to a free cloud host with **continuous deployment from Git**, **automatic HTTPS**, and a CI check that guarantees **no broken asset paths**.

| | |
|---|---|
| **Live URL** | ` https://nikhil0074-dev.github.io/CloudLaunch-Static-Website/`  ← replace after deploying |
| **Primary host** | GitHub Pages (GitHub Actions) |


---

## 1. Project structure

```
.
├── index.html                  # Single-page responsive site
├── 404.html                    # Custom not-found page
├── assets/
│   ├── css/styles.css          # Responsive styles (mobile-first, dark-mode aware)
│   ├── js/main.js              # Nav, live HTTPS/status panel, form demo
│   └── img/*.svg               # Logo, favicon, hero + icons
├── robots.txt
├── .nojekyll                   # Tell GitHub Pages not to run Jekyll
├── .github/workflows/
│   ├── deploy.yml              # CI/CD: validate → deploy to GitHub Pages
│   └── pr-check.yml            # Validates pull requests
├── netlify.toml                # Netlify config (HTTPS redirect, headers)
├── vercel.json                 # Vercel config (security headers, caching)
├── _headers                    # Cloudflare Pages / Netlify headers
├── scripts/check_links.py      # Fails if any local asset path is broken
└── docs/screenshots/           # Dashboard screenshots for this README
```

All asset paths are **relative** (`assets/css/styles.css`), so the site works at a domain root *and* under a GitHub project path (`/repo-name/`).

## 2. Run locally

```bash
python scripts/check_links.py     # verify all asset paths
python -m http.server 8000        # open http://localhost:8000
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| 404 on GitHub Pages | Ensure Source = *GitHub Actions* and the workflow succeeded |
| CSS/JS not loading | Paths must be relative (no leading `/`) in `index.html` |
| *Enforce HTTPS* greyed out | Wait for DNS/cert provisioning (up to ~24 h for custom domains) |
| Workflow can't deploy | Settings → Actions → General → Workflow permissions: allow read/write |
| Old content showing | Hard refresh (Ctrl/Cmd + Shift + R); CDN cache clears within minutes |

## License
MIT
