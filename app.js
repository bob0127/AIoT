/**
 * BOB0127 PERSONAL HUB & ENGINEERING PORTFOLIO
 * Real-time precision clock, identity management, technical skills,
 * projects portfolio filtering, and Web Audio ambience.
 */

// ============================================================================
// State Management & Local Storage Keys
// ============================================================================
const STORAGE_KEYS = {
  PROFILE: 'aiot_user_profile',
  TIME_FORMAT: 'aiot_time_format',
  THEME: 'aiot_active_theme',
  SCRATCHPAD: 'aiot_scratchpad_notes',
  SHORTCUTS: 'aiot_custom_shortcuts',
  PROJECTS: 'aiot_portfolio_projects'
};

const DEFAULT_PROFILE = {
  name: 'bob0127',
  bio: 'Creative Explorer & Problem Solver',
  location: 'Earth / Remote'
};

const DEFAULT_SHORTCUTS = [
  { id: '1', title: 'GitHub', url: 'https://github.com/bob0127', icon: '💻' },
  { id: '2', title: 'Google', url: 'https://google.com', icon: '🔍' },
  { id: '3', title: 'Weather', url: 'https://weather.com', icon: '⛅' },
  { id: '4', title: 'Calendar', url: 'https://calendar.google.com', icon: '📅' }
];

const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    title: 'AIoT Smart Edge Hub',
    category: 'cpp',
    categoryName: 'C/C++ & AI',
    desc: 'High-speed embedded telemetry ingestion engine with on-device edge AI inference for real-time anomaly detection and low-latency sensor fusion.',
    tags: ['C++20', 'Edge AI', 'TensorRT', 'IoT', 'Linux'],
    link: 'https://github.com/bob0127'
  },
  {
    id: 'proj-2',
    title: 'Neural Vision Inspector',
    category: 'ai',
    categoryName: 'AI & Vision',
    desc: 'Real-time deep learning visual inspection pipeline with WebSocket telemetry, bounding box tracking, and interactive analytics dashboard.',
    tags: ['Python', 'PyTorch', 'OpenCV', 'WebSockets', 'CUDA'],
    link: 'https://github.com/bob0127'
  },
  {
    id: 'proj-3',
    title: 'High-Performance Memory Pool',
    category: 'cpp',
    categoryName: 'C / C++',
    desc: 'Zero-allocation lock-free custom memory pool allocator engineered for low-latency systems and concurrent streaming architectures.',
    tags: ['C++', 'Concurrency', 'Lock-Free', 'Systems Programming'],
    link: 'https://github.com/bob0127'
  },
  {
    id: 'proj-4',
    title: 'Dynamic Personal Hub & Clock',
    category: 'web',
    categoryName: 'Web Development',
    desc: 'Glassmorphic responsive dashboard with real-time digital clock, Web Audio API sound synthesis, multi-theme engine, and dynamic profile management.',
    tags: ['HTML5', 'Vanilla CSS', 'JavaScript', 'Web Audio API'],
    link: 'https://github.com/bob0127'
  },
  {
    id: 'proj-5',
    title: 'Autonomous Edge Pathfinding Agent',
    category: 'ai',
    categoryName: 'AI & Systems',
    desc: 'Deep reinforcement learning navigation agent running in a simulated 3D environment with hardware-accelerated spatial mapping.',
    tags: ['C++', 'PyTorch', 'Reinforcement Learning', 'Robotics'],
    link: 'https://github.com/bob0127'
  },
  {
    id: 'proj-6',
    title: 'Sensor Telemetry Web Suite',
    category: 'web',
    categoryName: 'Web Development',
    desc: 'Real-time IoT metrics dashboard rendering high-frequency 60FPS sensor waveforms with WebSocket streaming and responsive glassmorphism.',
    tags: ['JavaScript', 'Canvas API', 'WebSockets', 'Responsive UX'],
    link: 'https://github.com/bob0127'
  }
];

const WORLD_ZONES = [
  { city: 'London', timeZone: 'Europe/London' },
  { city: 'New York', timeZone: 'America/New_York' },
  { city: 'Tokyo', timeZone: 'Asia/Tokyo' },
  { city: 'Sydney', timeZone: 'Australia/Sydney' }
];

// App State
let state = {
  profile: loadJSON(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE),
  timeFormat: localStorage.getItem(STORAGE_KEYS.TIME_FORMAT) || '24h',
  theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'ocean',
  shortcuts: loadJSON(STORAGE_KEYS.SHORTCUTS, DEFAULT_SHORTCUTS),
  projects: loadJSON(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS),
  activeFilter: 'all',
  isAudioPlaying: false
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('Error loading JSON for', key, e);
    return fallback;
  }
}

function saveJSON(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving JSON for', key, e);
  }
}

// ============================================================================
// DOM Elements
// ============================================================================
const elements = {
  // Theme & Format
  body: document.body,
  themeBtn: document.getElementById('theme-btn'),
  themeMenu: document.getElementById('theme-menu'),
  themeDropdown: document.querySelector('.theme-dropdown-container'),
  formatToggleBtn: document.getElementById('format-toggle'),
  formatBadge: document.getElementById('format-badge'),
  navLinks: document.querySelectorAll('.nav-link'),

  // Profile
  userName: document.getElementById('user-name'),
  userBio: document.getElementById('user-bio'),
  avatarInitials: document.getElementById('avatar-initials'),
  greetingIcon: document.getElementById('greeting-icon'),
  greetingText: document.getElementById('greeting-text'),
  quickEditBtn: document.getElementById('quick-edit-name-btn'),
  openEditBtn: document.getElementById('open-edit-btn'),

  // Profile Modal
  editModal: document.getElementById('edit-modal'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  cancelEditBtn: document.getElementById('cancel-edit-btn'),
  profileForm: document.getElementById('profile-edit-form'),
  inputUserName: document.getElementById('input-user-name'),
  inputUserBio: document.getElementById('input-user-bio'),
  inputUserLocation: document.getElementById('input-user-location'),

  // Clock Digits & Displays
  clockHours: document.getElementById('clock-hours'),
  clockMinutes: document.getElementById('clock-minutes'),
  clockSeconds: document.getElementById('clock-seconds'),
  clockAmpm: document.getElementById('clock-ampm'),
  ampmWrapper: document.getElementById('ampm-wrapper'),
  fullDateString: document.getElementById('full-date-string'),
  metricDayNum: document.getElementById('metric-day-num'),
  dayPercentText: document.getElementById('day-percent-text'),
  dayProgressBar: document.getElementById('day-progress-bar'),
  timezoneName: document.getElementById('timezone-name'),
  copyTimeBtn: document.getElementById('copy-time-btn'),
  copyText: document.getElementById('copy-text'),
  footerTick: document.getElementById('footer-live-tick'),

  // Projects
  projectsContainer: document.getElementById('projects-container'),
  projectFilterBar: document.getElementById('project-filter-bar'),
  openAddProjectBtn: document.getElementById('open-add-project-btn'),
  projectModal: document.getElementById('project-modal'),
  closeProjectModalBtn: document.getElementById('close-project-modal-btn'),
  cancelProjectBtn: document.getElementById('cancel-project-btn'),
  projectAddForm: document.getElementById('project-add-form'),
  inputProjTitle: document.getElementById('input-proj-title'),
  inputProjCategory: document.getElementById('input-proj-category'),
  inputProjDesc: document.getElementById('input-proj-desc'),
  inputProjTags: document.getElementById('input-proj-tags'),
  inputProjLink: document.getElementById('input-proj-link'),

  // World Clocks
  worldClockList: document.getElementById('world-clock-list'),

  // Scratchpad
  scratchpadInput: document.getElementById('scratchpad-input'),
  notesSaveIndicator: document.getElementById('notes-save-indicator'),

  // Shortcuts
  shortcutsContainer: document.getElementById('shortcuts-container'),
  addLinkBtn: document.getElementById('add-link-btn'),
  linkModal: document.getElementById('link-modal'),
  closeLinkModalBtn: document.getElementById('close-link-modal-btn'),
  cancelLinkBtn: document.getElementById('cancel-link-btn'),
  linkAddForm: document.getElementById('link-add-form'),
  inputLinkTitle: document.getElementById('input-link-title'),
  inputLinkUrl: document.getElementById('input-link-url'),

  // Ambient Audio
  audioToggleBtn: document.getElementById('audio-toggle-btn'),
  audioPlayIcon: document.getElementById('audio-play-icon'),
  audioToggleText: document.getElementById('audio-toggle-text'),
  audioStatusTag: document.getElementById('audio-status-tag'),
  volumeSlider: document.getElementById('volume-slider')
};

// ============================================================================
// Real-Time Clock Engine
// ============================================================================
function updateClock() {
  const now = new Date();

  const hours24 = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();

  // 12h vs 24h calculation
  let displayHours = hours24;
  let ampm = '';

  if (state.timeFormat === '12h') {
    ampm = hours24 >= 12 ? 'PM' : 'AM';
    displayHours = hours24 % 12 || 12;
    elements.ampmWrapper.style.display = 'block';
    elements.clockAmpm.textContent = ampm;
  } else {
    elements.ampmWrapper.style.display = 'none';
  }

  elements.clockHours.textContent = String(displayHours).padStart(2, '0');
  elements.clockMinutes.textContent = String(minutes).padStart(2, '0');
  elements.clockSeconds.textContent = String(seconds).padStart(2, '0');

  // Full date formatted
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  elements.fullDateString.textContent = now.toLocaleDateString(undefined, dateOptions);

  // Day of year calculation
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  const isLeap = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || (now.getFullYear() % 400 === 0);
  const totalDays = isLeap ? 366 : 365;
  elements.metricDayNum.textContent = `${dayOfYear} of ${totalDays}`;

  // Day progress percentage (0 - 100%)
  const secondsToday = hours24 * 3600 + minutes * 60 + seconds + (ms / 1000);
  const percent = ((secondsToday / 86400) * 100).toFixed(1);
  elements.dayPercentText.textContent = `${percent}%`;
  elements.dayProgressBar.style.width = `${percent}%`;

  // Dynamic Greeting
  updateGreeting(hours24);

  // Update World Clocks
  updateWorldClocks(now);
}

function updateGreeting(hours) {
  let greeting = 'Hello,';
  let icon = '✨';

  if (hours >= 5 && hours < 12) {
    greeting = 'Good morning,';
    icon = '🌅';
  } else if (hours >= 12 && hours < 17) {
    greeting = 'Good afternoon,';
    icon = '☀️';
  } else if (hours >= 17 && hours < 21) {
    greeting = 'Good evening,';
    icon = '🌆';
  } else {
    greeting = 'Good night,';
    icon = '🌙';
  }

  elements.greetingText.textContent = greeting;
  elements.greetingIcon.textContent = icon;
}

function detectTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    const offsetMin = -new Date().getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMin) / 60);
    const offsetRemainder = Math.abs(offsetMin) % 60;
    const sign = offsetMin >= 0 ? '+' : '-';
    const offsetString = `UTC${sign}${offsetHours}${offsetRemainder ? `:${offsetRemainder}` : ''}`;

    elements.timezoneName.textContent = `${tz} (${offsetString})`;
  } catch (e) {
    elements.timezoneName.textContent = 'Local Time';
  }
}

function updateWorldClocks(now) {
  elements.worldClockList.innerHTML = '';

  WORLD_ZONES.forEach(zone => {
    try {
      const timeStr = now.toLocaleTimeString(undefined, {
        timeZone: zone.timeZone,
        hour12: state.timeFormat === '12h',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const localDay = now.getDate();
      const zoneDate = new Date(now.toLocaleString('en-US', { timeZone: zone.timeZone }));
      let offsetBadge = 'Today';
      if (zoneDate.getDate() > localDay) offsetBadge = 'Tomorrow';
      else if (zoneDate.getDate() < localDay) offsetBadge = 'Yesterday';

      const row = document.createElement('div');
      row.className = 'world-clock-row';
      row.innerHTML = `
        <div class="city-info">
          <span class="city-name">${zone.city}</span>
          <span class="city-offset">${offsetBadge} &bull; ${zone.timeZone.split('/')[1]?.replace('_', ' ') || ''}</span>
        </div>
        <span class="city-time">${timeStr}</span>
      `;
      elements.worldClockList.appendChild(row);
    } catch (e) {
      console.warn('Zone error:', zone.city, e);
    }
  });
}

// ============================================================================
// Profile Management
// ============================================================================
function renderProfile() {
  elements.userName.textContent = state.profile.name || 'bob0127';
  elements.userBio.textContent = state.profile.bio || 'Creative Explorer & Problem Solver';

  // Initials
  const parts = (state.profile.name || 'bob0127').trim().split(/\s+/);
  let initials = 'BO';
  if (parts.length >= 2) {
    initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (parts[0]) {
    initials = parts[0].substring(0, 2).toUpperCase();
  }
  elements.avatarInitials.textContent = initials;
}

function openProfileModal() {
  elements.inputUserName.value = state.profile.name;
  elements.inputUserBio.value = state.profile.bio;
  elements.inputUserLocation.value = state.profile.location;
  elements.editModal.classList.add('active');
  elements.editModal.setAttribute('aria-hidden', 'false');
  elements.inputUserName.focus();
}

function closeProfileModal() {
  elements.editModal.classList.remove('active');
  elements.editModal.setAttribute('aria-hidden', 'true');
}

elements.profileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newName = elements.inputUserName.value.trim();
  if (newName) {
    state.profile.name = newName;
    state.profile.bio = elements.inputUserBio.value.trim();
    state.profile.location = elements.inputUserLocation.value.trim();
    saveJSON(STORAGE_KEYS.PROFILE, state.profile);
    renderProfile();
    closeProfileModal();
  }
});

elements.userName.addEventListener('click', openProfileModal);
elements.quickEditBtn.addEventListener('click', openProfileModal);
elements.openEditBtn.addEventListener('click', openProfileModal);
elements.closeModalBtn.addEventListener('click', closeProfileModal);
elements.cancelEditBtn.addEventListener('click', closeProfileModal);

elements.editModal.addEventListener('click', (e) => {
  if (e.target === elements.editModal) closeProfileModal();
});

// ============================================================================
// Projects Portfolio Management
// ============================================================================
function renderProjects(filter = 'all') {
  state.activeFilter = filter;
  elements.projectsContainer.innerHTML = '';

  const filtered = state.projects.filter(p => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  if (filtered.length === 0) {
    elements.projectsContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-tertiary);">
        No projects found in this category. Click "+ Add Project" to create one!
      </div>
    `;
    return;
  }

  filtered.forEach(proj => {
    const card = document.createElement('div');
    const catClass = proj.category ? `cat-${proj.category}` : 'cat-cpp';
    card.className = `project-card glass-panel ${catClass}`;

    const badgeClass = proj.category === 'cpp' ? 'badge-cpp' : (proj.category === 'ai' ? 'badge-ai' : 'badge-web');
    const tagsHtml = (proj.tags || []).map(t => `<span class="project-tag-item">${t}</span>`).join('');
    const linkUrl = proj.link || 'https://github.com/bob0127';

    card.innerHTML = `
      <div class="project-card-header">
        <span class="project-category-badge ${badgeClass}">${proj.categoryName || proj.category.toUpperCase()}</span>
        <button class="btn-proj-delete" data-id="${proj.id}" title="Remove project" aria-label="Remove project">&times;</button>
      </div>

      <h3 class="project-card-title">${proj.title}</h3>
      <p class="project-card-desc">${proj.desc}</p>

      <div class="project-tech-tags">
        ${tagsHtml}
      </div>

      <div class="project-card-footer">
        <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="btn-proj-action">
          <span>View Details</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </a>
      </div>
    `;

    // Handle delete
    const delBtn = card.querySelector('.btn-proj-delete');
    delBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteProject(proj.id);
    });

    elements.projectsContainer.appendChild(card);
  });
}

function deleteProject(id) {
  state.projects = state.projects.filter(p => p.id !== id);
  saveJSON(STORAGE_KEYS.PROJECTS, state.projects);
  renderProjects(state.activeFilter);
}

// Filter pills click handling
elements.projectFilterBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-pill');
  if (!btn) return;

  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  const filter = btn.getAttribute('data-filter');
  renderProjects(filter);
});

// Add Project Modal Handling
function openProjectModal() {
  elements.inputProjTitle.value = '';
  elements.inputProjDesc.value = '';
  elements.inputProjTags.value = '';
  elements.inputProjLink.value = '';
  elements.projectModal.classList.add('active');
  elements.projectModal.setAttribute('aria-hidden', 'false');
  elements.inputProjTitle.focus();
}

function closeProjectModal() {
  elements.projectModal.classList.remove('active');
  elements.projectModal.setAttribute('aria-hidden', 'true');
}

elements.openAddProjectBtn.addEventListener('click', openProjectModal);
elements.closeProjectModalBtn.addEventListener('click', closeProjectModal);
elements.cancelProjectBtn.addEventListener('click', closeProjectModal);

elements.projectModal.addEventListener('click', (e) => {
  if (e.target === elements.projectModal) closeProjectModal();
});

elements.projectAddForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = elements.inputProjTitle.value.trim();
  const category = elements.inputProjCategory.value;
  const desc = elements.inputProjDesc.value.trim();
  const rawTags = elements.inputProjTags.value.trim();
  const link = elements.inputProjLink.value.trim();

  let categoryName = 'C / C++';
  if (category === 'ai') categoryName = 'AI & Vision';
  else if (category === 'web') categoryName = 'Web Development';

  const tags = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : [categoryName];

  if (title && desc) {
    const newProj = {
      id: 'proj-' + Date.now(),
      title,
      category,
      categoryName,
      desc,
      tags,
      link: link || 'https://github.com/bob0127'
    };

    state.projects.unshift(newProj);
    saveJSON(STORAGE_KEYS.PROJECTS, state.projects);
    renderProjects(state.activeFilter);
    closeProjectModal();
  }
});

// ============================================================================
// Time Format & Theme Controls
// ============================================================================
elements.formatToggleBtn.addEventListener('click', () => {
  state.timeFormat = state.timeFormat === '24h' ? '12h' : '24h';
  localStorage.setItem(STORAGE_KEYS.TIME_FORMAT, state.timeFormat);
  elements.formatBadge.textContent = state.timeFormat.toUpperCase();
  updateClock();
});

function setTheme(theme) {
  state.theme = theme;
  elements.body.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);

  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-set-theme') === theme);
  });
}

elements.themeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  elements.themeDropdown.classList.toggle('active');
});

document.querySelectorAll('.theme-option').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetTheme = btn.getAttribute('data-set-theme');
    setTheme(targetTheme);
    elements.themeDropdown.classList.remove('active');
  });
});

document.addEventListener('click', (e) => {
  if (!elements.themeDropdown.contains(e.target)) {
    elements.themeDropdown.classList.remove('active');
  }
});

// Copy Time to Clipboard
elements.copyTimeBtn.addEventListener('click', async () => {
  const now = new Date();
  const timeStr = `${now.toISOString().replace('T', ' ').substring(0, 19)} (${elements.timezoneName.textContent})`;

  try {
    await navigator.clipboard.writeText(timeStr);
    elements.copyText.textContent = 'Copied!';
    setTimeout(() => {
      elements.copyText.textContent = 'Copy Time';
    }, 2000);
  } catch (err) {
    console.warn('Clipboard write failed', err);
  }
});

// ============================================================================
// Focus Scratchpad
// ============================================================================
function initScratchpad() {
  const savedNotes = localStorage.getItem(STORAGE_KEYS.SCRATCHPAD) || '';
  elements.scratchpadInput.value = savedNotes;

  let debounceTimer;
  elements.scratchpadInput.addEventListener('input', () => {
    elements.notesSaveIndicator.textContent = 'Saving...';
    elements.notesSaveIndicator.style.opacity = '0.5';

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.SCRATCHPAD, elements.scratchpadInput.value);
      elements.notesSaveIndicator.textContent = 'Auto-saved';
      elements.notesSaveIndicator.style.opacity = '1';
    }, 400);
  });
}

// ============================================================================
// Bookmarks / Shortcuts
// ============================================================================
function renderShortcuts() {
  elements.shortcutsContainer.innerHTML = '';

  state.shortcuts.forEach(item => {
    const el = document.createElement('a');
    el.href = item.url;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
    el.className = 'shortcut-item';
    el.innerHTML = `
      <span>${item.icon || '🔗'}</span>
      <span>${item.title}</span>
      <button class="shortcut-delete" data-id="${item.id}" title="Remove shortcut" aria-label="Remove shortcut">&times;</button>
    `;

    const delBtn = el.querySelector('.shortcut-delete');
    delBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteShortcut(item.id);
    });

    elements.shortcutsContainer.appendChild(el);
  });
}

function deleteShortcut(id) {
  state.shortcuts = state.shortcuts.filter(s => s.id !== id);
  saveJSON(STORAGE_KEYS.SHORTCUTS, state.shortcuts);
  renderShortcuts();
}

function openLinkModal() {
  elements.inputLinkTitle.value = '';
  elements.inputLinkUrl.value = 'https://';
  elements.linkModal.classList.add('active');
  elements.linkModal.setAttribute('aria-hidden', 'false');
  elements.inputLinkTitle.focus();
}

function closeLinkModal() {
  elements.linkModal.classList.remove('active');
  elements.linkModal.setAttribute('aria-hidden', 'true');
}

elements.addLinkBtn.addEventListener('click', openLinkModal);
elements.closeLinkModalBtn.addEventListener('click', closeLinkModal);
elements.cancelLinkBtn.addEventListener('click', closeLinkModal);

elements.linkModal.addEventListener('click', (e) => {
  if (e.target === elements.linkModal) closeLinkModal();
});

elements.linkAddForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = elements.inputLinkTitle.value.trim();
  let url = elements.inputLinkUrl.value.trim();

  if (title && url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    state.shortcuts.push({
      id: Date.now().toString(),
      title,
      url,
      icon: '🔗'
    });

    saveJSON(STORAGE_KEYS.SHORTCUTS, state.shortcuts);
    renderShortcuts();
    closeLinkModal();
  }
});

// ============================================================================
// Native Ambient Sound Engine (Web Audio API)
// Calming ocean waves & rain pink noise synthesis with zero external assets!
// ============================================================================
let audioCtx = null;
let noiseNode = null;
let filterNode = null;
let gainNode = null;

function createNoiseBuffer(ctx) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }
  return buffer;
}

function toggleAudio() {
  if (state.isAudioPlaying) {
    stopAudio();
  } else {
    startAudio();
  }
}

function startAudio() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = createNoiseBuffer(audioCtx);
    noiseNode.loop = true;

    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(550, audioCtx.currentTime);

    gainNode = audioCtx.createGain();
    const vol = parseFloat(elements.volumeSlider.value);
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);

    noiseNode.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseNode.start();
    state.isAudioPlaying = true;

    elements.audioToggleText.textContent = 'Pause Ocean';
    elements.audioStatusTag.textContent = 'Playing';
    elements.audioStatusTag.classList.add('active');
    elements.audioPlayIcon.innerHTML = `
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    `;
  } catch (e) {
    console.error('Audio initialization error:', e);
  }
}

function stopAudio() {
  if (noiseNode) {
    try {
      noiseNode.stop();
      noiseNode.disconnect();
    } catch (e) {}
    noiseNode = null;
  }
  state.isAudioPlaying = false;
  elements.audioToggleText.textContent = 'Play Ocean Sound';
  elements.audioStatusTag.textContent = 'Off';
  elements.audioStatusTag.classList.remove('active');
  elements.audioPlayIcon.innerHTML = `
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  `;
}

elements.audioToggleBtn.addEventListener('click', toggleAudio);

elements.volumeSlider.addEventListener('input', (e) => {
  if (gainNode && audioCtx) {
    gainNode.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
  }
});

// ============================================================================
// Active Section Highlight on Scroll
// ============================================================================
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = sec.getAttribute('id');
      }
    });

    elements.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ============================================================================
// Animated Bioluminescent Floating Bubbles Canvas Engine
// ============================================================================
function initBioluminescentCanvas() {
  const canvas = document.getElementById('ocean-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Multi-chromatic bioluminescent ocean colors
  const particleColors = [
    { r: 0, g: 242, b: 254 },    // Bioluminescent Cyan
    { r: 56, g: 189, b: 248 },   // Sky Aqua
    { r: 192, g: 132, b: 252 },  // Radiant Purple
    { r: 244, g: 114, b: 182 },  // Neon Fuchsia
    { r: 52, g: 211, b: 153 },   // Emerald Mint
    { r: 250, g: 204, b: 21 }    // Bioluminescent Gold
  ];

  const particleCount = 45;
  const particles = [];

  function createParticle(randomY = false) {
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + Math.random() * 40,
      radius: Math.random() * 3.5 + 1.2,
      speedY: Math.random() * 0.7 + 0.3,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayDistance: Math.random() * 30 + 10,
      swayOffset: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.55 + 0.25,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
      color
    };
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle(true));
  }

  let mouse = { x: -1000, y: -1000, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  let time = 0;
  function animate() {
    time += 0.03;
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      const sway = Math.sin(time * p.swaySpeed * 10 + p.swayOffset) * (p.swayDistance / 25);
      p.x += sway;

      // Mouse interactive repelling
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 2.8;
          p.y += (dy / dist) * force * 2.8;
        }
      }

      // Reset when floating off top or sides
      if (p.y < -30 || p.x < -40 || p.x > width + 40) {
        Object.assign(p, createParticle(false));
      }

      // Pulsing alpha
      const currentAlpha = Math.max(0.1, p.alpha + Math.sin(time * p.pulseSpeed * 20 + p.pulseOffset) * 0.15);

      // Draw glowing circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`;
      ctx.shadowBlur = p.radius * 3.5;
      ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.8)`;
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ============================================================================
// Initialization
// ============================================================================
function init() {
  // Apply saved theme (default: ocean)
  setTheme(state.theme);

  // Apply format badge label
  elements.formatBadge.textContent = state.timeFormat.toUpperCase();

  // Render profile
  renderProfile();

  // Render projects
  renderProjects('all');

  // Render bookmarks
  renderShortcuts();

  // Init scratchpad
  initScratchpad();

  // Timezone detection
  detectTimezone();

  // Real-time clock update
  updateClock();
  setInterval(updateClock, 500);

  // Scrollspy
  initScrollSpy();

  // Init animated particles canvas
  initBioluminescentCanvas();

  // Keyboard shortcut: Escape closes any modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProfileModal();
      closeLinkModal();
      closeProjectModal();
    }
  });

  // Footer sync pulse
  let tick = 0;
  setInterval(() => {
    tick++;
    elements.footerTick.textContent = tick % 2 === 0 ? 'Synced • Live' : 'Synced • Ocean Mode';
  }, 3000);
}

// Start on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
