// Tug mission walkthrough — canvas animation.
// Self-contained. No deps. Drives all HUD readouts, controls, and the canvas.

(() => {
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');

  // ---- Constants (meters) ----
  const R_EARTH = 6_378_000;
  const RAIL_LAT_DEG = 34.93;
  const APOGEE_ALT = 150_000;           // 150 km nominal
  const TUG_PARK_PERIGEE = 150_000;
  const POD_VX_APOGEE = 1000;           // m/s, mid of 600-1500 range
  const TUG_INITIAL_VX = 7784;          // m/s circular at 200 km

  // ---- Phases ----
  // Each phase: t0/t1 absolute timeline, name, caption, label for jumper.
  const PHASES = [
    { id: 0, t0: 0.0,  t1: 2.5,  name: 'Pre-launch',         label: '1. Pre-launch',
      caption: 'Tug pre-positioned in a 35° inclined HEO. Rail at Hazel Green, AL (34.93°N) is loaded.' },
    { id: 1, t0: 2.5,  t1: 5.0,  name: 'Rail launch',        label: '2. Rail',
      caption: 'EM acceleration along the 28.7 km BGKPJR rail. Pod exits at hypersonic velocity, 30° elevation.' },
    { id: 2, t0: 5.0,  t1: 14.0, name: 'Ballistic ascent',   label: '3. Ascent',
      caption: 'Pod climbs ballistically. Drag bleeds the horizontal velocity from km/s to 600–1,500 m/s by apogee.' },
    { id: 3, t0: 14.0, t1: 16.5, name: 'Apogee approach',    label: '4. Approach',
      caption: 'Camera closes on the apogee region. Pod is near-vertical and nearly stopped horizontally.' },
    { id: 4, t0: 16.5, t1: 19.0, name: 'Phasing maneuver',   label: '5. Phasing',
      caption: 'Tug performs a small phasing burn (10–100 m/s) to align its apogee with the pod in space and time.' },
    { id: 5, t0: 19.0, t1: 22.5, name: 'Apogee velocity match', label: '6. Match',
      caption: 'Tug matches pod v_x at apogee. Closing rate < 0.5 m/s. ΔV: 5–50 m/s [ESTIMATE].' },
    { id: 6, t0: 22.5, t1: 26.0, name: 'Capture & berthing', label: '7. Capture',
      caption: 'Berthing arm closes over 30–120 s at near-zero relative velocity. Capture mechanism TRL 1–2.' },
    { id: 7, t0: 26.0, t1: 29.0, name: 'Trans-lunar injection', label: '8. TLI',
      caption: 'Combined vehicle performs TLI burn. ΔV ~900–1,100 m/s. C3 ≥ 0 for ~3-day lunar transfer.' },
    { id: 8, t0: 29.0, t1: 36.0, name: 'Lunar transfer',     label: '9. Transfer',
      caption: 'Trans-lunar coast (~3 days). Handoff to lunar descent stage on arrival (out of Tug scope).' },
  ];
  const TOTAL_T = PHASES[PHASES.length - 1].t1;

  // ---- Animation state ----
  const state = {
    t: 0,
    playing: true,
    speed: 1,
    lastFrame: performance.now(),
    dvUsed: 0,
  };

  // ---- Starfield ----
  const stars = [];
  for (let i = 0; i < 240; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      tw: Math.random() * Math.PI * 2,
    });
  }

  // ---- Helpers ----
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function phaseAt(t) {
    for (const p of PHASES) if (t >= p.t0 && t < p.t1) return p;
    return PHASES[PHASES.length - 1];
  }
  function phaseLocal(t, p) {
    return clamp((t - p.t0) / (p.t1 - p.t0), 0, 1);
  }

  // ---- Camera ----
  // Each phase has a target camera config; we ease between them.
  // {cx, cy} is the world-coordinate origin in pixels at scale 1; scale is m -> px.
  // To keep math simple we use a viewport-centered transform.
  function cameraFor(t) {
    const W = canvas.width, H = canvas.height;
    // Configs by phase id
    const configs = {
      0: { cx: 0, cy: -R_EARTH * 0.05, scale: H / (R_EARTH * 2.6) }, // Earth wide
      1: { cx: railWorld().x * 0.6, cy: railWorld().y * 0.6 - 50_000, scale: H / 600_000 }, // rail close
      2: { cx: 0, cy: -R_EARTH * 0.1, scale: H / (R_EARTH * 1.8) },  // ascent mid
      3: { cx: apogeeWorld().x * 0.95, cy: apogeeWorld().y * 0.95, scale: H / 800_000 }, // apogee region
      4: { cx: apogeeWorld().x, cy: apogeeWorld().y, scale: H / 200_000 }, // phasing close
      5: { cx: apogeeWorld().x, cy: apogeeWorld().y, scale: H / 60_000 },  // velocity match
      6: { cx: apogeeWorld().x, cy: apogeeWorld().y, scale: H / 20_000 },  // capture close
      7: { cx: 0, cy: -R_EARTH * 0.2, scale: H / (R_EARTH * 3.5) }, // pull back for TLI
      8: { cx: R_EARTH * 8, cy: -R_EARTH * 2, scale: H / (R_EARTH * 90) }, // lunar wide
    };
    const p = phaseAt(t);
    const next = PHASES[Math.min(p.id + 1, PHASES.length - 1)];
    const c0 = configs[p.id];
    const c1 = configs[next.id];
    const f = smooth(phaseLocal(t, p));
    return {
      cx: lerp(c0.cx, c1.cx, f),
      cy: lerp(c0.cy, c1.cy, f),
      scale: lerp(c0.scale, c1.scale, f),
    };
  }

  // ---- World positions ----
  // Earth center at world (0,0). y up = away from Hazel Green (we'll rotate so rail is at top-right).
  function railWorld() {
    // Place rail on the Earth limb at +RAIL_LAT_DEG from horizontal axis on the right.
    const ang = (90 - RAIL_LAT_DEG) * Math.PI / 180; // angle from +y axis going clockwise
    return {
      x: R_EARTH * Math.sin(ang),
      y: -R_EARTH * Math.cos(ang),
      ang,
    };
  }

  function apogeeWorld() {
    // Apogee is downrange from rail at 30° elevation, climbing along surface tangent.
    // For visual we place apogee further along the tangent direction.
    const rw = railWorld();
    const tangent = { x: Math.cos(rw.ang), y: Math.sin(rw.ang) }; // CCW tangent
    const r = R_EARTH + APOGEE_ALT;
    // approximate apogee at small downrange — rotate rail position by ~6° around Earth center
    const downrangeAng = 6 * Math.PI / 180;
    const a = rw.ang - downrangeAng;
    return {
      x: r * Math.sin(a),
      y: -r * Math.cos(a),
      ang: a,
    };
  }

  // ---- Trajectories ----
  // Pod ballistic arc: parametric path from rail to apogee, then descent (we won't draw descent).
  function podArcPoint(s) {
    // s in [0,1] from rail exit to apogee
    const rw = railWorld();
    const aw = apogeeWorld();
    // Parametric: start at rail, end at apogee, arc upward (away from Earth) via cubic Bezier
    const start = { x: rw.x, y: rw.y };
    const end = { x: aw.x, y: aw.y };
    // Control points: launch direction (30° above local horizontal) from rail, and a high midpoint
    const elev = 30 * Math.PI / 180;
    const localUp = { x: Math.sin(rw.ang), y: -Math.cos(rw.ang) };
    const localTan = { x: Math.cos(rw.ang), y: Math.sin(rw.ang) };
    const launchDir = {
      x: localUp.x * Math.sin(elev) + (-localTan.x) * Math.cos(elev),
      y: localUp.y * Math.sin(elev) + (-localTan.y) * Math.cos(elev),
    };
    const c1 = { x: start.x + launchDir.x * 250_000, y: start.y + launchDir.y * 250_000 };
    const c2 = { x: end.x + localUp.x * 60_000, y: end.y - 60_000 };
    const u = s, v = 1 - s;
    return {
      x: v*v*v*start.x + 3*v*v*u*c1.x + 3*v*u*u*c2.x + u*u*u*end.x,
      y: v*v*v*start.y + 3*v*v*u*c1.y + 3*v*u*u*c2.y + u*u*u*end.y,
    };
  }

  // Tug parking orbit: HEO with apogee co-located with pod apogee.
  // For drawing we render an ellipse with semi-major axis along the apogee radial.
  function tugOrbitParams() {
    const aw = apogeeWorld();
    const rApogee = R_EARTH + APOGEE_ALT;
    const rPerigee = R_EARTH + TUG_PARK_PERIGEE;
    const a = (rApogee + rPerigee) / 2;
    const e = (rApogee - rPerigee) / (rApogee + rPerigee);
    return { a, e, b: a * Math.sqrt(1 - e*e), angle: aw.ang };
  }

  // Position on ellipse, mean anomaly approximation (true anomaly direct for drawing motion)
  function tugOrbitPoint(theta) {
    const { a, e, angle } = tugOrbitParams();
    const r = a * (1 - e*e) / (1 + e * Math.cos(theta));
    // theta = 0 at perigee on opposite side of apogee; place apogee at theta=π along the apogee radial.
    const localX = r * Math.cos(theta + Math.PI); // shift so apogee aligns with +radial
    const localY = r * Math.sin(theta + Math.PI);
    // Rotate so apogee radial points to aw direction (angle from +y axis)
    // Convert "angle from +y axis" to standard rotation.
    const phi = angle - Math.PI / 2; // rotate frame
    return {
      x: localX * Math.cos(phi) - localY * Math.sin(phi),
      y: localX * Math.sin(phi) + localY * Math.cos(phi),
    };
  }

  // TLI trajectory: from apogee outward toward Moon position.
  const MOON_WORLD = { x: R_EARTH * 60, y: -R_EARTH * 12 };
  function tliPoint(s) {
    const aw = apogeeWorld();
    const start = { x: aw.x, y: aw.y };
    const end = MOON_WORLD;
    // Slight curve
    const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - R_EARTH * 3 };
    const u = s, v = 1 - s;
    return {
      x: v*v*start.x + 2*v*u*mid.x + u*u*end.x,
      y: v*v*start.y + 2*v*u*mid.y + u*u*end.y,
    };
  }

  // ---- Drawing primitives ----
  function worldToScreen(wx, wy, cam) {
    return {
      x: canvas.width / 2 + (wx - cam.cx) * cam.scale,
      y: canvas.height / 2 + (wy - cam.cy) * cam.scale,
    };
  }

  function drawStars() {
    ctx.save();
    const time = state.t;
    for (const s of stars) {
      const x = s.x * canvas.width;
      const y = s.y * canvas.height;
      const alpha = 0.4 + 0.4 * Math.sin(time * 2 + s.tw);
      ctx.fillStyle = `rgba(220, 230, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawEarth(cam) {
    const c = worldToScreen(0, 0, cam);
    const r = R_EARTH * cam.scale;
    if (r < 2) return; // off-screen tiny
    // Atmosphere glow
    const atmoGrad = ctx.createRadialGradient(c.x, c.y, r * 0.97, c.x, c.y, r * 1.12);
    atmoGrad.addColorStop(0, 'rgba(120, 180, 255, 0.35)');
    atmoGrad.addColorStop(1, 'rgba(80, 140, 220, 0)');
    ctx.fillStyle = atmoGrad;
    ctx.beginPath(); ctx.arc(c.x, c.y, r * 1.12, 0, Math.PI * 2); ctx.fill();
    // Earth body
    const grad = ctx.createRadialGradient(c.x - r * 0.4, c.y - r * 0.4, r * 0.2, c.x, c.y, r);
    grad.addColorStop(0, '#4a82d8');
    grad.addColorStop(0.6, '#1f3e74');
    grad.addColorStop(1, '#0a1a3a');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI * 2); ctx.fill();
    // Continents hint (deterministic blobs)
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#5fa05a';
    const blobs = [[0.2,-0.3,0.25],[ -0.4,0.1,0.3],[0.5,0.4,0.18],[-0.1,0.5,0.22]];
    for (const b of blobs) {
      ctx.beginPath();
      ctx.ellipse(c.x + b[0]*r, c.y + b[1]*r, b[2]*r, b[2]*r*0.55, 0, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
    // Rail marker
    const rw = railWorld();
    const rp = worldToScreen(rw.x, rw.y, cam);
    if (r > 30) {
      ctx.fillStyle = '#ffd86b';
      ctx.beginPath(); ctx.arc(rp.x, rp.y, Math.max(3, r * 0.008), 0, Math.PI*2); ctx.fill();
      if (r > 200) {
        ctx.fillStyle = 'rgba(255, 216, 107, 0.9)';
        ctx.font = '11px -apple-system, sans-serif';
        ctx.fillText('BGKPJR rail · Hazel Green, AL', rp.x + 10, rp.y - 4);
      }
    }
  }

  function drawPodTrajectory(cam, progress) {
    // Draw the pod ballistic arc up to current progress, plus dashed future.
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(249, 211, 106, 0.85)';
    ctx.beginPath();
    const steps = 100;
    let started = false;
    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      if (s > progress) break;
      const p = podArcPoint(s);
      const sp = worldToScreen(p.x, p.y, cam);
      if (!started) { ctx.moveTo(sp.x, sp.y); started = true; } else ctx.lineTo(sp.x, sp.y);
    }
    ctx.stroke();
    // Future (dashed)
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(249, 211, 106, 0.25)';
    ctx.beginPath();
    started = false;
    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      if (s < progress) continue;
      const p = podArcPoint(s);
      const sp = worldToScreen(p.x, p.y, cam);
      if (!started) { ctx.moveTo(sp.x, sp.y); started = true; } else ctx.lineTo(sp.x, sp.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawTugOrbit(cam) {
    const { a, e, b, angle } = tugOrbitParams();
    if (a * cam.scale < 5) return;
    ctx.save();
    const phi = angle - Math.PI / 2;
    // Center of ellipse is offset from Earth center by c = a*e toward perigee (opposite apogee direction)
    const cVal = a * e;
    const cx = -cVal * Math.cos(phi - 0) * 0 - cVal * Math.cos(phi);
    // Actually we want ellipse center along -apogee-radial direction:
    const radial = { x: Math.sin(angle), y: -Math.cos(angle) };
    const cxW = -radial.x * cVal;
    const cyW = -radial.y * cVal;
    const sc = worldToScreen(cxW, cyW, cam);
    ctx.translate(sc.x, sc.y);
    ctx.rotate(phi);
    ctx.strokeStyle = 'rgba(255, 122, 77, 0.5)';
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, a * cam.scale, b * cam.scale, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawTLITrajectory(cam, progress) {
    if (progress <= 0) return;
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(180, 130, 255, 0.8)';
    ctx.beginPath();
    const steps = 80;
    let started = false;
    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      if (s > progress) break;
      const p = tliPoint(s);
      const sp = worldToScreen(p.x, p.y, cam);
      if (!started) { ctx.moveTo(sp.x, sp.y); started = true; } else ctx.lineTo(sp.x, sp.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawMoon(cam) {
    const mp = worldToScreen(MOON_WORLD.x, MOON_WORLD.y, cam);
    const mr = Math.max(2, 1737_000 * cam.scale);
    if (mp.x < -50 || mp.x > canvas.width + 50 || mp.y < -50 || mp.y > canvas.height + 50) return;
    const grad = ctx.createRadialGradient(mp.x - mr*0.3, mp.y - mr*0.3, mr*0.2, mp.x, mp.y, mr);
    grad.addColorStop(0, '#e8ecf3');
    grad.addColorStop(1, '#7f8696');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(mp.x, mp.y, mr, 0, Math.PI*2); ctx.fill();
    if (mr > 14) {
      ctx.fillStyle = 'rgba(220, 226, 240, 0.85)';
      ctx.font = '12px -apple-system, sans-serif';
      ctx.fillText('Moon', mp.x + mr + 6, mp.y + 4);
    }
  }

  function drawPod(cam, pos, burning) {
    const sp = worldToScreen(pos.x, pos.y, cam);
    const size = Math.max(3, 1500 * cam.scale);
    if (burning) {
      ctx.fillStyle = 'rgba(255, 180, 80, 0.7)';
      ctx.beginPath(); ctx.arc(sp.x, sp.y, size * 2.4, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = '#f9d36a';
    ctx.beginPath(); ctx.arc(sp.x, sp.y, size, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(255, 230, 150, 0.9)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawTug(cam, pos, burning, rot = 0) {
    const sp = worldToScreen(pos.x, pos.y, cam);
    const s = Math.max(4, 2200 * cam.scale);
    ctx.save();
    ctx.translate(sp.x, sp.y);
    ctx.rotate(rot);
    if (burning) {
      ctx.fillStyle = 'rgba(255, 90, 60, 0.8)';
      ctx.beginPath();
      ctx.moveTo(-s * 1.2, 0);
      ctx.lineTo(-s * 3, -s * 0.6);
      ctx.lineTo(-s * 3, s * 0.6);
      ctx.closePath();
      ctx.fill();
    }
    // Body
    ctx.fillStyle = '#ff7a4d';
    ctx.fillRect(-s, -s * 0.5, s * 2, s);
    // Solar panels
    ctx.fillStyle = '#2a4a8a';
    ctx.fillRect(-s * 0.3, -s * 1.8, s * 0.6, s * 1.2);
    ctx.fillRect(-s * 0.3, s * 0.6, s * 0.6, s * 1.2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-s, -s * 0.5, s * 2, s);
    ctx.restore();
  }

  // ---- Phase-driven entity state ----
  function computeState(t) {
    const p = phaseAt(t);
    const f = phaseLocal(t, p);
    const aw = apogeeWorld();
    const rw = railWorld();

    let podPos = { x: rw.x, y: rw.y };
    let tugPos = tugOrbitPoint(Math.PI); // at apogee
    let podVx = 0, podAlt = 0, tugVx = TUG_INITIAL_VX, closing = '—', burning = { pod: false, tug: false };
    let podArcProgress = 0;
    let tliProgress = 0;
    let podVisible = false;
    let combinedVehicle = false;

    if (p.id === 0) {
      // Pre-launch
      tugPos = tugOrbitPoint(Math.PI - 0.6 + f * 0.3); // drifting toward apogee
      podVisible = false;
    } else if (p.id === 1) {
      // Rail launch — pod slides along rail
      podVisible = true;
      const slide = f;
      podPos = { x: rw.x * (1 - slide * 0.001), y: rw.y * (1 - slide * 0.001) };
      podAlt = slide * 1000;
      podVx = slide * 6000;
      burning.pod = true;
      tugPos = tugOrbitPoint(Math.PI - 0.3 + f * 0.15);
      podArcProgress = 0.0;
    } else if (p.id === 2) {
      // Ballistic ascent
      podVisible = true;
      podArcProgress = f;
      podPos = podArcPoint(f);
      podAlt = lerp(0, APOGEE_ALT, smooth(f)) / 1000; // km
      podVx = lerp(5500, POD_VX_APOGEE, smooth(f));
      tugPos = tugOrbitPoint(Math.PI - 0.15 + f * 0.12);
    } else if (p.id === 3) {
      // Apogee approach
      podVisible = true;
      podArcProgress = 1.0;
      podPos = podArcPoint(1.0);
      podAlt = APOGEE_ALT / 1000;
      podVx = POD_VX_APOGEE;
      tugPos = tugOrbitPoint(Math.PI - 0.03 + f * 0.03);
      const dx = (tugPos.x - podPos.x), dy = (tugPos.y - podPos.y);
      closing = Math.round(Math.sqrt(dx*dx + dy*dy) / 50).toLocaleString();
    } else if (p.id === 4) {
      // Phasing maneuver
      podVisible = true;
      podArcProgress = 1.0;
      podPos = podArcPoint(1.0);
      podAlt = APOGEE_ALT / 1000;
      podVx = POD_VX_APOGEE;
      // Tug slides toward apogee point
      const tStart = tugOrbitPoint(Math.PI);
      tugPos = { x: lerp(tStart.x - 25_000, aw.x - 4_000, smooth(f)), y: lerp(tStart.y - 8_000, aw.y - 1_500, smooth(f)) };
      burning.tug = true;
      closing = (50 - f * 45).toFixed(1);
      tugVx = lerp(TUG_INITIAL_VX, 1800, smooth(f));
    } else if (p.id === 5) {
      // Velocity match
      podVisible = true;
      podPos = podArcPoint(1.0);
      podAlt = APOGEE_ALT / 1000;
      podVx = POD_VX_APOGEE;
      tugPos = { x: lerp(aw.x - 4_000, aw.x - 200, smooth(f)), y: lerp(aw.y - 1_500, aw.y - 50, smooth(f)) };
      burning.tug = f > 0.2 && f < 0.8;
      tugVx = lerp(1800, POD_VX_APOGEE, smooth(f));
      closing = (5 - f * 4.5).toFixed(2);
    } else if (p.id === 6) {
      // Capture & berthing
      podVisible = true;
      podPos = podArcPoint(1.0);
      tugPos = { x: lerp(aw.x - 200, aw.x - 5, smooth(f)), y: lerp(aw.y - 50, aw.y, smooth(f)) };
      podAlt = APOGEE_ALT / 1000;
      podVx = POD_VX_APOGEE;
      tugVx = POD_VX_APOGEE;
      closing = (0.5 * (1 - f)).toFixed(2);
    } else if (p.id === 7) {
      // TLI burn
      combinedVehicle = true;
      podPos = podArcPoint(1.0);
      tugPos = podPos;
      burning.tug = true;
      podAlt = APOGEE_ALT / 1000;
      tugVx = lerp(POD_VX_APOGEE, POD_VX_APOGEE + 1000, smooth(f));
      podVx = tugVx;
      closing = '0.00';
      tliProgress = f * 0.05;
    } else if (p.id === 8) {
      // Lunar transfer
      combinedVehicle = true;
      tliProgress = 0.05 + f * 0.95;
      const cp = tliPoint(tliProgress);
      tugPos = cp; podPos = cp;
      podAlt = lerp(150, 380_000, smooth(f));
      podVx = lerp(POD_VX_APOGEE + 1000, 800, smooth(f));
      tugVx = podVx;
      closing = '0.00';
    }

    return { p, f, podPos, tugPos, podVx, podAlt, tugVx, closing, burning, podArcProgress, tliProgress, podVisible, combinedVehicle };
  }

  // ---- Cumulative ΔV (rough) ----
  function dvSpent(t) {
    let dv = 0;
    if (t >= PHASES[4].t0) dv += 50 * clamp((t - PHASES[4].t0) / (PHASES[4].t1 - PHASES[4].t0), 0, 1);
    if (t >= PHASES[5].t0) dv += 25 * clamp((t - PHASES[5].t0) / (PHASES[5].t1 - PHASES[5].t0), 0, 1);
    if (t >= PHASES[7].t0) dv += 1000 * clamp((t - PHASES[7].t0) / (PHASES[7].t1 - PHASES[7].t0), 0, 1);
    return Math.round(dv);
  }

  // ---- Main draw ----
  function draw() {
    ctx.fillStyle = '#02030a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars();

    const cam = cameraFor(state.t);
    const s = computeState(state.t);

    drawEarth(cam);
    drawTugOrbit(cam);
    drawPodTrajectory(cam, s.podArcProgress);
    drawTLITrajectory(cam, s.tliProgress);
    drawMoon(cam);

    if (s.podVisible && !s.combinedVehicle) drawPod(cam, s.podPos, s.burning.pod);
    drawTug(cam, s.tugPos, s.burning.tug, 0);

    // HUD updates
    document.getElementById('phaseNum').textContent = (s.p.id + 1).toString();
    document.getElementById('phaseName').textContent = s.p.name;
    document.getElementById('caption').textContent = s.p.caption;
    document.getElementById('rT').textContent = state.t.toFixed(1) + ' s';
    document.getElementById('rPodAlt').textContent = (s.podAlt < 1000)
      ? Math.round(s.podAlt) + ' km'
      : (s.podAlt / 1000).toFixed(1) + ' Mm';
    document.getElementById('rPodVx').textContent = Math.round(s.podVx).toLocaleString() + ' m/s';
    document.getElementById('rTugVx').textContent = Math.round(s.tugVx).toLocaleString() + ' m/s';
    document.getElementById('rClose').textContent = (s.closing === '—' ? '—' : s.closing + ' m/s');
    document.getElementById('rDv').textContent = dvSpent(state.t).toLocaleString() + ' m/s';

    document.getElementById('timeLabel').textContent =
      state.t.toFixed(1) + ' / ' + TOTAL_T.toFixed(1) + ' s';

    // Update scrubber
    const scrub = document.getElementById('scrub');
    if (document.activeElement !== scrub) scrub.value = state.t.toString();

    // Active phase button
    const buttons = document.querySelectorAll('.phase-jumper button');
    buttons.forEach((b, i) => b.classList.toggle('active', i === s.p.id));
  }

  // ---- Tick ----
  function tick(now) {
    const dt = (now - state.lastFrame) / 1000;
    state.lastFrame = now;
    if (state.playing) {
      state.t += dt * state.speed;
      if (state.t > TOTAL_T) state.t = 0; // loop
    }
    draw();
    requestAnimationFrame(tick);
  }

  // ---- Controls ----
  function setupControls() {
    const scrub = document.getElementById('scrub');
    scrub.min = '0';
    scrub.max = TOTAL_T.toString();
    scrub.step = '0.05';

    const playBtn = document.getElementById('playBtn');
    playBtn.addEventListener('click', () => {
      state.playing = !state.playing;
      playBtn.textContent = state.playing ? '⏸' : '▶';
    });

    scrub.addEventListener('input', (e) => {
      state.t = parseFloat(e.target.value);
    });

    document.getElementById('speed').addEventListener('change', (e) => {
      state.speed = parseFloat(e.target.value);
    });

    const jumper = document.getElementById('phaseJumper');
    PHASES.forEach((p) => {
      const b = document.createElement('button');
      b.textContent = p.label;
      b.dataset.phase = p.id.toString();
      b.addEventListener('click', () => {
        state.t = p.t0;
      });
      jumper.appendChild(b);
    });
  }

  // ---- Responsive canvas ----
  function fitCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(1, 1);
  }
  window.addEventListener('resize', fitCanvas);

  // ---- Boot ----
  setupControls();
  fitCanvas();
  requestAnimationFrame((now) => { state.lastFrame = now; tick(now); });
})();
