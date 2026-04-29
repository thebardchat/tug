// Tug — GitHub Pages animations
// Vanilla JS · no dependencies

(() => {
  'use strict';

  // ─────────────────────────────────────────────
  //  Hero starfield
  // ─────────────────────────────────────────────
  function initStars() {
    const c = document.getElementById('hero-stars');
    if (!c) return;
    const ctx = c.getContext('2d');
    let stars = [];
    let raf;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((c.clientWidth * c.clientHeight) / 5000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * c.clientWidth,
        y: Math.random() * c.clientHeight,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * 0.7 + 0.2,
        s: (Math.random() - 0.5) * 0.04
      }));
    }

    function draw(t) {
      ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
      stars.forEach(s => {
        const tw = s.a + Math.sin(t * 0.001 + s.x) * 0.15;
        ctx.fillStyle = `rgba(216, 230, 245, ${Math.max(0.05, tw)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        s.x += s.s;
        if (s.x < 0) s.x = c.clientWidth;
        if (s.x > c.clientWidth) s.x = 0;
      });
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
  }

  // ─────────────────────────────────────────────
  //  Stage SVG art (hand-drawn)
  // ─────────────────────────────────────────────
  function injectStageArt() {
    const art = {
      'art-rail': `
        <svg viewBox="0 0 100 70">
          <line x1="6" y1="58" x2="94" y2="34" stroke="#5cf2c0" stroke-width="2"/>
          <line x1="6" y1="62" x2="94" y2="38" stroke="#3d9170" stroke-width="2"/>
          <g class="rail-pod">
            <rect x="-8" y="-4" width="14" height="8" rx="2" fill="#ffb84d"/>
            <polygon points="6,-4 12,0 6,4" fill="#ffb84d"/>
          </g>
          <line x1="6" y1="58" x2="6" y2="68" stroke="#3a5a7a" stroke-width="2"/>
          <line x1="94" y1="34" x2="94" y2="44" stroke="#3a5a7a" stroke-width="2"/>
        </svg>`,
      'art-pod': `
        <svg viewBox="0 0 100 70">
          <ellipse cx="50" cy="62" rx="28" ry="2" fill="#5cf2c0" opacity="0.2"/>
          <g class="pod-shape">
            <polygon points="50,12 36,46 64,46" fill="#ffb84d"/>
            <rect x="36" y="46" width="28" height="14" fill="#e09c3a"/>
            <polygon points="36,60 30,68 70,68 64,60" fill="#b97a25"/>
            <line x1="42" y1="22" x2="42" y2="44" stroke="#06121f" stroke-width="0.6" opacity="0.5"/>
            <line x1="50" y1="14" x2="50" y2="44" stroke="#06121f" stroke-width="0.6" opacity="0.5"/>
            <line x1="58" y1="22" x2="58" y2="44" stroke="#06121f" stroke-width="0.6" opacity="0.5"/>
          </g>
        </svg>`,
      'art-tug': `
        <svg viewBox="0 0 100 70">
          <g class="tug-shape">
            <rect x="32" y="28" width="36" height="16" rx="3" fill="#5cf2c0"/>
            <rect x="68" y="32" width="8" height="8" fill="#3d9170"/>
            <rect x="10" y="32" width="22" height="3" fill="#2a6b58"/>
            <rect x="10" y="37" width="22" height="3" fill="#2a6b58"/>
            <circle cx="50" cy="36" r="3" fill="#06121f"/>
            <line x1="32" y1="36" x2="20" y2="20" stroke="#5cf2c0" stroke-width="1.5"/>
            <line x1="32" y1="36" x2="20" y2="52" stroke="#5cf2c0" stroke-width="1.5"/>
            <circle cx="20" cy="20" r="2.5" fill="#ffb84d"/>
            <circle cx="20" cy="52" r="2.5" fill="#ffb84d"/>
          </g>
        </svg>`,
      'art-moon': `
        <svg viewBox="0 0 100 70">
          <defs>
            <radialGradient id="moon-grad" cx="35%" cy="35%">
              <stop offset="0%" stop-color="#dcd6c8"/>
              <stop offset="100%" stop-color="#5b5448"/>
            </radialGradient>
          </defs>
          <circle cx="50" cy="38" r="24" fill="url(#moon-grad)"/>
          <circle cx="42" cy="32" r="3" fill="#3a342b" opacity="0.5"/>
          <circle cx="56" cy="42" r="2.4" fill="#3a342b" opacity="0.5"/>
          <circle cx="50" cy="50" r="1.6" fill="#3a342b" opacity="0.4"/>
          <circle cx="58" cy="30" r="1.4" fill="#3a342b" opacity="0.4"/>
          <rect x="46" y="58" width="8" height="3" fill="#5cf2c0"/>
        </svg>`
    };
    Object.entries(art).forEach(([id, svg]) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = svg;
    });
  }

  // ─────────────────────────────────────────────
  //  Cargo chain — sequential highlight loop
  // ─────────────────────────────────────────────
  function initChain() {
    const stages = document.querySelectorAll('.chain-stage');
    const arrows = document.querySelectorAll('.chain-arrow');
    if (!stages.length) return;
    const order = [
      { stages: [0], arrows: [] },
      { stages: [0], arrows: [0] },
      { stages: [1], arrows: [] },
      { stages: [1], arrows: [1] },
      { stages: [2], arrows: [] },
      { stages: [2], arrows: [2] },
      { stages: [3], arrows: [] }
    ];
    let idx = 0;
    setInterval(() => {
      stages.forEach(s => s.classList.remove('active'));
      arrows.forEach(a => a.classList.remove('active'));
      const step = order[idx % order.length];
      step.stages.forEach(i => stages[i] && stages[i].classList.add('active'));
      step.arrows.forEach(i => arrows[i] && arrows[i].classList.add('active'));
      idx++;
    }, 1100);
  }

  // ─────────────────────────────────────────────
  //  Mission profile canvas — Earth, ascent arc, Tug orbit, TLI
  // ─────────────────────────────────────────────
  function initProfile() {
    const canvas = document.getElementById('profile-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const phaseEl = document.getElementById('profile-phase');
    const playBtn = document.getElementById('profile-play');

    const earthCx = 360;
    const earthCy = 720;
    const earthR = 320;
    const podApogeeAlt = 70;
    const tugApogee = { x: earthCx + 480, y: earthCy - earthR - podApogeeAlt };

    let t = 0;
    let raf;

    const phases = [
      { name: 'rail launch', start: 0, end: 0.18 },
      { name: 'ballistic ascent', start: 0.18, end: 0.42 },
      { name: 'tug phasing', start: 0.42, end: 0.62 },
      { name: 'apogee rendezvous', start: 0.62, end: 0.78 },
      { name: 'TLI burn', start: 0.78, end: 0.92 },
      { name: 'lunar transfer', start: 0.92, end: 1.0 }
    ];

    function currentPhase(p) {
      return phases.find(ph => p >= ph.start && p <= ph.end) || phases[phases.length - 1];
    }

    // pod ballistic trajectory points
    function podPos(p) {
      // p: 0..1 along ascent (rail to apogee)
      const startX = 70;
      const startY = earthCy - earthR + 8;
      const apogeeX = tugApogee.x;
      const apogeeY = tugApogee.y;
      const cx = (startX + apogeeX) / 2 - 20;
      const cy = apogeeY - 90;
      const u = p;
      const x = (1 - u) * (1 - u) * startX + 2 * (1 - u) * u * cx + u * u * apogeeX;
      const y = (1 - u) * (1 - u) * startY + 2 * (1 - u) * u * cy + u * u * apogeeY;
      return { x, y };
    }

    // tug elliptical orbit (top-half over Earth)
    function tugOrbitPoint(theta) {
      const a = 480;
      const b = 100;
      const cx = earthCx;
      const cy = earthCy - earthR - 40;
      return {
        x: cx + a * Math.cos(theta),
        y: cy - b * Math.sin(theta)
      };
    }

    function drawEarth() {
      const grad = ctx.createRadialGradient(
        earthCx - 100, earthCy - 100, 50,
        earthCx, earthCy, earthR
      );
      grad.addColorStop(0, '#2966a3');
      grad.addColorStop(0.7, '#0e2a48');
      grad.addColorStop(1, '#06121f');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(earthCx, earthCy, earthR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3b8bc4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(earthCx, earthCy, earthR + 4, 0, Math.PI * 2);
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function drawRail() {
      ctx.strokeStyle = '#5cf2c0';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(40, earthCy - earthR + 18);
      ctx.lineTo(110, earthCy - earthR);
      ctx.stroke();
      ctx.fillStyle = '#5cf2c0';
      ctx.font = '12px ui-monospace, monospace';
      ctx.fillText('BGKPJR rail', 30, earthCy - earthR + 38);
    }

    function drawTugOrbit() {
      ctx.strokeStyle = '#5cf2c0';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.4;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      for (let theta = 0; theta <= Math.PI; theta += 0.02) {
        const p = tugOrbitPoint(theta);
        if (theta === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    function drawPodTrail(progress) {
      ctx.strokeStyle = '#ffb84d';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      for (let u = 0; u <= progress; u += 0.01) {
        const p = podPos(u);
        if (u === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function drawTLITrail(progress) {
      // arc from apogee outward toward moon (top right)
      const moonX = 1140;
      const moonY = 110;
      ctx.strokeStyle = '#5cf2c0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const sx = tugApogee.x;
      const sy = tugApogee.y;
      const cx = (sx + moonX) / 2;
      const cy = sy - 200;
      ctx.moveTo(sx, sy);
      for (let u = 0; u <= progress; u += 0.02) {
        const x = (1 - u) * (1 - u) * sx + 2 * (1 - u) * u * cx + u * u * moonX;
        const y = (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * cy + u * u * moonY;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function drawMoon() {
      const moonX = 1140;
      const moonY = 110;
      const grad = ctx.createRadialGradient(moonX - 6, moonY - 6, 4, moonX, moonY, 28);
      grad.addColorStop(0, '#dcd6c8');
      grad.addColorStop(1, '#5b5448');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3a342b';
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.arc(moonX - 7, moonY - 4, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(moonX + 6, moonY + 4, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    function drawDot(x, y, r, color, glow = true) {
      if (glow) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
        g.addColorStop(0, color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawLabel(text, x, y, color) {
      ctx.fillStyle = color;
      ctx.font = '13px ui-monospace, monospace';
      ctx.fillText(text, x, y);
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      // bg stars
      ctx.fillStyle = '#06121f';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1d3858';
      for (let i = 0; i < 60; i++) {
        const sx = (i * 137) % W;
        const sy = (i * 89) % H;
        ctx.fillRect(sx, sy, 1, 1);
      }

      drawEarth();
      drawRail();
      drawTugOrbit();
      drawMoon();

      const ph = currentPhase(t);

      // Pod ascent
      const podProg = Math.min(1, t / 0.42);
      drawPodTrail(podProg);
      const pp = podPos(podProg);

      // Tug orbital progress — completes one half-orbit during phasing, sits at apogee during rendezvous
      let tugTheta;
      if (t < 0.42) {
        tugTheta = Math.PI - (t / 0.42) * (Math.PI * 0.4); // moving toward apogee
      } else if (t < 0.62) {
        const u = (t - 0.42) / 0.2;
        tugTheta = Math.PI * 0.6 - u * (Math.PI * 0.1); // approach apogee
      } else {
        tugTheta = Math.PI / 2; // apogee top
      }
      const tugP = tugOrbitPoint(tugTheta);

      // TLI burn + lunar transfer
      if (t >= 0.78) {
        const u = Math.min(1, (t - 0.78) / 0.22);
        drawTLITrail(u);
      }

      // Markers
      if (t >= 0.42 && t <= 0.92) {
        // apogee rendezvous halo
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 0.4 + 0.3 * Math.sin(t * 30);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(tugApogee.x, tugApogee.y, 36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      // Dots
      if (t < 0.78) {
        drawDot(pp.x, pp.y, 5, '#ffb84d');
      }
      drawDot(tugP.x, tugP.y, 6, '#5cf2c0');

      // Labels
      drawLabel('apogee 100–200 km', tugApogee.x - 80, tugApogee.y - 50, '#d8e6f5');
      drawLabel('Manna pod', pp.x + 10, pp.y - 6, '#ffb84d');
      drawLabel('Tug', tugP.x + 12, tugP.y + 4, '#5cf2c0');

      if (phaseEl) phaseEl.textContent = `phase: ${ph.name}`;

      t += 0.0028;
      if (t > 1.05) t = 0;
      raf = requestAnimationFrame(frame);
    }

    function play() {
      t = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    }

    if (playBtn) playBtn.addEventListener('click', play);
    raf = requestAnimationFrame(frame);
  }

  // ─────────────────────────────────────────────
  //  Inclination — two satellites tracing inclined orbits
  // ─────────────────────────────────────────────
  function initInclination() {
    const eq = document.getElementById('sat-equator');
    const inc = document.getElementById('sat-inclined');
    if (!eq || !inc) return;
    let theta = 0;
    function step() {
      theta += 0.012;
      const a = 140, b = 10;
      // equatorial
      const ex = a * Math.cos(theta);
      const ey = -b * Math.sin(theta);
      eq.setAttribute('cx', ex);
      eq.setAttribute('cy', ey);
      // inclined (rotate -35°)
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

  // ─────────────────────────────────────────────
  //  Rendezvous step-through
  // ─────────────────────────────────────────────
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

    // Earth at (200, 500) r=260. Apogee point = (700, 100).
    const earthCx = 200, earthCy = 500;
    const apogeeX = 700, apogeeY = 100;

    // Tug elliptical orbit path (low perigee, apogee at apogeeX, apogeeY)
    function makeEllipsePath(rx, ry, rotateDeg, cx, cy) {
      // approximate ellipse with cubic
      return `M ${cx - rx} ${cy} A ${rx} ${ry} ${rotateDeg} 1 0 ${cx + rx} ${cy} A ${rx} ${ry} ${rotateDeg} 1 0 ${cx - rx} ${cy}`;
    }

    // Tug orbit: an ellipse centered offset, oriented so its apogee = apogeeX/Y
    const orbitCx = (earthCx + apogeeX) / 2;
    const orbitCy = (earthCy - 80 + apogeeY) / 2 + 60;
    const orbitRx = 320;
    const orbitRy = 220;
    tugOrbit.setAttribute('d', makeEllipsePath(orbitRx, orbitRy, 0, orbitCx, orbitCy));

    // Pod ballistic arc — from rail (left edge of Earth) to apogee
    const railX = 90, railY = 270;
    const podArcD = `M ${railX} ${railY} Q ${(railX + apogeeX) / 2 - 60} ${apogeeY - 120} ${apogeeX} ${apogeeY}`;
    podArc.setAttribute('d', podArcD);

    // Position helpers
    function tugAt(theta) {
      // theta=0 → right (perigee side?), pi → left. Apogee = top of ellipse roughly.
      // Simpler: parametric ellipse with apogee at top (theta = pi/2 → top)
      const x = orbitCx + orbitRx * Math.cos(theta);
      const y = orbitCy - orbitRy * Math.sin(theta);
      return { x, y };
    }

    function podAt(u) {
      const sx = railX, sy = railY;
      const cx = (railX + apogeeX) / 2 - 60;
      const cy = apogeeY - 120;
      const ex = apogeeX, ey = apogeeY;
      const x = (1 - u) * (1 - u) * sx + 2 * (1 - u) * u * cx + u * u * ex;
      const y = (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * cy + u * u * ey;
      return { x, y };
    }

    let timeline = null;

    function reset() {
      if (timeline) {
        timeline.forEach(id => clearTimeout(id));
        timeline = null;
      }
      steps.forEach(s => s.classList.remove('active'));
      const t0 = tugAt(Math.PI); // start at left side
      tugDot.setAttribute('cx', t0.x);
      tugDot.setAttribute('cy', t0.y);
      podDot.setAttribute('cx', railX);
      podDot.setAttribute('cy', railY);
      apogeeMarker.setAttribute('opacity', 0);
      apogeeMarker.setAttribute('transform', `translate(${apogeeX}, ${apogeeY})`);
    }

    function animate(from, to, duration, onUpdate, onDone) {
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const v = from + (to - from) * eased;
        onUpdate(v);
        if (t < 1) requestAnimationFrame(frame);
        else if (onDone) onDone();
      }
      requestAnimationFrame(frame);
    }

    function highlightStep(n) {
      steps.forEach(s => {
        if (parseInt(s.dataset.step, 10) === n) s.classList.add('active');
        else s.classList.remove('active');
      });
    }

    function play() {
      reset();
      const ids = [];

      // Step 1: parking orbit — Tug moves along left half
      ids.push(setTimeout(() => {
        highlightStep(1);
        animate(Math.PI, Math.PI * 0.85, 1400,
          theta => {
            const p = tugAt(theta);
            tugDot.setAttribute('cx', p.x);
            tugDot.setAttribute('cy', p.y);
          });
      }, 100));

      // Step 2: phasing burn
      ids.push(setTimeout(() => {
        highlightStep(2);
        animate(Math.PI * 0.85, Math.PI * 0.65, 1200,
          theta => {
            const p = tugAt(theta);
            tugDot.setAttribute('cx', p.x);
            tugDot.setAttribute('cy', p.y);
          });
      }, 1700));

      // Step 3: coast to apogee
      ids.push(setTimeout(() => {
        highlightStep(3);
        animate(Math.PI * 0.65, Math.PI / 2, 1500,
          theta => {
            const p = tugAt(theta);
            tugDot.setAttribute('cx', p.x);
            tugDot.setAttribute('cy', p.y);
          });
        // pod ascending in parallel
        animate(0, 1, 1500, u => {
          const p = podAt(u);
          podDot.setAttribute('cx', p.x);
          podDot.setAttribute('cy', p.y);
        });
        apogeeMarker.setAttribute('opacity', 1);
      }, 3000));

      // Step 4: velocity match
      ids.push(setTimeout(() => {
        highlightStep(4);
        // small wiggle to suggest match
        animate(0, 1, 1200, u => {
          const dx = Math.sin(u * Math.PI * 4) * 8 * (1 - u);
          tugDot.setAttribute('cx', apogeeX - 30 + dx + u * 25);
          tugDot.setAttribute('cy', apogeeY + 4);
        });
      }, 4600));

      // Step 5: berthing
      ids.push(setTimeout(() => {
        highlightStep(5);
        animate(0, 1, 1200, u => {
          tugDot.setAttribute('cx', apogeeX - 5 + u * 4);
          tugDot.setAttribute('cy', apogeeY + 4);
        });
      }, 5900));

      // Step 6: TLI burn — tug+pod accelerate together up-right
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

  // ─────────────────────────────────────────────
  //  ΔV bar chart — animate on intersect
  // ─────────────────────────────────────────────
  function initDVChart() {
    const root = document.getElementById('dv-chart');
    if (!root) return;
    const data = [
      { label: 'Launch (not Tug propellant)', low: 9200, high: 9500, max: 11000, faded: true },
      { label: 'Phasing per catch', low: 10, high: 100, max: 11000 },
      { label: 'Apogee velocity match', low: 5, high: 50, max: 11000 },
      { label: 'Orbit maintenance / yr', low: 10, high: 50, max: 11000 },
      { label: 'TLI per mission', low: 900, high: 1100, max: 11000 },
      { label: 'Lunar orbit insertion', low: 850, high: 1000, max: 11000 },
      { label: 'Reserve', low: 100, high: 100, max: 11000 },
      { label: 'Total (lifetime)', low: 8000, high: 10000, max: 11000, total: true }
    ];
    data.forEach(d => {
      const row = document.createElement('div');
      row.className = 'dv-row';
      const range = d.low === d.high ? `${d.low} m/s` : `${d.low.toLocaleString()}–${d.high.toLocaleString()} m/s`;
      const widthPct = (d.high / d.max) * 100;
      const startPct = (d.low / d.max) * 100;
      row.innerHTML = `
        <div class="dv-label">${d.label}</div>
        <div class="dv-bar"><div class="dv-fill" data-start="${startPct}" data-end="${widthPct}" style="${d.faded ? 'opacity:0.4;' : ''}${d.total ? 'background:linear-gradient(90deg,#ffb84d,#ff6b6b);' : ''}"></div></div>
        <div class="dv-value">${range}</div>
      `;
      root.appendChild(row);
    });

    const fills = root.querySelectorAll('.dv-fill');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          fills.forEach((f, i) => {
            setTimeout(() => {
              f.style.width = f.dataset.end + '%';
            }, i * 90);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.25 });
    obs.observe(root);
  }

  // ─────────────────────────────────────────────
  //  Smooth scroll for nav
  // ─────────────────────────────────────────────
  function initNav() {
    document.querySelectorAll('.site-nav a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
        }
      });
    });
  }

  // ─────────────────────────────────────────────
  //  Boot
  // ─────────────────────────────────────────────
  function boot() {
    injectStageArt();
    initStars();
    initChain();
    initProfile();
    initInclination();
    initRendezvous();
    initDVChart();
    initNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
