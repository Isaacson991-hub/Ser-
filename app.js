// ============================================
// UMA EM UMA VIDA — Site de Pedido Surreal
// ============================================

let currentPage = 0;
const totalPages = 10; // 0 to 9
let herName = 'Você';
let hisName = 'Eu';
let soundEnabled = false;
let scanInterval = null;
let clockInterval = null;
let firstMeetingDate = new Date('2024-06-15T20:00:00'); // Default magical date
let globeScene, globeCamera, globeRenderer, globePoints;
let shieldActive = false;

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  createNavDots();
  setupForgetButton();
  setupVaultInputs();
  updateProgress();
  
  // Keyboard for shield game
  document.addEventListener('keydown', (e) => {
    if (currentPage === 5) activateShield();
  });
  document.getElementById('game-area')?.addEventListener('click', activateShield);
  document.getElementById('game-area')?.addEventListener('touchstart', activateShield);
});

// ========== STARS ==========
function createStars() {
  const container = document.getElementById('stars');
  for (let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--duration', (Math.random() * 4 + 2) + 's');
    star.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(star);
  }
}

// ========== NAV ==========
function createNavDots() {
  const nav = document.getElementById('nav-dots');
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('button');
    dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-gold-400 scale-125' : 'bg-white/20 hover:bg-white/40'}`;
    dot.onclick = () => { if (i <= currentPage || i === 0) goToPage(i); };
    dot.title = `Página ${i}`;
    nav.appendChild(dot);
  }
}

function updateNavDots() {
  const dots = document.getElementById('nav-dots').children;
  for (let i = 0; i < dots.length; i++) {
    if (i === currentPage) {
      dots[i].className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 bg-gold-400 scale-125';
    } else if (i < currentPage) {
      dots[i].className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 bg-gold-400/50 hover:bg-gold-400';
    } else {
      dots[i].className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 bg-white/20 hover:bg-white/40';
    }
  }
}

function updateProgress() {
  const pct = (currentPage / (totalPages - 1)) * 100;
  document.getElementById('progress').style.width = pct + '%';
}

// ========== PAGE NAVIGATION ==========
function goToPage(n) {
  if (n < 0 || n >= totalPages) return;
  
  document.getElementById(`page-${currentPage}`).classList.remove('active');
  currentPage = n;
  document.getElementById(`page-${currentPage}`).classList.add('active');
  
  updateNavDots();
  updateProgress();
  
  // Page-specific inits
  if (n === 3) startQuantumClock();
  if (n === 4) initGlobe();
  if (n === 5) startThreats();
  if (n === 9) {
    document.getElementById('from-to').textContent = `— ${hisName}, com todo o amor do universo`;
  }
  
  // Scroll to top of page
  document.getElementById(`page-${n}`).scrollTop = 0;
  
  playPageSound();
}

function startJourney() {
  const her = document.getElementById('her-name').value.trim();
  const his = document.getElementById('his-name').value.trim();
  if (her) herName = her;
  if (his) hisName = his;
  
  // Personalize some texts
  document.querySelectorAll('[data-her]').forEach(el => el.textContent = herName);
  
  goToPage(1);
}

// ========== PAGE 1: BIOMETRIC SCAN ==========
function startScan() {
  const zone = document.getElementById('fingerprint');
  const status = document.getElementById('scan-status');
  const panel = document.getElementById('analysis-panel');
  const lines = document.getElementById('analysis-lines');
  const result = document.getElementById('result-panel');
  const scanLine = document.getElementById('scan-line');
  
  zone.classList.add('scanning');
  status.textContent = 'ESCANEANDO... NÃO REMOVA O POLEGAR';
  document.getElementById('finger-icon').textContent = '📡';
  scanLine.style.display = 'block';
  
  panel.classList.remove('hidden');
  lines.innerHTML = '';
  
  const steps = [
    { text: 'Analisando 8.051.239.410 pessoas no planeta Terra...', delay: 800, pop: 8051239410 },
    { text: 'Descartando pessoas que não sabem rir das suas piadas... (-2 bilhões)', delay: 1800, pop: 6051239410 },
    { text: 'Filtrando conexões superficiais e contatos de momentos... (-5 bilhões)', delay: 2800, pop: 1051239410 },
    { text: 'Eliminando pessoas que o tempo levou... (-1 bilhão)', delay: 3800, pop: 51239410 },
    { text: 'Buscando quem ficou de um jeito diferente...', delay: 4800, pop: 1 },
    { text: '✓ ÚNICO PERFIL ENCONTRADO', delay: 5800, pop: 1 }
  ];
  
  let i = 0;
  function nextStep() {
    if (i >= steps.length) {
      zone.classList.remove('scanning');
      scanLine.style.display = 'none';
      status.textContent = 'ESCANEAMENTO CONCLUÍDO';
      document.getElementById('finger-icon').textContent = '✅';
      setTimeout(() => {
        panel.classList.add('hidden');
        result.classList.remove('hidden');
        playSuccessSound();
      }, 600);
      return;
    }
    
    const step = steps[i];
    const line = document.createElement('div');
    line.className = 'opacity-0 transition-opacity duration-500';
    line.innerHTML = `<span class="text-neon-cyan">›</span> ${step.text}`;
    lines.appendChild(line);
    setTimeout(() => line.classList.remove('opacity-0'), 50);
    
    animateCounter(step.pop);
    i++;
    setTimeout(nextStep, step.delay - (i > 0 ? steps[i-1].delay : 0) || 1000);
  }
  
  // Fix timing
  let cumulative = 0;
  steps.forEach((s, idx) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'opacity-0 transition-opacity duration-500 flex items-start gap-2';
      line.innerHTML = `<span class="text-neon-cyan mt-0.5">›</span> <span>${s.text}</span>`;
      lines.appendChild(line);
      requestAnimationFrame(() => line.classList.remove('opacity-0'));
      animateCounter(s.pop);
      
      if (idx === steps.length - 1) {
        setTimeout(() => {
          zone.classList.remove('scanning');
          scanLine.style.display = 'none';
          status.textContent = 'ESCANEAMENTO CONCLUÍDO';
          document.getElementById('finger-icon').textContent = '✅';
          setTimeout(() => {
            panel.classList.add('hidden');
            result.classList.remove('hidden');
            playSuccessSound();
          }, 800);
        }, 1200);
      }
    }, cumulative);
    cumulative += (idx === 0 ? 1000 : 1200);
  });
}

function animateCounter(target) {
  const el = document.getElementById('pop-counter');
  const current = parseInt(el.textContent.replace(/\D/g, '')) || 8051239410;
  const duration = 900;
  const start = performance.now();
  
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.round(current + (target - current) * eased);
    el.textContent = val.toLocaleString('pt-BR');
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ========== PAGE 2: MUSEUM ==========
const memories = [
  { emoji: '📸', title: 'O Primeiro Olhar', text: 'Filtro Anti-Tempo ativado. Naquele segundo, o universo inteiro parou. Esta imagem nunca irá desbotar.' },
  { emoji: '💫', title: 'A Risada Eterna', text: 'Aquela risada que ecoa até hoje. Gravada em alta definição emocional. Impossível de apagar.' },
  { emoji: '🌙', title: 'A Noite Especial', text: 'Sob as mesmas estrelas que nos observam agora. Memória protegida por protocolo de eternidade.' },
  { emoji: '❤️', title: 'O Momento Único', text: 'Quando tudo fez sentido. Arquivado permanentemente na estrutura do coração.' }
];

function showMemory(idx) {
  const m = memories[idx];
  document.getElementById('memory-emoji').textContent = m.emoji;
  document.getElementById('memory-title').textContent = m.title;
  document.getElementById('memory-text').textContent = m.text;
  const modal = document.getElementById('memory-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeMemory() {
  const modal = document.getElementById('memory-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function setupForgetButton() {
  const btn = document.getElementById('forget-btn');
  if (!btn) return;
  
  let attempts = 0;
  btn.addEventListener('mouseenter', (e) => {
    attempts++;
    const parent = btn.parentElement;
    const maxX = parent.offsetWidth - btn.offsetWidth - 20;
    const maxY = parent.offsetHeight - btn.offsetHeight - 10;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
    
    if (attempts > 8) {
      // Eventually allow click after persistence
      btn.style.transition = 'none';
    }
  });
  
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('error-modal').classList.remove('hidden');
    document.getElementById('error-modal').classList.add('flex');
    playErrorSound();
  });
}

function closeError() {
  document.getElementById('error-modal').classList.add('hidden');
  document.getElementById('error-modal').classList.remove('flex');
}

// ========== PAGE 3: QUANTUM CLOCK ==========
function startQuantumClock() {
  if (clockInterval) clearInterval(clockInterval);
  
  function update() {
    const now = new Date();
    let diff = now - firstMeetingDate;
    if (diff < 0) diff = 0;
    
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / 60000) % 60;
    const hours = Math.floor(diff / 3600000) % 24;
    const days = Math.floor(diff / 86400000) % 30;
    const months = Math.floor(diff / (86400000 * 30.44)) % 12;
    const years = Math.floor(diff / (86400000 * 365.25));
    
    document.getElementById('y').textContent = years;
    document.getElementById('mo').textContent = months;
    document.getElementById('d').textContent = days;
    document.getElementById('h').textContent = hours;
    document.getElementById('mi').textContent = minutes;
    document.getElementById('s').textContent = seconds;
  }
  
  update();
  clockInterval = setInterval(update, 1000);
}

// ========== PAGE 4: GLOBE ==========
function initGlobe() {
  const container = document.getElementById('globe-container');
  if (globeRenderer) return; // already init
  
  document.getElementById('globe-placeholder').style.display = 'none';
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  globeScene = new THREE.Scene();
  globeCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  globeCamera.position.z = 2.8;
  
  globeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  globeRenderer.setSize(width, height);
  globeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(globeRenderer.domElement);
  
  // Points for globe
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const particleCount = 2000;
  
  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;
    
    const x = Math.cos(theta) * Math.sin(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(phi);
    
    positions.push(x * 1.2, y * 1.2, z * 1.2);
    
    // Yellow points
    colors.push(1, 0.85, 0.2);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  globePoints = new THREE.Points(geometry, material);
  globeScene.add(globePoints);
  
  // Ambient light
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  globeScene.add(ambient);
  
  function animate() {
    if (currentPage !== 4) return;
    requestAnimationFrame(animate);
    if (globePoints) {
      globePoints.rotation.y += 0.002;
      globePoints.rotation.x += 0.0005;
    }
    globeRenderer.render(globeScene, globeCamera);
  }
  animate();
  
  window.addEventListener('resize', () => {
    if (!globeRenderer) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    globeCamera.aspect = w / h;
    globeCamera.updateProjectionMatrix();
    globeRenderer.setSize(w, h);
  });
}

function activateLoveScan() {
  const btn = document.getElementById('scan-love-btn');
  btn.disabled = true;
  btn.textContent = 'VARRENDO O PLANETA...';
  btn.classList.add('opacity-70');
  
  // Speed up rotation and fade points
  let speed = 0.002;
  let opacity = 0.8;
  const start = performance.now();
  
  function scanAnim(now) {
    const t = (now - start) / 3000;
    if (globePoints) {
      speed = 0.002 + t * 0.1;
      globePoints.rotation.y += speed;
      
      if (t > 0.5) {
        opacity = Math.max(0.1, 0.8 - (t - 0.5) * 1.4);
        globePoints.material.opacity = opacity;
        
        // Keep one bright point (simulate)
        if (t > 0.9) {
          globePoints.material.opacity = 0.15;
        }
      }
    }
    
    if (t < 1) {
      requestAnimationFrame(scanAnim);
    } else {
      btn.textContent = '✓ ÚNICO SINAL DETECTADO';
      btn.classList.remove('opacity-70');
      document.getElementById('love-result').classList.remove('hidden');
      playSuccessSound();
      
      // Make a bright pink point effect via CSS overlay
      const container = document.getElementById('globe-container');
      const pulse = document.createElement('div');
      pulse.className = 'absolute inset-0 flex items-center justify-center pointer-events-none';
      pulse.innerHTML = '<div class="w-16 h-16 rounded-full bg-neon-pink/40 animate-ping"></div><div class="absolute w-8 h-8 rounded-full bg-neon-pink shadow-[0_0_40px_#ff2d95]"></div>';
      container.appendChild(pulse);
    }
  }
  requestAnimationFrame(scanAnim);
}

// ========== PAGE 5: SHIELD ==========
let threatInterval = null;
function startThreats() {
  if (threatInterval) clearInterval(threatInterval);
  const threats = ['Distância', 'Rotina', 'Dia Ruim', 'Trânsito', 'Cansaço', 'Dúvida'];
  const threatEl = document.getElementById('threat');
  const gameArea = document.getElementById('game-area');
  
  threatInterval = setInterval(() => {
    if (currentPage !== 5) return;
    if (shieldActive) return;
    
    const threat = threats[Math.floor(Math.random() * threats.length)];
    threatEl.textContent = threat;
    threatEl.style.opacity = '1';
    threatEl.style.left = Math.random() * 70 + 10 + '%';
    threatEl.style.top = '10%';
    threatEl.style.transition = 'none';
    
    setTimeout(() => {
      threatEl.style.transition = 'all 1.5s linear';
      threatEl.style.top = '80%';
      threatEl.style.opacity = '0';
    }, 50);
  }, 2000);
}

function activateShield() {
  if (currentPage !== 5) return;
  shieldActive = true;
  document.getElementById('shield-msg').textContent = '🛡️ ESCUDO ATIVADO — SUPERPODERES ENGATADOS';
  document.getElementById('shield-bar').style.width = '100%';
  document.getElementById('love-lamp').textContent = '💖';
  
  // Destroy threats
  document.getElementById('threat').style.opacity = '0';
  
  setTimeout(() => {
    shieldActive = false;
    document.getElementById('shield-msg').textContent = 'Escudo recarregando... (pressione qualquer tecla)';
    document.getElementById('love-lamp').textContent = '💡';
  }, 2000);
}

// ========== PAGE 6: STAMP ==========
function applyStamp() {
  document.getElementById('stamp-btn').classList.add('hidden');
  document.getElementById('stamp-result').classList.remove('hidden');
  playSuccessSound();
}

// ========== PAGE 7: TIME & VAULT ==========
const futures = [
  { emoji: '👫', text: 'Vocês agora, exatamente como são.', desc: 'O presente é o melhor lugar para estar.' },
  { emoji: '🏡', text: '2030 — Construindo um lar juntos.', desc: 'Mais memórias, mais risadas, mais nós.' },
  { emoji: '👨‍👩‍👧‍👦', text: '2040 — Uma família (do jeito que for).', desc: 'Amor multiplicado. Histórias que se expandem.' },
  { emoji: '👴👵', text: '2050 — Cabelos prateados, mãos dadas.', desc: 'O mesmo olhar. A mesma certeza.' },
  { emoji: '🌟', text: '2080 — Lendas um do outro.', desc: 'A história que o tempo não conseguiu apagar.' }
];

function updateFuture(val) {
  const f = futures[parseInt(val)];
  document.getElementById('future-emoji').textContent = f.emoji;
  document.getElementById('future-text').textContent = f.text;
  document.getElementById('future-desc').textContent = f.desc;
}

function setupVaultInputs() {
  ['code1','code2','code3','code4'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      if (el.value && i < 3) document.getElementById(`code${i+2}`).focus();
    });
  });
}

function tryVault() {
  const code = ['code1','code2','code3','code4'].map(id => document.getElementById(id).value).join('');
  if (code === '2026') {
    document.getElementById('vault-door').classList.add('open');
    document.getElementById('vault-door').textContent = '🔓';
    setTimeout(() => {
      document.getElementById('vault-content').classList.remove('hidden');
      playSuccessSound();
    }, 800);
  } else {
    // Shake
    const vault = document.getElementById('vault');
    vault.style.animation = 'none';
    vault.offsetHeight;
    vault.style.animation = 'shake 0.4s';
    setTimeout(() => vault.style.animation = '', 400);
  }
}

// Add shake keyframe dynamically
const style = document.createElement('style');
style.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }`;
document.head.appendChild(style);

// ========== PAGE 8: MULTIVERSE ==========
function revealUniverse(card, letter) {
  const result = card.querySelector('.universe-result');
  if (result) {
    result.classList.remove('hidden');
    card.classList.add('border', 'border-gold-400/50');
  }
}

// ========== PAGE 9: FINAL ==========
function openFinalSecret() {
  document.getElementById('pre-reveal').classList.add('hidden');
  document.getElementById('final-proposal').classList.remove('hidden');
  
  // Dramatic effect
  document.body.style.transition = 'background 1s';
  playSuccessSound();
}

function acceptProposal(option) {
  document.getElementById('final-proposal').classList.add('hidden');
  document.getElementById('celebration').classList.remove('hidden');
  document.getElementById('celeb-msg').textContent = 
    option === 'A' ? `${herName} disse SIM com 1000% de certeza!` : `${herName} escolheu a única resposta lógica: SIM!`;
  
  // Confetti explosion
  const duration = 5000;
  const end = Date.now() + duration;
  
  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#fbbf24', '#ff2d95', '#00f0ff', '#ffffff']
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#fbbf24', '#ff2d95', '#00f0ff', '#ffffff']
    });
    
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  
  // Big center burst
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#ff2d95', '#00f0ff', '#b026ff', '#ffffff']
    });
  }, 300);
  
  playCelebrationSound();
}

function restartExperience() {
  currentPage = 0;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-0').classList.add('active');
  document.getElementById('pre-reveal').classList.remove('hidden');
  document.getElementById('final-proposal').classList.add('hidden');
  document.getElementById('celebration').classList.add('hidden');
  document.getElementById('result-panel').classList.add('hidden');
  document.getElementById('analysis-panel').classList.add('hidden');
  document.getElementById('love-result').classList.add('hidden');
  document.getElementById('stamp-result').classList.add('hidden');
  document.getElementById('stamp-btn').classList.remove('hidden');
  document.getElementById('vault-content').classList.add('hidden');
  document.getElementById('vault-door').classList.remove('open');
  document.getElementById('vault-door').textContent = '🔒';
  updateNavDots();
  updateProgress();
}

// ========== SOUND (Web Audio API - procedural + música de fundo) ==========
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Música de fundo: "Uma em Uma Vida"
const bgMusic = new Audio('uma-em-uma-vida.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.55;
bgMusic.preload = 'auto';

function playTone(freq, type, duration, vol = 0.1) {
  if (!soundEnabled) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playSuccessSound() {
  playTone(523.25, 'sine', 0.15, 0.08);
  setTimeout(() => playTone(659.25, 'sine', 0.15, 0.08), 100);
  setTimeout(() => playTone(783.99, 'sine', 0.3, 0.1), 200);
}

function playErrorSound() {
  playTone(200, 'sawtooth', 0.3, 0.05);
  setTimeout(() => playTone(150, 'sawtooth', 0.4, 0.05), 150);
}

function playPageSound() {
  playTone(400 + currentPage * 30, 'sine', 0.1, 0.04);
}

function playCelebrationSound() {
  [523, 659, 784, 1046].forEach((f, i) => {
    setTimeout(() => playTone(f, 'sine', 0.4, 0.1), i * 120);
  });
}

function startBackgroundMusic() {
  if (!soundEnabled) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  bgMusic.play().catch(() => {
    // Autoplay bloqueado — o usuário precisa interagir (já interagiu no toggle)
  });
}

function stopBackgroundMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

document.getElementById('sound-toggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  document.getElementById('sound-toggle').textContent = soundEnabled ? '🔊' : '🔇';
  if (soundEnabled) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    startBackgroundMusic();
    playTone(600, 'sine', 0.1, 0.08);
  } else {
    stopBackgroundMusic();
  }
});

// ========== SURPRISE: Konami-like or click easter egg ==========
let clickCount = 0;
document.addEventListener('click', () => {
  clickCount++;
  if (clickCount === 50) {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    alert('Você descobriu o easter egg das 50 cliques! O universo te ama. 💖');
  }
});
