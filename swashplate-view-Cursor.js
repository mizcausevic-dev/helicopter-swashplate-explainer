import {
  DURATION_S,
  FPS,
  FRAME_COUNT,
  GEO,
  SOURCE,
  STAGES,
  antiDrive,
  badges,
  bladeStates,
  camera,
  cross,
  dot,
  driveLinks,
  featherSeries,
  hypot3,
  lerp3,
  narration,
  normalize,
  onPlate,
  plateBasis,
  pose,
  projectPoint,
  safeguardsText,
  scale,
  stageAt,
  stationaryLugs,
  sub,
  timecode,
} from "./swashplate-model-Cursor.js";

const METAL = [52, 66, 87];
const METAL_DARK = [34, 44, 58];
const METAL_DEEP = [24, 31, 42];
const BLADE = [58, 72, 90];
const BRASS = [168, 132, 72];
const LIGHT = normalize([0.32, 0.86, 0.28]);
const FILL = normalize([-0.55, 0.15, -0.45]);

const canvas = document.getElementById("view");
const ctx = canvas.getContext("2d");
const labelsEl = document.getElementById("labels");
const copyEl = document.getElementById("copy");
const chipsEl = document.getElementById("chips");
const plot = document.getElementById("plot");
const playBtn = document.getElementById("play");
const scrub = document.getElementById("scrub");
const stageName = document.getElementById("stage-name");
const stageTitle = document.getElementById("stage-title");
const stageNo = document.getElementById("stage-no");
const timeRead = document.getElementById("time-read");
const chart = document.getElementById("chart");
const dialog = document.getElementById("safeguards");
const safeBody = document.getElementById("safe-body");

const params = new URLSearchParams(location.search);
let frame = clampFrame(Number(params.get("frame") || 0));
let playing = !window.matchMedia("(prefers-reduced-motion: reduce)").matches && params.get("pause") !== "1";
let acc = 0;
let last = performance.now();
let cssW = 1;
let cssH = 1;
let dpr = 1;

safeBody.innerHTML = safeguardsText().map((line) => `<p>${line}</p>`).join("")
  + `<ul>
      <li>What this is: a 34-second, 1,020-frame film of one main-rotor swash plate.</li>
      <li>Who it is for: readers who need the mechanism sequence without a type manual.</li>
      <li>What it refuses: a universal tilt angle, a same-azimuth aerodynamic response, and invented specifications.</li>
      <li>Discovery: the page title names the mechanism. Engagement is play, scrub, and stage jumps. There is no form and no payment.</li>
      <li>Next improvement: replace the illustrative linkage with one aircraft's maintenance-manual geometry after a source review.</li>
    </ul>
    <p>Sources: <a href="${SOURCE.swashUrl}">${SOURCE.handbook}, Chapter 4</a> and <a href="${SOURCE.controlsUrl}">Chapter 3</a>.</p>`;

document.getElementById("open-guard").addEventListener("click", () => dialog.showModal());
document.getElementById("close-guard").addEventListener("click", () => dialog.close());

function clampFrame(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1019, Math.round(value)));
}

function add(a, b, c) {
  return [a[0] + b[0] + (c ? c[0] : 0), a[1] + b[1] + (c ? c[1] : 0), a[2] + b[2] + (c ? c[2] : 0)];
}

function shade(rgb, normal, centroid, camPos, shiny) {
  const n = normal;
  const ndl = Math.max(0, dot(n, LIGHT));
  const fill = Math.max(0, dot(n, FILL));
  const view = normalize(sub(camPos, centroid));
  const rim = (1 - Math.max(0, dot(n, view))) ** 2;
  const amb = 0.5;
  const lit = amb + ndl * 0.62 + fill * 0.22 + rim * 0.14;
  let r = rgb[0] * lit;
  let g = rgb[1] * lit;
  let b = rgb[2] * lit;
  if (shiny) {
    const half = normalize(add(LIGHT, view));
    const spec = Math.max(0, dot(n, half)) ** 48 * 90;
    r += spec;
    g += spec;
    b += spec;
  }
  const c = (v) => Math.max(0, Math.min(255, v)) | 0;
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}

function mix(rgb, t) {
  return [rgb[0] * t, rgb[1] * t, rgb[2] * t];
}

function face(pts, color, clip = true, shiny = false) {
  const centroid = [0, 0, 0];
  for (const p of pts) {
    centroid[0] += p[0];
    centroid[1] += p[1];
    centroid[2] += p[2];
  }
  centroid[0] /= pts.length;
  centroid[1] /= pts.length;
  centroid[2] /= pts.length;
  const n = normalize(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
  return { pts, color, centroid, n, clip, shiny };
}

function addQuad(list, a, b, c, d, color, clip = true, shiny = false) {
  if (hypot3(cross(sub(b, a), sub(d, a))) < 1e-8) return;
  list.push(face([a, b, c, d], color, clip, shiny));
}

function addCylinder(list, a, b, radius, color, segs = 10, clip = true) {
  const axis = sub(b, a);
  const len = hypot3(axis);
  if (len < 1e-5) return;
  const dir = scale(axis, 1 / len);
  const tmp = Math.abs(dir[1]) < 0.92 ? [0, 1, 0] : [1, 0, 0];
  const u = normalize(cross(dir, tmp));
  const v = cross(dir, u);
  const ringA = [];
  const ringB = [];
  for (let i = 0; i < segs; i++) {
    const t = (i / segs) * Math.PI * 2;
    const off = add(scale(u, Math.cos(t) * radius), scale(v, Math.sin(t) * radius));
    ringA.push(add(a, off));
    ringB.push(add(b, off));
  }
  for (let i = 0; i < segs; i++) {
    const j = (i + 1) % segs;
    addQuad(list, ringA[i], ringB[i], ringB[j], ringA[j], color, clip);
  }
  list.push(face(ringB, color, clip));
  list.push(face(ringA.slice().reverse(), color, clip));
}

function addBox(list, center, hx, hy, hz, color) {
  const [x, y, z] = center;
  const p = (sx, sy, sz) => [x + sx * hx, y + sy * hy, z + sz * hz];
  addQuad(list, p(-1, -1, 1), p(1, -1, 1), p(1, 1, 1), p(-1, 1, 1), color);
  addQuad(list, p(1, -1, -1), p(-1, -1, -1), p(-1, 1, -1), p(1, 1, -1), color);
  addQuad(list, p(-1, 1, 1), p(1, 1, 1), p(1, 1, -1), p(-1, 1, -1), color);
  addQuad(list, p(-1, -1, -1), p(1, -1, -1), p(1, -1, 1), p(-1, -1, 1), color);
  addQuad(list, p(1, -1, 1), p(1, -1, -1), p(1, 1, -1), p(1, 1, 1), color);
  addQuad(list, p(-1, -1, -1), p(-1, -1, 1), p(-1, 1, 1), p(-1, 1, -1), color);
}

function addSphere(list, c, radius, color, stacks = 7, slices = 10, shiny = false) {
  for (let i = 0; i < stacks; i++) {
    const t0 = (i / stacks) * Math.PI;
    const t1 = ((i + 1) / stacks) * Math.PI;
    for (let j = 0; j < slices; j++) {
      const p0 = (j / slices) * Math.PI * 2;
      const p1 = ((j + 1) / slices) * Math.PI * 2;
      const v = (t, p) => [
        c[0] + radius * Math.sin(t) * Math.cos(p),
        c[1] + radius * Math.cos(t),
        c[2] + radius * Math.sin(t) * Math.sin(p),
      ];
      addQuad(list, v(t0, p0), v(t1, p0), v(t1, p1), v(t0, p1), color, true, shiny);
    }
  }
}

function addAnnulus(list, basis, yOffset, rIn, rOut, halfT, color) {
  const segs = 48;
  const top = mix(color, 1.18);
  const bot = mix(color, 0.72);
  const ring = (az, rad, sign) => onPlate(basis, az, rad, yOffset + sign * halfT);
  for (let i = 0; i < segs; i++) {
    const a0 = (i / segs) * Math.PI * 2;
    const a1 = ((i + 1) / segs) * Math.PI * 2;
    addQuad(list, ring(a0, rOut, -1), ring(a0, rOut, 1), ring(a1, rOut, 1), ring(a1, rOut, -1), color);
    addQuad(list, ring(a0, rIn, 1), ring(a0, rIn, -1), ring(a1, rIn, -1), ring(a1, rIn, 1), bot);
    addQuad(list, ring(a0, rIn, 1), ring(a1, rIn, 1), ring(a1, rOut, 1), ring(a0, rOut, 1), top);
    addQuad(list, ring(a0, rOut, -1), ring(a1, rOut, -1), ring(a1, rIn, -1), ring(a0, rIn, -1), bot);
  }
}

function addBlade(list, blade, color) {
  const stations = 7;
  const length = 1.82;
  const sections = [];
  const shape = [[0.52, 0], [0.18, 0.42], [-0.22, 0.3], [-0.5, 0], [-0.22, -0.3], [0.18, -0.42]];
  for (let i = 0; i <= stations; i++) {
    const s = i / stations;
    const chord = 0.28 * (1 - s) + 0.07 * s;
    const thick = 0.045 * (1 - s) + 0.012 * s;
    const origin = add(blade.axis, scale(blade.radial, 0.06 + length * s));
    const ct = Math.cos(blade.feather);
    const st = Math.sin(blade.feather);
    const lead = add(scale(blade.tangent, ct), [0, st, 0]);
    const thickAxis = add(scale(blade.tangent, -st), [0, ct, 0]);
    sections.push(shape.map(([lc, tc]) => add(origin, scale(lead, lc * chord), scale(thickAxis, tc * thick))));
  }
  for (let i = 0; i < stations; i++) {
    const a = sections[i];
    const b = sections[i + 1];
    for (let k = 0; k < shape.length; k++) {
      const j = (k + 1) % shape.length;
      addQuad(list, a[k], b[k], b[j], a[j], color);
    }
  }
  list.push(face(sections[0], mix(color, 0.8)));
  list.push(face(sections[stations].slice().reverse(), mix(color, 1.1)));
}

function buildScene(frame) {
  const faces = [];
  const p = pose(frame);
  const basis = plateBasis(p.h, p.beta, p.psiHigh);
  const blades = bladeStates(frame);
  const servos = stationaryLugs(frame);
  const drives = driveLinks(frame);
  const scissor = antiDrive(frame);
  const stage = stageAt(frame).id;
  const focus = stage === "feather" ? 0 : -1;

  addBox(faces, [0, -0.08, 0], 0.46, 0.16, 0.34, METAL_DEEP);
  addCylinder(faces, [0, -0.12, 0], [0, 1.2, 0], GEO.mastR, METAL_DARK, 24);
  addCylinder(faces, [0, p.h - 0.09, 0], [0, p.h + 0.05, 0], 0.09, METAL, 20);
  addSphere(faces, [0, p.h, 0], GEO.ballR, [150, 164, 180], 12, 18, true);
  addAnnulus(faces, basis, 0, GEO.plateIn, GEO.plateOut, GEO.plateHalfT, METAL);
  addAnnulus(faces, basis, GEO.ringGap, GEO.plateIn + 0.015, GEO.plateOut - 0.02, GEO.plateHalfT * 0.92, [62, 78, 100]);
  addCylinder(faces, [0, 0.98, 0], [0, 1.22, 0], GEO.hubR, METAL, 28);

  for (let i = 0; i < 12; i++) {
    const az = p.theta + (i / 12) * Math.PI * 2;
    const c = onPlate(basis, az, (GEO.plateIn + GEO.plateOut) * 0.5, GEO.ringGap * 0.5);
    addSphere(faces, c, 0.012, [176, 186, 198], 4, 6, true);
  }

  servos.forEach((servo) => {
    const top = add(servo.base, [0, 0.12, 0]);
    addCylinder(faces, servo.base, top, 0.028, METAL_DARK, 8);
    addCylinder(faces, top, servo.lug, 0.012, METAL, 6);
    const band = add(top, scale(sub(servo.lug, top), 0.16));
    addSphere(faces, band, 0.02, BRASS, 4, 6);
  });

  addCylinder(faces, scissor.bracket, scissor.hinge, 0.012, METAL, 6);
  addCylinder(faces, scissor.hinge, scissor.lug, 0.012, METAL, 6);
  addSphere(faces, scissor.hinge, 0.02, METAL, 4, 6);

  drives.forEach((link) => addCylinder(faces, link.upper, link.lower, 0.011, METAL, 6));

  blades.forEach((blade) => {
    const dim = focus === 0 && blade.index !== 0 ? 0.62 : 1;
    const color = mix(BLADE, dim);
    addCylinder(faces, add(scale(blade.radial, 0.13), [0, GEO.hornY, 0]), blade.axis, 0.02, mix(METAL, dim), 8);
    addCylinder(faces, blade.axis, blade.tip, 0.014, mix(METAL, dim), 6);
    addSphere(faces, blade.tip, 0.02, mix([140, 152, 168], dim), 4, 6);
    addCylinder(faces, blade.lug, blade.tip, 0.016, mix(METAL, dim), 6);
    addBlade(faces, blade, color);
  });

  return { faces, p, basis, blades, servos, drives, scissor, stage };
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  dpr = Math.min(2, window.devicePixelRatio || 1);
  cssW = Math.max(1, rect.width);
  cssH = Math.max(1, rect.height);
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
}

function project(p, cam) {
  return projectPoint(p, cam, cssW, cssH);
}

function drawGrid(cam) {
  ctx.save();
  ctx.lineWidth = dpr;
  ctx.strokeStyle = "rgba(52, 66, 87, 0.45)";
  ctx.beginPath();
  for (let i = -4; i <= 4; i++) {
    line3([-4, 0, i], [4, 0, i], cam);
    line3([i, 0, -4], [i, 0, 4], cam);
  }
  ctx.stroke();
  ctx.strokeStyle = "rgba(154, 166, 182, 0.8)";
  ctx.lineWidth = 1.5 * dpr;
  ctx.beginPath();
  line3([0.4, 0.002, 0], [1.15, 0.002, 0], cam);
  line3([1.15, 0.002, 0], [0.98, 0.002, 0.1], cam);
  line3([1.15, 0.002, 0], [0.98, 0.002, -0.1], cam);
  ctx.stroke();
  const fwd = project([1.28, 0.02, 0], cam);
  if (fwd.visible) {
    ctx.fillStyle = "#9aa6b6";
    ctx.font = `${11 * dpr}px ${getComputedStyle(document.body).fontFamily}`;
    ctx.fillText("FWD", fwd.x * dpr + 4, fwd.y * dpr);
  }
  ctx.restore();
}

function line3(a, b, cam) {
  const pa = project(a, cam);
  const pb = project(b, cam);
  if (!pa.visible || !pb.visible) return;
  ctx.moveTo(pa.x * dpr, pa.y * dpr);
  ctx.lineTo(pb.x * dpr, pb.y * dpr);
}

function strokeLoop(points, cam, color, width, dash) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width * dpr;
  ctx.setLineDash(dash ? dash.map((n) => n * dpr) : []);
  ctx.beginPath();
  let started = false;
  for (const p of points) {
    const q = project(p, cam);
    if (!q.visible) continue;
    if (!started) {
      ctx.moveTo(q.x * dpr, q.y * dpr);
      started = true;
    } else ctx.lineTo(q.x * dpr, q.y * dpr);
  }
  ctx.stroke();
  ctx.restore();
}

function ghostRing(cam, h) {
  const basis = plateBasis(h, 0, 0);
  const pts = [];
  for (let i = 0; i <= 48; i++) pts.push(onPlate(basis, (i / 48) * Math.PI * 2, GEO.plateOut, 0));
  strokeLoop(pts, cam, "rgba(154,166,182,0.45)", 1.2, [5, 5]);
}

function plateRim(basis, cam, color, width) {
  const pts = [];
  for (let i = 0; i <= 64; i++) pts.push(onPlate(basis, (i / 64) * Math.PI * 2, GEO.plateOut, GEO.plateHalfT));
  strokeLoop(pts, cam, color, width, [7, 5]);
}

function paintScene(scene, cam) {
  const { faces, p } = scene;
  const drawn = [];
  for (const f of faces) {
    const inStack = f.centroid[1] > p.h - 0.16 && f.centroid[1] < p.h + GEO.ringGap + 0.12;
    const cutAway = p.section > 0.82 && f.clip && inStack && f.centroid[0] < -0.02;
    if (cutAway) continue;
    const toCam = normalize(sub(cam.pos, f.centroid));
    if (dot(f.n, toCam) <= 0.02) continue;
    const depth = hypot3(sub(f.centroid, cam.pos));
    const alpha = p.section > 0.2 && f.clip && inStack && f.centroid[0] < -0.02 ? 1 - p.section : 1;
    drawn.push({ f, depth, alpha });
  }
  drawn.sort((a, b) => b.depth - a.depth);
  for (const item of drawn) {
    ctx.beginPath();
    let ok = true;
    item.f.pts.forEach((p3, i) => {
      const q = project(p3, cam);
      if (!q.visible) ok = false;
      if (i === 0) ctx.moveTo(q.x * dpr, q.y * dpr);
      else ctx.lineTo(q.x * dpr, q.y * dpr);
    });
    if (!ok) continue;
    ctx.closePath();
    ctx.fillStyle = shade(item.f.color, item.f.n, item.f.centroid, cam.pos, item.f.shiny);
    ctx.globalAlpha = Math.max(0, item.alpha);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawSection(scene, cam) {
  const { p } = scene;
  if (p.section < 0.45) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, (p.section - 0.45) / 0.35);
  ctx.fillStyle = "#243140";
  ctx.strokeStyle = "rgba(0, 229, 255, 0.7)";
  ctx.lineWidth = 1.25 * dpr;
  fillCircle([0.004, p.h, 0], GEO.ballR, cam);
  ctx.stroke();
  ctx.strokeStyle = "rgba(231, 237, 245, 0.55)";
  strokeCircle([0.004, p.h, 0], GEO.mastR, cam);
  ctx.fillStyle = "#3d4e64";
  rectSection(p.h, 0, GEO.plateHalfT, GEO.plateIn, GEO.plateOut, cam);
  rectSection(p.h, GEO.ringGap, GEO.plateHalfT * 0.92, GEO.plateIn + 0.015, GEO.plateOut - 0.02, cam);
  ctx.restore();
}

function rectSection(h, lift, halfT, rIn, rOut, cam) {
  for (const sign of [1, -1]) {
    const y0 = h + lift - halfT;
    const y1 = h + lift + halfT;
    const z0 = sign * rIn;
    const z1 = sign * rOut;
    const pts = [[0.004, y0, z0], [0.004, y1, z0], [0.004, y1, z1], [0.004, y0, z1]];
    ctx.beginPath();
    pts.forEach((p, i) => {
      const q = project(p, cam);
      if (i === 0) ctx.moveTo(q.x * dpr, q.y * dpr);
      else ctx.lineTo(q.x * dpr, q.y * dpr);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

function fillCircle(c, r, cam) {
  ctx.beginPath();
  for (let i = 0; i <= 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const q = project([c[0], c[1] + Math.cos(a) * r, c[2] + Math.sin(a) * r], cam);
    if (i === 0) ctx.moveTo(q.x * dpr, q.y * dpr);
    else ctx.lineTo(q.x * dpr, q.y * dpr);
  }
  ctx.fill();
}

function strokeCircle(c, r, cam) {
  ctx.beginPath();
  for (let i = 0; i <= 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const q = project([c[0], c[1] + Math.cos(a) * r, c[2] + Math.sin(a) * r], cam);
    if (i === 0) ctx.moveTo(q.x * dpr, q.y * dpr);
    else ctx.lineTo(q.x * dpr, q.y * dpr);
  }
  ctx.stroke();
}
