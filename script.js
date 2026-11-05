/**
 * ============================================================================
 * A SPECIAL BIRTHDAY SURPRISE FOR YASH RAJ BHASKAR ❤️
 * Vanilla JavaScript Interactive Engine
 * 
 * Features:
 * - Opening Screen Surprise & 16th Age Counter Reveal
 * - Complete 17-Photo Gallery Engine with Fullscreen Lightbox Modal
 * - Canvas Confetti & Multi-Color Grand Fireworks Engine
 * - Dynamic Starry Background Particle Field
 * - Background Audio Controller with Web Audio API Fallback Synthesizer
 * - Interactive 3D Gift Box Unboxing
 * - Rotating Blessing & Power/NDA Motivation Generator
 * - Floating Hearts Generator & Scroll Reveal Animations
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive systems
  initParticlesBackground();
  initOpeningSurprise();
  initAudioPlayer();
  initConfettiEngine();
  initFireworksEngine();
  initGiftBox();
  initBlessingGenerator();
  initHeartSpawners();
  initLetterFeatures();
  initPhotoGalleryAndLightbox();
  initScrollAnimations();
});

/* ============================================================================
   1. Starry Particles Ambient Canvas
   ============================================================================ */
function initParticlesBackground() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.floor(Math.min(width, 1200) / 12);
  const particles = [];

  const colors = ['#ffffff', '#ffd700', '#fce78a', '#c084fc', '#60a5fa'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.7 + 0.2,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseOffset: Math.random() * Math.PI * 2
    });
  }

  let tick = 0;
  function render() {
    ctx.clearRect(0, 0, width, height);
    tick += 0.02;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const dynamicAlpha = p.alpha + Math.sin(tick + p.pulseOffset) * 0.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, dynamicAlpha));
      ctx.shadowBlur = p.radius * 4;
      ctx.shadowColor = p.color;
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    requestAnimationFrame(render);
  }
  render();
}

/* ============================================================================
   2. Opening Screen & Animated Age Reveal
   ============================================================================ */
function initOpeningSurprise() {
  const openingScreen = document.getElementById('opening-screen');
  const mainExperience = document.getElementById('main-card-experience');
  const openSurpriseBtn = document.getElementById('btn-open-surprise');
  const ageNumberDisplay = document.getElementById('age-number-display');
  const replayBtn = document.getElementById('btn-replay-surprise');

  // Animated Age Reveal: Count up from 0 to 16
  if (ageNumberDisplay) {
    setTimeout(() => {
      animateNumberCount(ageNumberDisplay, 0, 16, 1600);
    }, 1600);
  }

  if (openSurpriseBtn) {
    openSurpriseBtn.addEventListener('click', () => {
      // Trigger huge celebratory confetti blast
      launchConfettiBurst(85, window.innerWidth / 2, window.innerHeight * 0.4);

      // Smooth unveil transition
      openingScreen.classList.add('unveiled');
      mainExperience.classList.add('active');

      // Scroll smoothly to memory section
      setTimeout(() => {
        const memorySection = document.getElementById('memory-section');
        if (memorySection) {
          memorySection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);

      // Secondary confetti celebrations
      setTimeout(() => {
        launchConfettiBurst(60, window.innerWidth * 0.25, window.innerHeight * 0.5);
        launchConfettiBurst(60, window.innerWidth * 0.75, window.innerHeight * 0.5);
      }, 1000);
    });
  }

  // Replay surprise capability
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        mainExperience.classList.remove('active');
        openingScreen.classList.remove('unveiled');
        if (ageNumberDisplay) {
          ageNumberDisplay.textContent = '16';
        }
      }, 400);
    });
  }
}

function animateNumberCount(element, start, end, duration) {
  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeOutVal = 1 - Math.pow(1 - progress, 3);
    const currentNum = Math.floor(easeOutVal * (end - start) + start);
    element.textContent = currentNum;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = end;
    }
  }
  requestAnimationFrame(step);
}

/* ============================================================================
   3. Background Music Player with Web Audio Synthesizer Fallback
   ============================================================================ */
let audioCtx = null;
let isWebAudioPlaying = false;
let synthTimer = null;

function initAudioPlayer() {
  const audioElement = document.getElementById('bg-music');
  const toggleBtn = document.getElementById('music-toggle-btn');
  const toggleText = document.getElementById('music-toggle-text');

  if (!toggleBtn) return;

  let isPlaying = false;

  toggleBtn.addEventListener('click', () => {
    if (!isPlaying) {
      if (audioElement && audioElement.src) {
        audioElement.volume = 0.7;
        const playPromise = audioElement.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlayerState(true);
            })
            .catch((err) => {
              console.warn('Audio playback error, switching to ambient chime synthesizer:', err);
              startHarmonicWebAudioSynthesizer();
              setPlayerState(true);
            });
        } else {
          setPlayerState(true);
        }
      } else {
        startHarmonicWebAudioSynthesizer();
        setPlayerState(true);
      }
    } else {
      if (audioElement && !audioElement.paused) {
        audioElement.pause();
      }
      stopHarmonicWebAudioSynthesizer();
      setPlayerState(false);
    }
  });

  function setPlayerState(playing) {
    isPlaying = playing;
    if (playing) {
      toggleBtn.classList.add('music-playing');
      toggleText.textContent = 'Pause Music 🎵';
    } else {
      toggleBtn.classList.remove('music-playing');
      toggleText.textContent = 'Play Music 🎵';
    }
  }
}

function startHarmonicWebAudioSynthesizer() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    isWebAudioPlaying = true;

    const notes = [
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 1.1 },
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.1 },
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 523.25, d: 0.6 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 0.6 }, { f: 293.66, d: 0.9 },
      { f: 466.16, d: 0.35 }, { f: 466.16, d: 0.25 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.2 }
    ];

    let noteIdx = 0;
    function playNextNote() {
      if (!isWebAudioPlaying || !audioCtx) return;
      const note = notes[noteIdx];
      playChime(note.f, note.d);
      noteIdx = (noteIdx + 1) % notes.length;
      synthTimer = setTimeout(playNextNote, (note.d + 0.15) * 1000);
    }

    playNextNote();
  } catch (e) {
    console.warn('Web Audio synthesis not supported:', e);
  }
}

function playChime(freq, duration) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.4);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.5);
}

function stopHarmonicWebAudioSynthesizer() {
  isWebAudioPlaying = false;
  if (synthTimer) clearTimeout(synthTimer);
}

/* ============================================================================
   4. High-Performance Canvas Confetti Engine
   ============================================================================ */
let confettiParticles = [];
let confettiCtx = null;
let confettiAnimationId = null;

function initConfettiEngine() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  confettiCtx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const celebrationBtn = document.getElementById('btn-celebrate-confetti');
  if (celebrationBtn) {
    celebrationBtn.addEventListener('click', () => {
      const rect = celebrationBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      launchConfettiBurst(80, x, y);
    });
  }
}

function launchConfettiBurst(count = 60, originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
  const colors = [
    '#ffd700', '#d4af37', '#fff1b8', // Gold
    '#ff9933', '#ffffff', '#138808', // Indian Tricolour
    '#9333ea', '#3b82f6', '#ef4444'  // Royal accents
  ];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 6;

    confettiParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      tilt: Math.random() * 10,
      tiltSpeed: Math.random() * 0.1 + 0.05,
      gravity: 0.35,
      drag: 0.96,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    });
  }

  if (!confettiAnimationId) {
    runConfettiLoop();
  }
}

function runConfettiLoop() {
  if (!confettiCtx) return;

  confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.tilt += p.tiltSpeed;
    p.opacity -= 0.006;

    if (p.opacity <= 0 || p.y > window.innerHeight + 50) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = Math.max(0, p.opacity);
    confettiCtx.fillStyle = p.color;

    if (p.shape === 'rect') {
      confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
      confettiCtx.fill();
    }

    confettiCtx.restore();
  }

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(runConfettiLoop);
  } else {
    confettiAnimationId = null;
    confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

/* ============================================================================
   5. Grand Fireworks Canvas Engine
   ============================================================================ */
let fireworksParticles = [];
let fireworksCtx = null;
let fireworksLoopRunning = false;

function initFireworksEngine() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  fireworksCtx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const launchBtn = document.getElementById('btn-launch-fireworks');
  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      launchGrandFireworksVolley();
    });
  }

  const finaleSection = document.getElementById('finale-section');
  if (finaleSection && 'IntersectionObserver' in window) {
    let fired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !fired) {
            fired = true;
            launchGrandFireworksVolley();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(finaleSection);
  }
}

function launchGrandFireworksVolley() {
  const colors = [
    ['#ffd700', '#f6d365', '#fff1b8'], // Gold
    ['#ff9933', '#ffffff', '#138808'], // Tricolour
    ['#ff4b4b', '#f43f5e', '#fda4af'], // Ruby & Rose
    ['#38bdf8', '#818cf8', '#c084fc']  // Cyan & Violet
  ];

  let bursts = 0;
  const interval = setInterval(() => {
    const x = Math.random() * (window.innerWidth * 0.7) + window.innerWidth * 0.15;
    const y = Math.random() * (window.innerHeight * 0.45) + window.innerHeight * 0.15;
    const pal = colors[bursts % colors.length];
    createFireworkExplosion(x, y, pal);
    bursts++;
    if (bursts >= 9) {
      clearInterval(interval);
    }
  }, 450);
}

function createFireworkExplosion(x, y, palette) {
  const particleCount = 65;
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = Math.random() * 6 + 2.5;
    fireworksParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.012,
      gravity: 0.08,
      size: Math.random() * 2.5 + 1.5
    });
  }

  if (!fireworksLoopRunning) {
    fireworksLoopRunning = true;
    runFireworksLoop();
  }
}

function runFireworksLoop() {
  if (!fireworksCtx) return;

  fireworksCtx.globalCompositeOperation = 'destination-out';
  fireworksCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  fireworksCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  fireworksCtx.globalCompositeOperation = 'lighter';

  for (let i = fireworksParticles.length - 1; i >= 0; i--) {
    const p = fireworksParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      fireworksParticles.splice(i, 1);
      continue;
    }

    fireworksCtx.beginPath();
    fireworksCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fireworksCtx.fillStyle = p.color;
    fireworksCtx.globalAlpha = p.alpha;
    fireworksCtx.shadowBlur = 8;
    fireworksCtx.shadowColor = p.color;
    fireworksCtx.fill();
  }

  fireworksCtx.shadowBlur = 0;
  fireworksCtx.globalAlpha = 1;

  if (fireworksParticles.length > 0) {
    requestAnimationFrame(runFireworksLoop);
  } else {
    fireworksLoopRunning = false;
    fireworksCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

/* ============================================================================
   6. Interactive 3D Gift Box
   ============================================================================ */
function initGiftBox() {
  const giftContainer = document.getElementById('interactive-gift-container');
  const revealContent = document.getElementById('gift-reveal-content');
  const hintText = document.getElementById('gift-box-hint');

  if (!giftContainer || !revealContent) return;

  let isOpened = false;

  giftContainer.addEventListener('click', () => {
    if (!isOpened) {
      isOpened = true;
      giftContainer.classList.add('opened');
      revealContent.classList.add('revealed');

      if (hintText) {
        hintText.textContent = '✨ Surprise Unboxed with Love! ✨';
      }

      const rect = giftContainer.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      launchConfettiBurst(55, x, y);
    } else {
      isOpened = false;
      giftContainer.classList.remove('opened');
      revealContent.classList.remove('revealed');
      if (hintText) {
        hintText.textContent = 'Tap to Unbox Your Special Gift 🎁';
      }
    }
  });
}

/* ============================================================================
   7. Random Heartfelt Blessing & Motivation Generator
   ============================================================================ */
const blessingsCollection = [
  "“Yash, may your discipline turn into your greatest weapon, and may you clear the NDA exam with flying colours!” 🦁🇮🇳",
  "“Grow taller in wisdom, deeper in character, and more powerful in spirit with each passing sunrise!” ⚡👑",
  "“May God grant you supreme physical strength, an unshakeable mind, and the courage to conquer every obstacle.” 🛡️",
  "“Wear that uniform with immense pride soon, Yash! Khadakwasla is waiting for an officer like you.” 🇮🇳🎖️",
  "“Whenever you doubt yourself, remember who you are: a warrior born for greatness. We believe in you!” ✨",
  "“May your 16th year be the breakthrough year that propels you straight into your grandest dreams!” 🚀",
  "“Discipline is the bridge between goals and accomplishment. Keep training, keep pushing, mere bhai!” ⚔️",
  "“No examination can measure your worth, but your dedication will inspire everyone around you.” 🤍",
  "“May every step you take bring you closer to commanding respect and serving our motherland with honor.” 🇮🇳",
  "“Brother, in our hearts, you are already a true champion. Keep growing, keep shining!” ❤️"
];

let lastBlessingIdx = -1;

function initBlessingGenerator() {
  const triggerBtn = document.getElementById('btn-get-blessing');
  const displayTarget = document.getElementById('blessing-text-target');

  if (!triggerBtn || !displayTarget) return;

  triggerBtn.addEventListener('click', () => {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * blessingsCollection.length);
    } while (nextIdx === lastBlessingIdx && blessingsCollection.length > 1);

    lastBlessingIdx = nextIdx;

    displayTarget.style.opacity = '0';
    displayTarget.style.transform = 'translateY(10px)';

    setTimeout(() => {
      displayTarget.textContent = blessingsCollection[nextIdx];
      displayTarget.style.opacity = '1';
      displayTarget.style.transform = 'translateY(0)';
    }, 250);

    const rect = triggerBtn.getBoundingClientRect();
    launchConfettiBurst(15, rect.left + rect.width / 2, rect.top);
  });
}

/* ============================================================================
   8. Floating Hearts Spawner
   ============================================================================ */
function initHeartSpawners() {
  const heartBtn = document.getElementById('btn-send-heart');
  if (!heartBtn) return;

  heartBtn.addEventListener('click', () => {
    const emojis = ['❤️', '💖', '✨', '🇮🇳', '⭐', '🌟', '🎖️', '🔥'];
    const rect = heartBtn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top;

    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart-particle';
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const offsetX = (Math.random() - 0.5) * 80;
        heart.style.left = `${originX + offsetX}px`;
        heart.style.top = `${originY}px`;
        heart.style.fontSize = `${Math.random() * 1.4 + 1.2}rem`;

        document.body.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 3000);
      }, i * 110);
    }
  });
}

/* ============================================================================
   9. Letter Utilities (Speech & Copy)
   ============================================================================ */
function initLetterFeatures() {
  const btnReadAloud = document.getElementById('btn-read-letter');
  const btnCopyLetter = document.getElementById('btn-copy-letter');
  const letterBody = document.querySelector('.letter-body');

  if (btnReadAloud && 'speechSynthesis' in window && letterBody) {
    let isSpeaking = false;

    btnReadAloud.addEventListener('click', () => {
      if (!isSpeaking) {
        window.speechSynthesis.cancel();
        const text = letterBody.innerText;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          isSpeaking = false;
          btnReadAloud.innerHTML = '<span>🔊</span> Listen to Letter';
        };

        window.speechSynthesis.speak(utterance);
        isSpeaking = true;
        btnReadAloud.innerHTML = '<span>⏸️</span> Stop Reading';
      } else {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        btnReadAloud.innerHTML = '<span>🔊</span> Listen to Letter';
      }
    });
  }

  if (btnCopyLetter && letterBody) {
    btnCopyLetter.addEventListener('click', () => {
      const text = letterBody.innerText;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          const originalHTML = btnCopyLetter.innerHTML;
          btnCopyLetter.innerHTML = '<span>✅</span> Wish Copied!';
          setTimeout(() => {
            btnCopyLetter.innerHTML = originalHTML;
          }, 2500);
        })
        .catch(() => {
          alert('Wish highlighted! You can copy with Ctrl+C.');
        });
    });
  }
}

/* ============================================================================
   10. Complete 17-Photo Gallery & Fullscreen Lightbox Modal Engine
   ============================================================================ */
const photoGalleryData = [
  { src: 'assets/photos/yash-photo-1.jpeg', title: 'The Fearless Spirit', caption: 'Standing proud, ready to conquer any challenge life presents.' },
  { src: 'assets/photos/yash-photo-2.jpeg', title: 'Radiant Smile', caption: 'That genuine brotherly smile that brightens every single day.' },
  { src: 'assets/photos/yash-photo-3.jpeg', title: 'Our Pride & Joy', caption: 'Yash Raj Bhaskar — the heart and pride of our family.' },
  { src: 'assets/photos/yash-photo-4.jpeg', title: 'Growing Stronger', caption: 'Every day adding strength, discipline, and maturity to your character.' },
  { src: 'assets/photos/yash-photo-5.jpeg', title: 'Eyes on the Goal', caption: 'Laser-focused dedication towards the National Defence Academy dream.' },
  { src: 'assets/photos/yash-photo-6.jpeg', title: 'Unbreakable Bond', caption: 'Brothers forever — walking through life hand in hand.' },
  { src: 'assets/photos/yash-photo-7.jpeg', title: 'The Handsome Champ', caption: 'Carrying himself with quiet confidence and natural charisma.' },
  { src: 'assets/photos/yash-photo-8.jpeg', title: 'Disciplined Warrior', caption: 'Putting in the quiet work when nobody is watching.' },
  { src: 'assets/photos/yash-photo-9.jpeg', title: 'Humble & Grounded', caption: 'Big dreams, powerful spirit, yet a pure and gentle heart.' },
  { src: 'assets/photos/yash-photo-10.jpeg', title: 'Chasing Horizons', caption: 'A boundless future ahead filled with triumphs and victories.' },
  { src: 'assets/photos/yash-photo-11.jpeg', title: 'Power & Fortitude', caption: 'Growing more powerful in mind, body, and determination.' },
  { src: 'assets/photos/yash-photo-12.jpeg', title: 'Precious Moments', caption: 'Memories etched in gold that will last a lifetime.' },
  { src: 'assets/photos/yash-photo-13.jpeg', title: 'Resilience in Motion', caption: 'Never backing down, always rising above every hurdle.' },
  { src: 'assets/photos/yash-photo-14.jpeg', title: 'Our Future Officer', caption: 'Marching with dignity, honor, and patriotic fire in the soul.' },
  { src: 'assets/photos/yash-photo-15.jpeg', title: '16 Years of Sunshine', caption: 'Bringing unconditional happiness to everyone around you.' },
  { src: 'assets/photos/yash-photo-16.jpeg', title: 'The Winning Team', caption: 'Together through thick and thin, no matter where life leads.' },
  { src: 'assets/photos/yash-photo-17.jpeg', title: 'Yash Raj Bhaskar', caption: 'Happy 16th Birthday to the greatest brother in the world! ❤️' },
  { src: 'assets/photos/papa_pic.jpeg', title: "Papa's Guiding Light", caption: "The pillar of strength, love, and unwavering faith behind Yash's journey. ❤️" }
];

let currentLightboxIndex = 0;

function initPhotoGalleryAndLightbox() {
  const galleryGrid = document.getElementById('photo-gallery-grid');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-caption-title');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  // Render all 17 photos dynamically into the gallery grid
  if (galleryGrid) {
    galleryGrid.innerHTML = '';
    photoGalleryData.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'gallery-item';
      itemEl.setAttribute('data-index', index);

      itemEl.innerHTML = `
        <div class="gallery-thumb-wrap">
          <span class="gallery-overlay-badge">#${index + 1}</span>
          <span class="gallery-zoom-icon">🔍</span>
          <img src="${item.src}" alt="${item.title}" class="gallery-thumb" loading="lazy" />
        </div>
        <div class="gallery-info">
          <div class="gallery-caption">${item.title}</div>
          <div class="gallery-subcaption">${item.caption}</div>
        </div>
      `;

      itemEl.addEventListener('click', () => {
        openLightbox(index);
      });

      galleryGrid.appendChild(itemEl);
    });
  }

  // Also bind hero spotlight photo to open in lightbox
  const heroPhotoFrame = document.getElementById('hero-photo-frame');
  if (heroPhotoFrame) {
    heroPhotoFrame.addEventListener('click', () => {
      openLightbox(2); // Photo 3 is the hero photo
    });
  }

  // Lightbox functions
  function openLightbox(index) {
    if (!lightboxModal) return;
    currentLightboxIndex = (index + photoGalleryData.length) % photoGalleryData.length;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = photoGalleryData[currentLightboxIndex];
    if (!item) return;

    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
    }
    if (lightboxTitle) {
      lightboxTitle.textContent = `${item.title} — ${item.caption}`;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `Memory ${currentLightboxIndex + 1} of ${photoGalleryData.length}`;
    }
  }

  function showNextPhoto() {
    currentLightboxIndex = (currentLightboxIndex + 1) % photoGalleryData.length;
    updateLightboxContent();
  }

  function showPrevPhoto() {
    currentLightboxIndex = (currentLightboxIndex - 1 + photoGalleryData.length) % photoGalleryData.length;
    updateLightboxContent();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNextPhoto);
  if (prevBtn) prevBtn.addEventListener('click', showPrevPhoto);

  // Click outside image to close
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content-box')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  // Touch swipe support for mobile & tablet devices
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleLightboxSwipe();
    }, { passive: true });
  }

  function handleLightboxSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    // Horizontal swipe threshold
    if (absDiffX > 45 && absDiffX > absDiffY) {
      if (diffX < 0) {
        showNextPhoto(); // Swiped left -> next photo
      } else {
        showPrevPhoto(); // Swiped right -> prev photo
      }
    } 
    // Swipe down to dismiss
    else if (diffY > 70 && absDiffY > absDiffX) {
      closeLightbox(); // Swiped down -> close lightbox
    }
  }
}

/* ============================================================================
   11. IntersectionObserver Scroll Animations
   ============================================================================ */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const cards = document.querySelectorAll(
    '.blessing-card, .metric-card, .letter-paragraph, .nda-value-card, .nda-unconditional-pledge, .gallery-item, .nda-photo-card'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  cards.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

