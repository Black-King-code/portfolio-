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
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
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
const projectData = {
  'problem-solving': {
    title: 'Problem Solving Arena',
    tech: ['HTML', 'CSS', 'JavaScript'],
    why: 'อยากมีพื้นที่ฝึก Logic และ Problem Solving สั้น ๆ ระหว่างเรียน โดยไม่ต้องเปิดหลายเว็บ',
    learned: 'การแตกโจทย์ให้เป็นขั้นตอนย่อย และการเขียนเงื่อนไข if-else / nested if ให้อ่านง่ายขึ้น',
    how: 'สุ่มโจทย์จากชุดคำถามที่เตรียมไว้ ผู้ใช้ตอบในหน้าเว็บ แล้วระบบเช็คคำตอบทันทีด้วย JavaScript',
    challenges: 'ตอนแรกลืมใส่ semicolon หลังเงื่อนไข if ทำให้ผลลัพธ์ผิดทุกครั้ง ต้องไล่ debug ทีละบรรทัด',
    improve: 'อยากเพิ่มระบบเก็บคะแนน และแยกระดับความยากของโจทย์ในเวอร์ชันถัดไป',
  },
  'portfolio-v1': {
    title: 'Portfolio V1',
    tech: ['HTML', 'CSS', 'JavaScript'],
    why: 'อยากมีเว็บไซต์ส่วนตัวที่รวมทุกอย่างไว้ที่เดียว ทั้งตัวตน ทักษะ และโปรเจกต์ที่ทำ',
    learned: 'การจัดโครงสร้างไฟล์ CSS/JS แยกโฟลเดอร์ และการ deploy เว็บจริงด้วย GitHub Pages',
    how: 'สร้างด้วย HTML + CSS + Vanilla JS ล้วน ไม่ใช้ framework เพื่อฝึกพื้นฐานให้แน่นก่อน',
    challenges: 'ตอนอัปโหลดไฟล์ขึ้น GitHub ผ่านมือถือ พาธไฟล์ผิดที่และไฟล์นามสกุลเพี้ยน ทำให้สไตล์ไม่โหลด ต้องแก้ทีละไฟล์',
    improve: 'วางแผนจะอัปเกรดเป็น React ในเวอร์ชันถัดไปตาม Roadmap ที่วางไว้',
  },
};

const modalOverlay = document.getElementById('projectModalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalTech = document.getElementById('modalTech');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function openProjectModal(id) {
  const data = projectData[id];
  if (!data) return;

  modalTitle.textContent = data.title;
  modalTech.innerHTML = data.tech.map((t) => `<span>${t}</span>`).join('');
  modalBody.innerHTML = `
    <dl>
      <dt>Why I built it</dt><dd>${data.why}</dd>
      <dt>What I learned</dt><dd>${data.learned}</dd>
      <dt>How it works</dt><dd>${data.how}</dd>
      <dt>Challenges</dt><dd>${data.challenges}</dd>
      <dt>What I would improve</dt><dd>${data.improve}</dd>
    </dl>
  `;
  modalOverlay.classList.add('open');
}

function closeProjectModal() {
  modalOverlay.classList.remove('open');
}

document.querySelectorAll('[data-project]').forEach((btn) => {
  btn.addEventListener('click', () => openProjectModal(btn.dataset.project));
});

modalClose.addEventListener('click', closeProjectModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeProjectModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal();
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
