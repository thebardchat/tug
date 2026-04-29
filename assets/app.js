/* ─────────────────────────────────────────────
   TUG · cislunar transit stage
   stylesheet · rev 0.1
   ───────────────────────────────────────────── */
 
:root {
  /* surfaces */
  --bg:        #050a14;
  --bg-alt:    #0a1525;
  --bg-card:   #0d1827;
  --bg-card-2: #131f33;
  --bg-deep:   #02060d;
 
  /* lines */
  --line:      #1f3050;
  --line-2:    #2a4060;
 
  /* text */
  --fg:        #e8eef7;
  --fg-mid:    #b4c4d8;
  --fg-dim:    #7a8fa8;
  --fg-faint:  #4a5d78;
 
  /* accents */
  --accent:    #5cf2c0;
  --accent-d:  #38c898;
  --accent-2:  #ffb84d;
  --accent-2d: #cf8a1a;
  --info:      #2a7eda;
  --warn:      #ffb84d;
  --danger:    #ff6b6b;
 
  /* type */
  --sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
 
  /* layout */
  --maxw: 1240px;
  --gutter: 28px;
  --radius: 6px;
  --radius-lg: 10px;
 
  /* timing */
  --t-fast: 0.15s;
  --t-mid:  0.3s;
  --t-slow: 0.6s;
  --easing: cubic-bezier(0.4, 0, 0.2, 1);
}
 
*, *::before, *::after { box-sizing: border-box; }
 
html {
  scroll-behavior: smooth;
  scroll-padding-top: 96px;
}
 
body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "ss01", "cv11";
}
 
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 3px; }
 
::selection { background: var(--accent); color: var(--bg); }
 
.wrap {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 var(--gutter);
}
 
/* ─────────────────────────────────────────────
   STATUS STRIP
   ───────────────────────────────────────────── */
.status-strip {
  background: var(--bg-deep);
  border-bottom: 1px solid var(--line);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.5px;
  color: var(--fg-dim);
}
.status-strip .wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 30px;
}
.status-spacer { flex: 1; }
.status-sep { color: var(--fg-faint); }
.status-label {
  color: var(--accent);
  font-weight: 500;
  text-transform: uppercase;
}
@media (max-width: 640px) {
  .status-strip .status-meta:nth-of-type(2),
  .status-strip .status-sep:nth-of-type(2) {
    display: none;
  }
}
@media (max-width: 460px) {
  .status-strip .status-meta,
  .status-strip .status-sep {
    display: none;
  }
}
.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 rgba(92, 242, 192, 0.7);
  animation: pulse 2.4s var(--easing) infinite;
}
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(92, 242, 192, 0.5); }
  70%  { box-shadow: 0 0 0 7px rgba(92, 242, 192, 0); }
  100% { box-shadow: 0 0 0 0 rgba(92, 242, 192, 0); }
}
 
/* ─────────────────────────────────────────────
   HEADER
   ───────────────────────────────────────────── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(5, 10, 20, 0.85);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  border-bottom: 1px solid var(--line);
}
.site-header .wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--fg);
}
.brand:hover { text-decoration: none; }
.patch {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.brand-name {
  font-family: var(--mono);
  font-weight: 600;
  font-size: 17px;
  color: var(--accent);
  letter-spacing: 1.5px;
}
.brand-sub {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--fg-dim);
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-top: 2px;
}
.site-nav {
  display: flex;
  gap: 22px;
}
.site-nav a {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--fg-dim);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: color var(--t-fast) var(--easing);
  padding: 6px 0;
  border-bottom: 1px solid transparent;
}
.site-nav a:hover {
  color: var(--accent);
  text-decoration: none;
  border-bottom-color: var(--accent);
}
 
@media (max-width: 760px) {
  .site-nav { display: none; }
}
 
/* ─────────────────────────────────────────────
   HERO
   ───────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 640px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-bottom: 1px solid var(--line);
  isolation: isolate;
}
#hero-stars {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(31, 48, 80, 0.25) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(31, 48, 80, 0.25) 1px, transparent 1px);
  background-size: 80px 80px;
  z-index: 1;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 50%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 50%, transparent 100%);
  pointer-events: none;
}
.hero-inner {
  position: relative;
  z-index: 2;
  padding: 120px 0 100px;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin-bottom: 28px;
}
.eyebrow-num {
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 3px;
  padding: 2px 7px;
  font-weight: 500;
}
.hero h1 {
  font-size: clamp(40px, 6.5vw, 84px);
  line-height: 1;
  margin: 0 0 28px;
  letter-spacing: -2.5px;
  font-weight: 600;
  max-width: 18ch;
}
.hero h1 .accent {
  color: var(--accent);
  font-style: italic;
  font-weight: 400;
}
.lede {
  font-size: clamp(17px, 1.6vw, 20px);
  line-height: 1.55;
  color: var(--fg-mid);
  max-width: 60ch;
  margin: 0 0 44px;
}
.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  max-width: 760px;
}
 
@media (max-width: 540px) {
  .hero-stats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .stat { padding: 14px; }
  .stat-num { font-size: 24px; }
  .hero-inner { padding: 80px 0 70px; }
}
.stat {
  background: rgba(13, 24, 39, 0.5);
  border: 1px solid var(--line);
  border-left: 2px solid var(--accent);
  border-radius: var(--radius);
  padding: 18px 18px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.stat-num {
  font-family: var(--mono);
  font-size: 28px;
  line-height: 1;
  font-weight: 600;
  color: var(--fg);
  letter-spacing: -1px;
}
.stat-unit {
  font-size: 14px;
  color: var(--accent);
  margin-left: 4px;
  font-weight: 400;
  letter-spacing: 0;
}
.stat-label {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-dim);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 8px;
}
.scroll-cue {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--fg-dim);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  animation: float 2.5s var(--easing) infinite;
}
@keyframes float {
  0%, 100% { transform: translate(-50%, 0); opacity: 0.6; }
  50%      { transform: translate(-50%, 6px); opacity: 1; }
}
 
/* ─────────────────────────────────────────────
   SECTIONS
   ───────────────────────────────────────────── */
.section {
  padding: 110px 0;
  border-bottom: 1px solid var(--line);
}
.section-dark {
  background: linear-gradient(180deg, var(--bg-alt) 0%, var(--bg) 100%);
}
.section-head {
  margin-bottom: 56px;
  max-width: 800px;
}
.section-num {
  display: inline-block;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--accent);
  letter-spacing: 1.5px;
  margin-bottom: 12px;
  position: relative;
  padding-left: 28px;
}
.section-num::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 20px;
  height: 1px;
  background: var(--accent);
}
.section h2 {
  font-size: clamp(28px, 3.6vw, 44px);
  line-height: 1.1;
  margin: 0 0 16px;
  letter-spacing: -1px;
  font-weight: 600;
}
.kicker {
  color: var(--fg-mid);
  max-width: 70ch;
  margin: 0;
  font-size: 17px;
  line-height: 1.6;
}
.footnote {
  color: var(--fg-dim);
  font-family: var(--mono);
  font-size: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px dashed var(--line);
  letter-spacing: 0.3px;
}
 
/* ─────────────────────────────────────────────
   01 · CARGO CHAIN
   ───────────────────────────────────────────── */
.chain {
  display: grid;
  grid-template-columns: 1fr 32px 1fr 32px 1fr 32px 1fr;
  align-items: stretch;
  gap: 8px;
}
.chain-stage {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 24px 18px 20px;
  text-align: center;
  transition: border-color var(--t-mid) var(--easing),
              transform var(--t-mid) var(--easing),
              box-shadow var(--t-mid) var(--easing);
}
.chain-stage::before {
  content: "";
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 1px dashed var(--line);
  border-radius: 6px;
  opacity: 0.4;
  pointer-events: none;
}
.chain-stage.active {
  border-color: var(--accent);
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(92, 242, 192, 0.12);
}
.chain-stage-self {
  background: linear-gradient(180deg, #0f2638, var(--bg-card));
  border-color: rgba(92, 242, 192, 0.3);
}
.stage-art {
  height: 88px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stage-art svg {
  width: 100%;
  height: 100%;
  max-width: 140px;
}
.stage-num {
  display: inline-block;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--fg-dim);
  background: var(--bg-deep);
  border: 1px solid var(--line);
  border-radius: 3px;
  padding: 1px 7px;
  margin-bottom: 8px;
  letter-spacing: 1.5px;
}
.stage-label {
  font-size: 15px;
  color: var(--fg);
  font-weight: 500;
  margin-bottom: 4px;
}
.stage-detail {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-dim);
  line-height: 1.4;
}
.chain-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--fg-faint);
  opacity: 0.5;
  transition: opacity var(--t-mid), color var(--t-mid);
}
.chain-arrow.active { opacity: 1; color: var(--accent); }
.chain-arrow svg { width: 100%; height: 18px; }
.chain-arrow span {
  font-family: var(--mono);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  line-height: 1.2;
}
 
@media (max-width: 980px) {
  .chain {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .chain-arrow { transform: rotate(90deg); padding: 4px 0; }
  .chain-arrow span { display: none; }
  .chain-arrow svg { width: 40px; }
}
 
/* ─────────────────────────────────────────────
   02 · MISSION PROFILE
   ───────────────────────────────────────────── */
.profile-stage {
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 18px;
  position: relative;
}
.profile-readouts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 16px;
  padding: 14px 18px;
  background: var(--bg-deep);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  margin-bottom: 14px;
}
.readout {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.readout-label {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--fg-dim);
  letter-spacing: 1px;
  text-transform: uppercase;
}
.readout-value {
  font-family: var(--mono);
  font-size: 14px;
  color: var(--accent);
  font-weight: 500;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.readout-actions {
  display: flex;
  align-items: center;
}
#profile-canvas {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--radius);
  background: var(--bg-deep);
}
.profile-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding-top: 14px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-dim);
}
.profile-legend span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.profile-legend i {
  width: 14px;
  height: 4px;
  border-radius: 2px;
  display: inline-block;
}
.profile-legend i.dashed {
  background: transparent;
  border-top: 1px dashed var(--accent);
  height: 0;
}
 
@media (max-width: 700px) {
  .profile-readouts { grid-template-columns: 1fr 1fr; }
  .readout-actions { grid-column: 1 / -1; }
}
 
/* ─────────────────────────────────────────────
   BUTTONS
   ───────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 9px 18px;
  border-radius: var(--radius);
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--t-fast) var(--easing);
  background: none;
}
.btn-primary {
  background: var(--accent);
  color: var(--bg);
  border-color: var(--accent);
}
.btn-primary:hover {
  background: var(--accent-d);
  border-color: var(--accent-d);
}
.btn-primary:active { transform: scale(0.97); }
.btn-secondary {
  background: transparent;
  color: var(--fg-mid);
  border-color: var(--line-2);
}
.btn-secondary:hover {
  color: var(--fg);
  border-color: var(--accent);
}
 
/* ─────────────────────────────────────────────
   03 · CONOPS TIMELINE
   ───────────────────────────────────────────── */
.conops-timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}
.conops-timeline::before {
  content: "";
  position: absolute;
  left: 96px;
  top: 16px;
  bottom: 16px;
  width: 1px;
  background: var(--line);
}
.conops-timeline li {
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: 24px;
  padding: 22px 0;
  border-bottom: 1px solid var(--line);
  position: relative;
}
.conops-timeline li:last-child { border-bottom: 0; }
.conops-timeline li::after {
  content: "";
  position: absolute;
  left: 92px;
  top: 36px;
  width: 9px;
  height: 9px;
  background: var(--bg);
  border: 1.5px solid var(--accent);
  border-radius: 50%;
}
.phase-time {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--accent);
  font-weight: 500;
  letter-spacing: 0.5px;
  padding-top: 2px;
}
.phase-name {
  font-size: 17px;
  color: var(--fg);
  font-weight: 500;
  margin-bottom: 4px;
  grid-column: 2;
}
.phase-body {
  font-size: 14px;
  color: var(--fg-mid);
  line-height: 1.55;
  grid-column: 2;
}
.phase-tag {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--fg-dim);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 4px 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  align-self: start;
  margin-top: 2px;
}
.conops-timeline li:has(.phase-tag:not(:empty)) .phase-tag[class] {
  /* default already covered */
}
.phase-tag {
  /* re-declare to allow override below */
}
.conops-timeline li .phase-tag {
  grid-row: 1 / span 2;
  grid-column: 3;
}
 
/* critical-phase styling — check the body text for "critical" */
.conops-timeline li:has(.phase-tag) .phase-tag {
  color: var(--fg-dim);
  border-color: var(--line);
}
.phase-tag.critical {
  color: var(--danger);
  border-color: rgba(255, 107, 107, 0.4);
  background: rgba(255, 107, 107, 0.05);
}
 
@media (max-width: 700px) {
  .conops-timeline::before { left: 8px; }
  .conops-timeline li {
    grid-template-columns: 1fr;
    gap: 6px;
    padding-left: 28px;
  }
  .conops-timeline li::after { left: 4px; top: 26px; }
  .phase-name, .phase-body { grid-column: 1; }
  .conops-timeline li .phase-tag { grid-row: auto; grid-column: 1; justify-self: start; margin-top: 8px; }
}
 
/* ─────────────────────────────────────────────
   04 · MECHANICS
   ───────────────────────────────────────────── */
.mech-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}
.mech-card {
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
}
.mech-card h3 {
  font-size: 20px;
  margin: 0 0 12px;
  font-weight: 500;
  letter-spacing: -0.3px;
}
.mech-card > p {
  color: var(--fg-mid);
  font-size: 15px;
  line-height: 1.65;
  margin: 0 0 20px;
}
.formula {
  background: var(--bg-deep);
  border-left: 2px solid var(--accent-2);
  border-radius: var(--radius);
  padding: 14px 18px;
  margin-bottom: 24px;
}
.formula code {
  display: block;
  font-family: var(--mono);
  font-size: 14px;
  color: var(--fg);
  letter-spacing: 0.3px;
}
.formula-where {
  color: var(--fg-dim) !important;
  font-size: 11px !important;
  margin-top: 6px;
  letter-spacing: 0.5px !important;
}
 
.inclination-stage {
  background: var(--bg-deep);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#inclination-svg { width: 100%; height: auto; max-width: 460px; }
 
.rendezvous-stage {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 22px;
}
#rendezvous-svg {
  width: 100%;
  height: auto;
  background: var(--bg-deep);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.rendezvous-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: step;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rendezvous-steps li {
  position: relative;
  padding: 10px 12px 10px 44px;
  border-radius: var(--radius);
  border: 1px solid transparent;
  transition: all var(--t-mid) var(--easing);
  counter-increment: step;
  cursor: default;
}
.rendezvous-steps li::before {
  content: counter(step, decimal-leading-zero);
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--bg-deep);
  border: 1px solid var(--line);
  font-family: var(--mono);
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fg-dim);
  letter-spacing: 0.5px;
}
.rendezvous-steps .step-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--fg);
  margin-bottom: 2px;
}
.rendezvous-steps .step-detail {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-dim);
}
.rendezvous-steps li.active {
  background: rgba(92, 242, 192, 0.05);
  border-color: rgba(92, 242, 192, 0.4);
}
.rendezvous-steps li.active::before {
  background: var(--accent);
  color: var(--bg);
  border-color: var(--accent);
  font-weight: 600;
}
.rendezvous-controls {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  padding-top: 4px;
}
 
@media (max-width: 980px) {
  .mech-grid { grid-template-columns: 1fr; }
  .rendezvous-stage { grid-template-columns: 1fr; }
}
 
/* ─────────────────────────────────────────────
   05 · VEHICLE ARCHITECTURE
   ───────────────────────────────────────────── */
.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.block {
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 22px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform var(--t-fast) var(--easing),
              border-color var(--t-fast) var(--easing);
}
.block:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
}
.block header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.block-id {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--accent);
  background: rgba(92, 242, 192, 0.08);
  border: 1px solid rgba(92, 242, 192, 0.3);
  border-radius: 3px;
  padding: 2px 7px;
  letter-spacing: 1px;
}
.block h3 {
  font-size: 16px;
  margin: 0;
  font-weight: 500;
}
.block ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.block ul li {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--fg-mid);
  padding-left: 12px;
  position: relative;
}
.block ul li::before {
  content: "›";
  position: absolute;
  left: 0;
  color: var(--accent);
  opacity: 0.7;
}
.block footer {
  border-top: 1px dashed var(--line);
  padding-top: 10px;
}
.block-stat {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--fg-dim);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.block-critical {
  border-color: rgba(255, 107, 107, 0.35);
  background: linear-gradient(180deg, #1a1419 0%, var(--bg-card) 70%);
}
.block-critical .block-id {
  color: var(--danger);
  background: rgba(255, 107, 107, 0.08);
  border-color: rgba(255, 107, 107, 0.3);
}
.block-critical .block-stat { color: var(--danger); }
.block-critical:hover { border-color: var(--danger); }
 
/* ─────────────────────────────────────────────
   06 · DELTA-V CHART
   ───────────────────────────────────────────── */
.dv-chart {
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.dv-row {
  display: grid;
  grid-template-columns: 230px 1fr 110px;
  gap: 18px;
  align-items: center;
}
.dv-label {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--fg-mid);
  letter-spacing: 0.3px;
}
.dv-bar {
  height: 14px;
  background: var(--bg-deep);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--line);
}
.dv-fill {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transition: width 1.6s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}
.dv-fill::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
  animation-delay: 1.6s;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.dv-value {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-dim);
  text-align: right;
  letter-spacing: 0.3px;
}
.dv-row.dv-total .dv-label { color: var(--fg); font-weight: 500; }
.dv-row.dv-total .dv-value { color: var(--accent-2); }
.dv-row.dv-total .dv-fill {
  background: linear-gradient(90deg, var(--accent-2), var(--danger));
}
 
@media (max-width: 720px) {
  .dv-row { grid-template-columns: 1fr; gap: 4px; }
  .dv-value { text-align: left; }
}
 
/* ─────────────────────────────────────────────
   07 · RISKS
   ───────────────────────────────────────────── */
.risk-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 14px;
}
.risk-grid li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  padding: 22px 22px;
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  transition: border-color var(--t-fast) var(--easing);
}
.risk-grid li:hover { border-color: var(--accent-2); }
.risk-num {
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-2);
  background: rgba(255, 184, 77, 0.08);
  border: 1px solid rgba(255, 184, 77, 0.3);
  border-radius: 4px;
  padding: 4px 10px;
  align-self: start;
  letter-spacing: 0.5px;
}
.risk-body h4 {
  font-size: 15px;
  margin: 0 0 8px;
  color: var(--fg);
  font-weight: 500;
}
.risk-body p {
  font-size: 13px;
  color: var(--fg-mid);
  margin: 0 0 10px;
  line-height: 1.55;
}
.risk-owner {
  display: inline-block;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--fg-dim);
  text-transform: uppercase;
  letter-spacing: 1px;
}
 
/* ─────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────── */
.site-footer {
  background: var(--bg-deep);
  border-top: 1px solid var(--line);
  padding: 60px 0;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 48px;
}
.footer-logo {
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 2px;
  margin-bottom: 8px;
}
.footer-head {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 12px;
}
.footer-line {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--fg-dim);
  margin: 4px 0;
  line-height: 1.5;
}
 
@media (max-width: 700px) {
  .footer-grid { grid-template-columns: 1fr; gap: 28px; }
}
 
/* ─────────────────────────────────────────────
   PRINT
   ───────────────────────────────────────────── */
@media print {
  body { background: white; color: black; }
  .site-header, .status-strip, .scroll-cue, #hero-stars,
  .hero-grid, .profile-readouts button, .rendezvous-controls,
  .site-nav { display: none !important; }
  .section { padding: 30px 0; page-break-inside: avoid; border-bottom: 1px solid #ccc; }
  .hero { min-height: auto; padding: 30px 0; }
  .hero h1, .section h2, .stage-label, .phase-name { color: black; }
  .stat, .chain-stage, .mech-card, .block, .risk-grid li, .dv-chart, .profile-stage {
    background: white; border: 1px solid #999; box-shadow: none;
  }
  a { color: black; text-decoration: underline; }
  .accent, .stat-unit, .section-num, .phase-time, .block-id { color: #006850; }
  .site-footer { background: white; }
}
 
/* ─────────────────────────────────────────────
   REDUCED MOTION
   ───────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
  .scroll-cue, .pulse-dot { animation: none; }
}
