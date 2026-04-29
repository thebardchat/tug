 JS
Copy

/* ─────────────────────────────────────────────
   TUG · cislunar transit stage
   app.js · rev 0.1
   vanilla JS · no dependencies
   ───────────────────────────────────────────── */
 
(() => {
  'use strict';
 
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  /* ─────────────────────────────────────────────
     HERO STARFIELD
     ───────────────────────────────────────────── */
  function initStars() {
    const c = document.getElementById('hero-stars');
    if (!c) return;
    const ctx = c.getContext('2d');
    let stars = [];
    let raf = 0;
 
    function build() {
      const dpr = window.devicePixelRatio || 1;
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((c.clientWidth * c.clientHeight) / 4500);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * c.clientWidth,
        y: Math.random() * c.clientHeight,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * 0.6 + 0.2,
        s: (Math.random() - 0.5) * 0.03,
        ph: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.0018 + 0.0006
      }));
    }
 
    function drawOnce() {
      ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
      stars.forEach(s => {
        ctx.fillStyle = `rgba(232, 238, 247, ${s.a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
 
    function loop(t) {
      ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
      stars.forEach(s => {
        const tw = s.a + Math.sin(t * s.sp + s.ph) * 0.18;
        ctx.fillStyle = `rgba(232, 238, 247, ${Math.max(0.05, tw)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        s.x += s.s;
        if (s.x < 0) s.x = c.clientWidth;
        if (s.x > c.clientWidth) s.x = 0;
      });
      raf = requestAnimationFrame(loop);
    }
 
    build();
    window.addEventListener('resize', () => {
      build();
      if (reducedMotion) drawOnce();
    });
    if (reducedMotion) drawOnce();
    else raf = requestAnimationFrame(loop);
  }
 
  /* ─────────────────────────────────────────────
     STAGE SVG ART
     ───────────────────────────────────────────── */
  function injectStageArt() {
    const art = {
      'art-rail': `
        <svg viewBox="0 0 120 80">
          <defs>
            <linearGradient id="rail-grad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stop-color="#5cf2c0" stop-opacity="0.2"/>
              <stop offset="1" stop-color="#5cf2c0"/>
            </linearGradient>
          </defs>
          <line x1="6" y1="64" x2="114" y2="22" stroke="url(#rail-grad)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="6" y1="68" x2="114" y2="26" stroke="#2a4060" stroke-width="2" stroke-linecap="round"/>
          <line x1="6" y1="64" x2="6" y2="74" stroke="#2a4060" stroke-width="2"/>
          <line x1="38" y1="52" x2="38" y2="71" stroke="#2a4060" stroke-width="1.5"/>
          <line x1="74" y1="38" x2="74" y2="68" stroke="#2a4060" stroke-width="1.5"/>
          <line x1="114" y1="22" x2="114" y2="34" stroke="#2a4060" stroke-width="2"/>
          <g transform="translate(58, 42) rotate(-21)">
            <rect x="-12" y="-5" width="22" height="10" rx="2" fill="#ffb84d"/>
            <polygon points="10,-5 18,0 10,5" fill="#ffb84d"/>
            <rect x="-12" y="-5" width="22" height="10" rx="2" fill="none" stroke="#cf8a1a" stroke-width="0.5"/>
          </g>
          <g opacity="0.6">
            <circle cx="78" cy="50" r="0.8" fill="#ffb84d"/>
            <circle cx="68" cy="55" r="0.6" fill="#ffb84d"/>
            <circle cx="58" cy="60" r="0.5" fill="#ffb84d"/>
          </g>
        </svg>`,
 
      'art-pod': `
        <svg viewBox="0 0 120 80">
          <ellipse cx="60" cy="72" rx="30" ry="2" fill="#5cf2c0" opacity="0.15"/>
          <g>
            <polygon points="60,12 44,52 76,52" fill="#ffb84d"/>
            <polygon points="60,12 44,52 60,42" fill="#cf8a1a" opacity="0.5"/>
            <rect x="44" y="52" width="32" height="14" fill="#e09c3a"/>
            <rect x="44" y="52" width="32" height="3" fill="#cf8a1a"/>
            <polygon points="44,66 38,74 82,74 76,66" fill="#a36a16"/>
            <line x1="50" y1="22" x2="50" y2="50" stroke="#050a14" stroke-width="0.5" opacity="0.5"/>
            <line x1="60" y1="14" x2="60" y2="50" stroke="#050a14" stroke-width="0.5" opacity="0.5"/>
            <line x1="70" y1="22" x2="70" y2="50" stroke="#050a14" stroke-width="0.5" opacity="0.5"/>
            <rect x="55" y="58" width="10" height="2" fill="#050a14" opacity="0.5"/>
            <text x="60" y="63" font-family="JetBrains Mono, monospace" font-size="3" fill="#050a14" text-anchor="middle" opacity="0.7">MANNA</text>
          </g>
        </svg>`,
 
      'art-tug': `
        <svg viewBox="0 0 120 80">
          <g>
            <rect x="36" y="32" width="48" height="20" rx="3" fill="#5cf2c0"/>
            <rect x="36" y="32" width="48" height="3" fill="#38c898"/>
            <rect x="36" y="32" width="48" height="20" rx="3" fill="none" stroke="#2a8a6a" stroke-width="0.6"/>
            <rect x="84" y="36" width="10" height="12" fill="#38c898"/>
            <polygon points="94,36 100,42 94,48" fill="#2a8a6a"/>
            <g opacity="0.85">
              <rect x="6" y="36" width="28" height="3" fill="#2a4060"/>
              <rect x="6" y="40" width="28" height="3" fill="#2a4060"/>
              <rect x="6" y="44" width="28" height="3" fill="#2a4060"/>
              <line x1="6" y1="36" x2="6" y2="48" stroke="#5cf2c0" stroke-width="1"/>
              <line x1="34" y1="36" x2="34" y2="48" stroke="#5cf2c0" stroke-width="1"/>
            </g>
            <line x1="36" y1="42" x2="34" y2="42" stroke="#5cf2c0" stroke-width="1"/>
            <circle cx="60" cy="42" r="3.5" fill="#050a14"/>
            <circle cx="60" cy="42" r="1.5" fill="#5cf2c0"/>
            <circle cx="48" cy="42" r="2" fill="#050a14" opacity="0.7"/>
            <circle cx="72" cy="42" r="2" fill="#050a14" opacity="0.7"/>
            <line x1="36" y1="36" x2="22" y2="20" stroke="#5cf2c0" stroke-width="1.5"/>
            <line x1="36" y1="48" x2="22" y2="64" stroke="#5cf2c0" stroke-width="1.5"/>
            <rect x="14" y="14" width="14" height="3" fill="#ffb84d" rx="0.5"/>
            <rect x="14" y="62" width="14" height="3" fill="#ffb84d" rx="0.5"/>
          </g>
        </svg>`,
 
      'art-moon': `
        <svg viewBox="0 0 120 80">
          <defs>
            <radialGradient id="moon-grad" cx="0.35" cy="0.35">
              <stop offset="0" stop-color="#dcd6c8"/>
              <stop offset="0.7" stop-color="#8d8576"/>
              <stop offset="1" stop-color="#3a342b"/>
            </radialGradient>
          </defs>
          <circle cx="60" cy="40" r="28" fill="url(#moon-grad)"/>
          <circle cx="48" cy="32" r="3.5" fill="#3a342b" opacity="0.5"/>
          <circle cx="68" cy="46" r="2.8" fill="#3a342b" opacity="0.5"/>
          <circle cx="60" cy="54" r="1.8" fill="#3a342b" opacity="0.45"/>
          <circle cx="70" cy="30" r="1.6" fill="#3a342b" opacity="0.45"/>
          <circle cx="52" cy="44" r="1.2" fill="#3a342b" opacity="0.4"/>
          <path d="M 32 40 A 28 28 0 0 1 60 12" fill="none" stroke="#5cf2c0" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.7"/>
          <circle cx="60" cy="12" r="2" fill="#ffb84d"/>
        </svg>`
    };
    Object.entries(art).forEach(([id, svg]) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = svg;
    });
  }
 
  /* ─────────────────────────────────────────────
     CARGO CHAIN — sequential highlight
     ───────────────────────────────────────────── */
  function initChain() {
    const stages = document.querySelectorAll('.chain-stage');
    const arrows = document.querySelectorAll('.chain-arrow');
    if (!stages.length || reducedMotion) return;
 
    const order = [
      { s: [0], a: [] },
      { s: [0], a: [0] },
      { s: [1], a: [] },
      { s: [1], a: [1] },
      { s: [2], a: [] },
      { s: [2], a: [2] },
      { s: [3], a: [] }
    ];
    let idx = 0;
 
    setInterval(() => {
      stages.forEach(el => el.classList.remove('active'));
      arrows.forEach(el => el.classList.remove('active'));
      const step = order[idx % order.length];
      step.s.forEach(i => stages[i] && stages[i].classList.add('active'));
      step.a.forEach(i => arrows[i] && arrows[i].classList.add('active'));
      idx++;
    }, 1200);
  }
 
  /* ─────────────────────────────────────────────
     MISSION PROFILE — Earth, ascent, Tug orbit, TLI, Moon
     ───────────────────────────────────────────── */
  function initProfile() {
    const canvas = document.getElementById('profile-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const phaseEl = document.getElementById('profile-phase');
    const metEl   = document.getElementById('profile-met');
    const altEl   = document.getElementById('profile-alt');
    const playBtn = document.getElementById('profile-play');
 
    const earthCx = 360;
    const earthCy = 760;
    const earthR  = 360;
    const apogee  = { x: earthCx + 540, y: earthCy - earthR - 80 };
    const moon    = { x: 1200, y: 110, r: 30 };
 
    let t = 0;
    let raf = 0;
    let bgStars = [];
 
    // Build background stars once
    for (let i = 0; i < 140; i++) {
      bgStars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.7,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.6 + 0.2
      });
    }
 
    const phases = [
      { name: 'Pre-launch hold',    code: 'HOLD',   start: 0.00, end: 0.04 },
      { name: 'Rail boost',         code: 'BOOST',  start: 0.04, end: 0.18 },
      { name: 'Ballistic ascent',   code: 'ASCENT', start: 0.18, end: 0.42 },
      { name: 'Tug phasing',        code: 'PHASE',  start: 0.42, end: 0.62 },
      { name: 'Apogee rendezvous',  code: 'RDV',    start: 0.62, end: 0.78 },
      { name: 'TLI burn',           code: 'TLI',    start: 0.78, end: 0.86 },
      { name: 'Lunar transfer',     code: 'XFER',   start: 0.86, end: 1.00 }
    ];
 
    function currentPhase(p) {
      return phases.find(ph => p >= ph.start && p <= ph.end) || phases[phases.length - 1];
    }
 
    function podPos(p) {
      // ballistic arc from rail tip to apogee
      const sx = 80,  sy = earthCy - earthR + 4;
      const ex = apogee.x, ey = apogee.y;
      const cx = (sx + ex) / 2 + 30;
      const cy = ey - 140;
      const u = p;
      const x = (1-u)*(1-u)*sx + 2*(1-u)*u*cx + u*u*ex;
      const y = (1-u)*(1-u)*sy + 2*(1-u)*u*cy + u*u*ey;
      return { x, y };
    }
 
    function tugOrbitPoint(theta) {
      const a = 540, b = 110;
      const cx = earthCx;
      const cy = earthCy - earthR - 40;
      return { x: cx + a * Math.cos(theta), y: cy - b * Math.sin(theta) };
    }
 
    function tliPoint(u) {
      const sx = apogee.x, sy = apogee.y;
      const ex = moon.x,   ey = moon.y;
      const cx = (sx + ex) / 2 - 20;
      const cy = sy - 240;
      const x = (1-u)*(1-u)*sx + 2*(1-u)*u*cx + u*u*ex;
      const y = (1-u)*(1-u)*sy + 2*(1-u)*u*cy + u*u*ey;
      return { x, y };
    }
 
    function drawBackground() {
      ctx.fillStyle = '#02060d';
      ctx.fillRect(0, 0, W, H);
      // grid
      ctx.strokeStyle = 'rgba(31, 48, 80, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 80) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = 0; y <= H; y += 80) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();
      // stars
      bgStars.forEach(s => {
        ctx.fillStyle = `rgba(232, 238, 247, ${s.a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
 
    function drawEarth() {
      // glow
      const glow = ctx.createRadialGradient(earthCx, earthCy, earthR, earthCx, earthCy, earthR + 50);
      glow.addColorStop(0, 'rgba(42, 126, 218, 0.35)');
      glow.addColorStop(1, 'rgba(42, 126, 218, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(earthCx, earthCy, earthR + 50, 0, Math.PI * 2);
      ctx.fill();
 
      // body
      const body = ctx.createRadialGradient(
        earthCx - 130, earthCy - 130, 60,
        earthCx, earthCy, earthR
      );
      body.addColorStop(0, '#2a7eda');
      body.addColorStop(0.6, '#0d2440');
      body.addColorStop(1, '#02060d');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(earthCx, earthCy, earthR, 0, Math.PI * 2);
      ctx.fill();
 
      // rim
      ctx.strokeStyle = 'rgba(92, 242, 192, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(earthCx, earthCy, earthR + 6, 0, Math.PI * 2);
      ctx.stroke();
    }
 
    function drawRail() {
      ctx.strokeStyle = '#5cf2c0';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(40, earthCy - earthR + 30);
      ctx.lineTo(120, earthCy - earthR);
      ctx.stroke();
      ctx.fillStyle = '#5cf2c0';
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillText('rail', 30, earthCy - earthR + 50);
    }
 
    function drawTugOrbit() {
      ctx.strokeStyle = 'rgba(92, 242, 192, 0.5)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let theta = 0; theta <= Math.PI; theta += 0.02) {
        const p = tugOrbitPoint(theta);
        if (theta === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
 
    function drawPodTrail(progress) {
      ctx.strokeStyle = '#ffb84d';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = 'rgba(255, 184, 77, 0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let u = 0; u <= progress; u += 0.01) {
        const p = podPos(u);
        if (u === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
 
    function drawTLITrail(progress) {
      ctx.strokeStyle = '#5cf2c0';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = 'rgba(92, 242, 192, 0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let u = 0; u <= progress; u += 0.02) {
        const p = tliPoint(u);
        if (u === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
 
    function drawMoon() {
      const grad = ctx.createRadialGradient(moon.x - 8, moon.y - 8, 4, moon.x, moon.y, moon.r);
      grad.addColorStop(0, '#dcd6c8');
      grad.addColorStop(1, '#5b5448');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(moon.x, moon.y, moon.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3a342b';
      ctx.globalAlpha = 0.5;
      [[-8,-4,3.5],[7,5,2.5],[2,-9,2],[-3,8,1.5]].forEach(([dx,dy,r]) => {
        ctx.beginPath();
        ctx.arc(moon.x + dx, moon.y + dy, r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
 
      ctx.fillStyle = '#7a8fa8';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText('moon', moon.x - 14, moon.y + 50);
    }
 
    function drawDot(x, y, r, color) {
      // glow
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 4, 0, Math.PI * 2);
      ctx.fill();
      // core
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
 
    function drawLabel(text, x, y, color) {
      ctx.fillStyle = color;
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillText(text, x, y);
    }
 
    function drawApogeeMarker() {
      ctx.strokeStyle = 'rgba(232, 238, 247, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(apogee.x, apogee.y, 42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      // crosshair
      ctx.strokeStyle = 'rgba(232, 238, 247, 0.4)';
      ctx.beginPath();
      ctx.moveTo(apogee.x - 54, apogee.y); ctx.lineTo(apogee.x - 30, apogee.y);
      ctx.moveTo(apogee.x + 30, apogee.y); ctx.lineTo(apogee.x + 54, apogee.y);
      ctx.moveTo(apogee.x, apogee.y - 54); ctx.lineTo(apogee.x, apogee.y - 30);
      ctx.moveTo(apogee.x, apogee.y + 30); ctx.lineTo(apogee.x, apogee.y + 54);
      ctx.stroke();
      drawLabel('apogee · 150 km', apogee.x + 56, apogee.y - 48, '#e8eef7');
    }
 
    function frame() {
      drawBackground();
      drawEarth();
      drawRail();
      drawTugOrbit();
      drawMoon();
 
      const ph = currentPhase(t);
 
      // pod ascent — runs through rail boost + ballistic ascent
      const podProg = Math.min(1, Math.max(0, (t - 0.04) / 0.38));
      if (t >= 0.04) drawPodTrail(podProg);
      const pp = podPos(podProg);
 
      // tug: phasing in from left side, settles at apogee
      let tugTheta;
      if (t < 0.42) {
        tugTheta = Math.PI - (t / 0.42) * (Math.PI * 0.4);
      } else if (t < 0.62) {
        const u = (t - 0.42) / 0.2;
        tugTheta = Math.PI * 0.6 - u * (Math.PI * 0.1);
      } else {
        tugTheta = Math.PI / 2;
      }
      const tugP = tugOrbitPoint(tugTheta);
 
      // apogee marker during rendezvous and TLI
      if (t >= 0.55 && t <= 0.86) {
        drawApogeeMarker();
      }
 
      // TLI trail
      if (t >= 0.78) {
        const u = Math.min(1, (t - 0.78) / 0.22);
        drawTLITrail(u);
      }
 
      // dots
      let podVisible = t < 0.78;
      let tugAtApogee = t >= 0.62 && t < 0.78;
      let stackAtApogee = t >= 0.62 && t < 0.86;
 
      if (podVisible) drawDot(pp.x, pp.y, 6, '#ffb84d');
 
      // tug position adjusted for TLI burn
      let tugPos = tugP;
      if (t >= 0.78) {
        const u = Math.min(1, (t - 0.78) / 0.22);
        tugPos = tliPoint(u);
        // engine flame trailing tug
        const back = tliPoint(Math.max(0, u - 0.04));
        ctx.strokeStyle = '#ffb84d';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ffb84d';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(back.x, back.y);
        ctx.lineTo(tugPos.x, tugPos.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      drawDot(tugPos.x, tugPos.y, 7, '#5cf2c0');
 
      // labels
      if (podVisible && t > 0.05) drawLabel('pod', pp.x + 12, pp.y - 8, '#ffb84d');
      drawLabel('tug', tugPos.x + 14, tugPos.y + 6, '#5cf2c0');
 
      // mission timer
      if (phaseEl) phaseEl.textContent = ph.name;
      if (metEl)   metEl.textContent   = formatMET(t);
      if (altEl) {
        const altKm = podVisible ? Math.round((1 - Math.abs(podProg - 0.5) * 2) * 150) : 150;
        altEl.textContent = podVisible ? `${altKm} km` : 'STOWED';
      }
 
      t += reducedMotion ? 0 : 0.0026;
      if (t > 1.05) t = 0;
      raf = requestAnimationFrame(frame);
    }
 
    function formatMET(p) {
      // map 0..1 → roughly 0:00 to 7:00 mm:ss for early phases, then jump units
      const seconds = Math.floor(p * 1800); // up to 30 min for visual
      const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
      const ss = (seconds % 60).toString().padStart(2, '0');
      return `T+00:${mm}:${ss}`;
    }
 
    function play() {
      t = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    }
 
    if (playBtn) playBtn.addEventListener('click', play);
 
    if (reducedMotion) {
      // single static frame at apogee rendezvous
      t = 0.7;
      frame();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }
  }
 
  /* ─────────────────────────────────────────────
     INCLINATION — two satellites tracing orbits
     ───────────────────────────────────────────── */
  function initInclination() {
    const eq  = document.getElementById('sat-equator');
    const inc = document.getElementById('sat-inclined');
    if (!eq || !inc) return;
 
    if (reducedMotion) return;
 
    let theta = 0;
    function step() {
      theta += 0.012;
      const a = 140, b = 14;
      const ex = a * Math.cos(theta);
      const ey = -b * Math.sin(theta);
      eq.setAttribute('cx', ex);
      eq.setAttribute('cy', ey);
 
      const ix0 = a * Math.cos(theta + Math.PI * 0.3);
      const iy0 = -b * Math.sin(theta + Math.PI * 0.3);
      const r = -35 * Math.PI / 180;
      const ix = ix0 * Math.cos(r) - iy0 * Math.sin(r);
      const iy = ix0 * Math.sin(r) + iy0 * Math.cos(r);
      inc.setAttribute('cx', ix);
      inc.setAttribute('cy', iy);
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
 
  /* ─────────────────────────────────────────────
     RENDEZVOUS step-through
     ───────────────────────────────────────────── */
  function initRendezvous() {
    const svg = document.getElementById('rendezvous-svg');
    if (!svg) return;
    const tugDot = document.getElementById('tug-dot');
    const podDot = document.getElementById('pod-dot');
    const tugOrbit = document.getElementById('tug-orbit');
    const podArc = document.getElementById('pod-arc');
    const apogeeMarker = document.getElementById('apogee-marker');
    const steps = document.querySelectorAll('.rendezvous-steps li');
    const playBtn = document.getElementById('rdv-play');
    const resetBtn = document.getElementById('rdv-reset');
 
    const earthCx = 200, earthCy = 500;
    const apogeeX = 700, apogeeY = 100;
    const railX = 90,   railY = 270;
 
    // Tug ellipse (apogee at top-right)
    const orbitCx = (earthCx + apogeeX) / 2;
    const orbitCy = (earthCy - 80 + apogeeY) / 2 + 60;
    const orbitRx = 320, orbitRy = 220;
 
    // Build ellipse path
    let orbitPath = '';
    for (let theta = 0; theta <= Math.PI * 2 + 0.05; theta += 0.05) {
      const x = orbitCx + orbitRx * Math.cos(theta);
      const y = orbitCy - orbitRy * Math.sin(theta);
      orbitPath += (theta === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    }
    tugOrbit.setAttribute('d', orbitPath);
 
    // Pod arc
    const podArcD = `M ${railX} ${railY} Q ${(railX + apogeeX) / 2 - 60} ${apogeeY - 120} ${apogeeX} ${apogeeY}`;
    podArc.setAttribute('d', podArcD);
 
    function tugAt(theta) {
      const x = orbitCx + orbitRx * Math.cos(theta);
      const y = orbitCy - orbitRy * Math.sin(theta);
      return { x, y };
    }
 
    function podAt(u) {
      const sx = railX, sy = railY;
      const cx = (railX + apogeeX) / 2 - 60;
      const cy = apogeeY - 120;
      const ex = apogeeX, ey = apogeeY;
      const x = (1-u)*(1-u)*sx + 2*(1-u)*u*cx + u*u*ex;
      const y = (1-u)*(1-u)*sy + 2*(1-u)*u*cy + u*u*ey;
      return { x, y };
    }
 
    let timeline = null;
 
    function reset() {
      if (timeline) {
        timeline.forEach(id => clearTimeout(id));
        timeline = null;
      }
      steps.forEach(s => s.classList.remove('active'));
      const t0 = tugAt(Math.PI);
      tugDot.setAttribute('cx', t0.x);
      tugDot.setAttribute('cy', t0.y);
      podDot.setAttribute('cx', railX);
      podDot.setAttribute('cy', railY);
      apogeeMarker.setAttribute('opacity', 0);
      apogeeMarker.setAttribute('transform', `translate(${apogeeX}, ${apogeeY})`);
    }
 
    function animate(from, to, duration, onUpdate, onDone) {
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        onUpdate(from + (to - from) * eased);
        if (t < 1) requestAnimationFrame(step);
        else if (onDone) onDone();
      }
      requestAnimationFrame(step);
    }
 
    function highlightStep(n) {
      steps.forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.step, 10) === n);
      });
    }
 
    function play() {
      reset();
      const ids = [];
 
      ids.push(setTimeout(() => {
        highlightStep(1);
        animate(Math.PI, Math.PI * 0.85, 1400, theta => {
          const p = tugAt(theta);
          tugDot.setAttribute('cx', p.x);
          tugDot.setAttribute('cy', p.y);
        });
      }, 100));
 
      ids.push(setTimeout(() => {
        highlightStep(2);
        animate(Math.PI * 0.85, Math.PI * 0.65, 1200, theta => {
          const p = tugAt(theta);
          tugDot.setAttribute('cx', p.x);
          tugDot.setAttribute('cy', p.y);
        });
      }, 1700));
 
      ids.push(setTimeout(() => {
        highlightStep(3);
        animate(Math.PI * 0.65, Math.PI / 2, 1500, theta => {
          const p = tugAt(theta);
          tugDot.setAttribute('cx', p.x);
          tugDot.setAttribute('cy', p.y);
        });
        animate(0, 1, 1500, u => {
          const p = podAt(u);
          podDot.setAttribute('cx', p.x);
          podDot.setAttribute('cy', p.y);
        });
        apogeeMarker.setAttribute('opacity', 1);
      }, 3000));
 
      ids.push(setTimeout(() => {
        highlightStep(4);
        animate(0, 1, 1200, u => {
          const dx = Math.sin(u * Math.PI * 4) * 8 * (1 - u);
          tugDot.setAttribute('cx', apogeeX - 30 + dx + u * 25);
          tugDot.setAttribute('cy', apogeeY + 4);
        });
      }, 4600));
 
      ids.push(setTimeout(() => {
        highlightStep(5);
        animate(0, 1, 1200, u => {
          tugDot.setAttribute('cx', apogeeX - 5 + u * 4);
          tugDot.setAttribute('cy', apogeeY + 4);
        });
      }, 5900));
 
      ids.push(setTimeout(() => {
        highlightStep(6);
        animate(0, 1, 1800, u => {
          const x = apogeeX + u * 250;
          const y = apogeeY - u * 80;
          tugDot.setAttribute('cx', x);
          tugDot.setAttribute('cy', y);
          podDot.setAttribute('cx', x);
          podDot.setAttribute('cy', y);
        });
      }, 7200));
 
      timeline = ids;
    }
 
    if (playBtn) playBtn.addEventListener('click', play);
    if (resetBtn) resetBtn.addEventListener('click', reset);
    reset();
  }
 
  /* ─────────────────────────────────────────────
     ΔV CHART — animate on intersect
     ───────────────────────────────────────────── */
  function initDVChart() {
    const root = document.getElementById('dv-chart');
    if (!root) return;
 
    const data = [
      { label: 'Launch (rail · not Tug propellant)', low: 9200,  high: 9500,  max: 11000, faded: true },
      { label: 'Phasing per catch',                  low: 10,    high: 100,   max: 11000 },
      { label: 'Apogee velocity match',              low: 5,     high: 50,    max: 11000 },
      { label: 'Orbit maintenance · per year',       low: 10,    high: 50,    max: 11000 },
      { label: 'TLI burn · per mission',             low: 900,   high: 1100,  max: 11000 },
      { label: 'Lunar orbit insertion',              low: 850,   high: 1000,  max: 11000 },
      { label: 'Reserve',                            low: 100,   high: 100,   max: 11000 },
      { label: 'Tug total · lifetime',               low: 8000,  high: 10000, max: 11000, total: true }
    ];
 
    const fmt = n => n.toLocaleString();
    data.forEach(d => {
      const range = d.low === d.high ? `${fmt(d.low)} m/s` : `${fmt(d.low)}–${fmt(d.high)} m/s`;
      const widthPct = (d.high / d.max) * 100;
      const row = document.createElement('div');
      row.className = 'dv-row' + (d.total ? ' dv-total' : '');
      row.innerHTML = `
        <div class="dv-label">${d.label}</div>
        <div class="dv-bar"><div class="dv-fill" data-end="${widthPct}" style="${d.faded ? 'opacity:0.4;' : ''}"></div></div>
        <div class="dv-value">${range}</div>
      `;
      root.appendChild(row);
    });
 
    const fills = root.querySelectorAll('.dv-fill');
    if (reducedMotion) {
      fills.forEach(f => { f.style.transition = 'none'; f.style.width = f.dataset.end + '%'; });
      return;
    }
 
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          fills.forEach((f, i) => {
            setTimeout(() => { f.style.width = f.dataset.end + '%'; }, i * 90);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    obs.observe(root);
  }
 
  /* ─────────────────────────────────────────────
     SMOOTH NAV
     ───────────────────────────────────────────── */
  function initNav() {
    document.querySelectorAll('.site-nav a[href^="#"], .brand[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' });
        }
      });
    });
  }
 
  /* ─────────────────────────────────────────────
     REVEAL ON SCROLL — disabled; content is always visible.
     If desired later, re-enable via initReveal() but ensure
     a fallback timer un-hides everything after 1s.
     ───────────────────────────────────────────── */
  function initReveal() {
    /* intentionally no-op */
  }
 
  /* ─────────────────────────────────────────────
     BOOT
     ───────────────────────────────────────────── */
  function boot() {
    injectStageArt();
    initStars();
    initChain();
    initProfile();
    initInclination();
    initRendezvous();
    initDVChart();
    initNav();
    initReveal();
  }
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
