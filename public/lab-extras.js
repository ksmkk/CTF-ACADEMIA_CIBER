(function () {
  const THEME_KEY = 'ctf_theme';
  const THEMES = ['ember', 'neo', 'ice'];

  function applyTheme(theme) {
    const root = document.documentElement;
    const safeTheme = THEMES.includes(theme) ? theme : 'ember';
    root.setAttribute('data-theme', safeTheme);
    localStorage.setItem(THEME_KEY, safeTheme);
  }

  function cycleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'ember';
    const index = THEMES.indexOf(current);
    const next = THEMES[(index + 1) % THEMES.length];
    applyTheme(next);

    const badge = document.querySelector('.theme-name');
    if (badge) {
      badge.textContent = next.toUpperCase();
    }
  }

  function createFloatingControls() {
    const wrap = document.createElement('div');
    wrap.className = 'floating-controls';
    wrap.innerHTML = [
      '<button id="themeToggle" class="floating-btn" type="button" title="Cambiar tema">',
      '<span>Tema</span>',
      '<strong class="theme-name">EMBER</strong>',
      '</button>'
    ].join('');

    document.body.appendChild(wrap);
    document.getElementById('themeToggle').addEventListener('click', cycleTheme);
  }

  function startMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: true });
    const chars = '01#@$%&/<>[]{}*+-ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 15;
    let columns = 0;
    let drops = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -40));
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + 'px Space Mono';

      for (let i = 0; i < drops.length; i += 1) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 216, 110, 0.35)' : 'rgba(255, 154, 60, 0.28)';
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 0.55;
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  function setupClickSound() {
    let audioCtx;

    function beep() {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.value = 220;
        gain.gain.value = 0.0001;

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        gain.gain.exponentialRampToValueAtTime(0.03, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        oscillator.start(now);
        oscillator.stop(now + 0.09);
      } catch (_error) {
        // En navegadores restrictivos, si falla audio no rompemos el flujo.
      }
    }

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const clickable = target.closest('button, .btn, a');
      if (!clickable) return;

      beep();
    });
  }

  function init() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'ember';
    applyTheme(savedTheme);
    createFloatingControls();

    const badge = document.querySelector('.theme-name');
    if (badge) {
      badge.textContent = savedTheme.toUpperCase();
    }

    startMatrixRain();
    setupClickSound();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
