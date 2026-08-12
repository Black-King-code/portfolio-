// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });
  revealEls.forEach((el) => observer.observe(el));

  // Fallback: if something never triggers (e.g. very short pages,
  // elements already in view on load), reveal everything after 1.5s anyway.
  setTimeout(() => {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }, 1500);
} else {
  // No IntersectionObserver support: just show everything immediately.
  revealEls.forEach((el) => el.classList.add('in-view'));
}

// ---- Command palette ----
const cmdOverlay = document.getElementById('cmdOverlay');
const cmdInput = document.getElementById('cmdInput');
const cmdList = document.getElementById('cmdList');
const cmdTrigger = document.getElementById('cmdTrigger');

function openPalette() {
  cmdOverlay.classList.add('open');
  cmdInput.value = '';
  filterCmd('');
  setTimeout(() => cmdInput.focus(), 50);
}
function closePalette() {
  cmdOverlay.classList.remove('open');
}

cmdTrigger.addEventListener('click', openPalette);

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    cmdOverlay.classList.contains('open') ? closePalette() : openPalette();
  }
  if (e.key === 'Escape') closePalette();
});

cmdOverlay.addEventListener('click', (e) => {
  if (e.target === cmdOverlay) closePalette();
});

function filterCmd(query) {
  const items = cmdList.querySelectorAll('li');
  items.forEach((item) => {
    const match = item.textContent.toLowerCase().includes(query.toLowerCase());
    item.style.display = match ? '' : 'none';
  });
}

cmdInput.addEventListener('input', (e) => filterCmd(e.target.value));

cmdList.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const target = document.querySelector(li.dataset.target);
  if (target) target.scrollIntoView({ behavior: 'smooth' });
  closePalette();
});

// ---- Project detail modal ----
const modalOverlay = document.getElementById('projectModalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalTech = document.getElementById('modalTech');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function openProjectModal(data) {
  if (!data) return;
  modalTitle.textContent = data.title || '';
  modalTech.innerHTML = (data.tech || []).map((t) => `<span>${t}</span>`).join('');
  modalBody.innerHTML = `
    <dl>
      <dt>Why I built it</dt><dd>${data.why || ''}</dd>
      <dt>What I learned</dt><dd>${data.learned || ''}</dd>
      <dt>How it works</dt><dd>${data.how || ''}</dd>
      <dt>Challenges</dt><dd>${data.challenges || ''}</dd>
      <dt>What I would improve</dt><dd>${data.improve || ''}</dd>
    </dl>
  `;
  modalOverlay.classList.add('open');
}

function closeProjectModal() {
  modalOverlay.classList.remove('open');
}

modalClose.addEventListener('click', closeProjectModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeProjectModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal();
});

// ---- Dynamic content loading (from content/site.json & content/projects.json) ----
// These files are edited through the /admin/ panel (Decap CMS) — no code editing needed.

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function renderProjects(items) {
  const grid = document.getElementById('projectsGrid');
  if (!grid || !items || !items.length) return;

  grid.innerHTML = '';
  items.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card reveal in-view';

    const techBadges = (project.tech || []).map((t) => `<span>${escapeHtml(t)}</span>`).join('');
    const sourceLink = project.sourceUrl
      ? `<a href="${escapeHtml(project.sourceUrl)}" target="_blank" rel="noopener" class="link-ghost">Source Code</a>`
      : '';
    const demoLink = project.demoUrl
      ? `<a href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noopener" class="link-ghost">Live Demo</a>`
      : '';

    card.innerHTML = `
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="tech-badges">${techBadges}</div>
      <div class="project-links">
        <button type="button" class="link-ghost">View Details</button>
        ${sourceLink}
        ${demoLink}
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => openProjectModal(project));
    grid.appendChild(card);
  });
}

function renderSite(site) {
  if (!site) return;

  const statusEl = document.getElementById('statusText');
  if (statusEl && site.status) statusEl.textContent = site.status;

  const heroEl = document.getElementById('heroDescription');
  if (heroEl && site.heroDescription) heroEl.textContent = site.heroDescription;

  const aboutEl = document.getElementById('aboutText');
  if (aboutEl && site.aboutText) aboutEl.textContent = site.aboutText;

  const emailEl = document.getElementById('contactEmail');
  if (emailEl && site.email) emailEl.href = 'mailto:' + site.email;

  const githubEl = document.getElementById('contactGithub');
  if (githubEl) {
    if (site.githubUrl) { githubEl.href = site.githubUrl; githubEl.style.display = ''; }
    else { githubEl.style.display = 'none'; }
  }

  const fbEl = document.getElementById('contactFacebook');
  if (fbEl) {
    if (site.facebookUrl) { fbEl.href = site.facebookUrl; fbEl.style.display = ''; }
    else { fbEl.style.display = 'none'; }
  }

  const igEl = document.getElementById('contactInstagram');
  if (igEl) {
    if (site.instagramUrl) { igEl.href = site.instagramUrl; igEl.style.display = ''; }
    else { igEl.style.display = 'none'; }
  }
}

// Cache-bust so edits made in /admin/ show up right away instead of a stale cached copy.
const cacheBust = '?v=' + Date.now();

fetch('content/site.json' + cacheBust)
  .then((res) => res.json())
  .then(renderSite)
  .catch(() => { /* keep the static fallback content already in the HTML */ });

fetch('content/projects.json' + cacheBust)
  .then((res) => res.json())
  .then((data) => renderProjects(data.items))
  .catch(() => {
    const grid = document.getElementById('projectsGrid');
    if (grid) grid.innerHTML = '<p style="color:var(--text-muted)">โหลดโปรเจกต์ไม่สำเร็จ ลองรีเฟรชอีกครั้ง</p>';
  });

// ---- Terminal widget ----
const terminalBody = document.getElementById('terminalBody');
const terminalInput = document.getElementById('terminalInput');

const commands = {
  help: 'Available commands: help, about, skills, projects, clear',
  about: 'CHIBA — first-year CS student, learning C++, HTML/CSS/JS, exploring AI.',
  skills: 'Using: C++, HTML/CSS, Git. Exploring: JavaScript. Interested in: AI, Automation.',
  projects: 'Problem Solving Arena, Portfolio V1 — see the Projects section above.',
};

function printLine(text, dim = false) {
  const p = document.createElement('p');
  if (dim) p.classList.add('dim');
  p.textContent = text;
  terminalBody.appendChild(p);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

terminalInput.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const raw = terminalInput.value.trim();
  if (!raw) return;
  printLine('$ ' + raw);

  if (raw === 'clear') {
    terminalBody.innerHTML = '';
  } else if (commands[raw]) {
    printLine('> ' + commands[raw], true);
  } else {
    printLine('> command not found: ' + raw + ' (try "help")', true);
  }
  terminalInput.value = '';
});
