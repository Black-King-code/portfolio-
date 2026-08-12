# CHIBA — My Digital Space

Personal tech portfolio website for a first-year CS/IT student learning
programming, web development, and AI — built line by line as a way to
document real progress instead of pretending to already be an expert.

🔗 **Live site:** `https://<your-username>.github.io/portfolio/`
*(replace with your GitHub Pages URL after enabling Pages in Settings)*

## About

This site is intentionally not the usual "About / Skills / Contact" template.
It's meant to grow alongside my learning journey — every section can be
updated as I pick up new tools, ship new projects, and move through university.

## Sections

1. **Hero** — quick intro and current status
2. **About Me** — who I am, in a bento-grid layout
3. **Skill Matrix** — what I'm currently using / exploring / interested in
4. **Featured Projects** — real projects with tech stack and links
5. **Development Journey** — a timeline of milestones, updated over time
6. **Quick Command** — a tiny interactive terminal (`help`, `about`, `skills`, `projects`, `clear`)
7. **Contact** — ways to reach me

## Built with

- HTML5
- CSS3 (custom properties, Bento grid, responsive layout)
- Vanilla JavaScript (Command Palette `Ctrl/Cmd+K`, scroll reveal, terminal widget)

No frameworks yet — this is Version 1. Planned progression:

```
V1  HTML + CSS + JS          ← you are here
V2  Git + GitHub workflow
V3  Responsive + Animation polish
V4  React
V5  Backend / API / AI integration
```

## File structure

```
portfolio/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── images/
│   ├── profile.jpg
│   └── projects/
│
└── README.md
```

## Running locally

No build step needed — just open `index.html` in a browser, or serve the
folder with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Deploying (GitHub Pages)

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, choose `Deploy from a branch` → branch `main`, folder `/ (root)`.
4. Save and wait a minute — your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.

## Roadmap

- [ ] Add profile photo to `images/profile.jpg`
- [ ] Add project screenshots to `images/projects/`
- [ ] Wire up real GitHub/social links in the Contact section
- [ ] Add first AI-related project once built
- [ ] Migrate to React (V4)

---

*Currently learning C++ & web architecture. Status: building.*
