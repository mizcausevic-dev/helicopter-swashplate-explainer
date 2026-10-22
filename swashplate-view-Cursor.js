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
