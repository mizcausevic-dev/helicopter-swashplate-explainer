/**
 * Helicopter main-rotor swash plate, illustrative kinematics.
 *
 * Component roles follow FAA-H-8083-21B Chapter 4 (swash plate assembly):
 * stationary ring, anti-drive link, rotating ring on a uniball sleeve,
 * drive links, pitch links, and pitch horns. Both rings tilt and slide
 * as one unit.
 *
 * This file does not encode a type design. Servo clocking, horn sense,
 * blade count, tilt size, and rotor rate are explicit illustration choices.
 * Aerodynamic disc response is not computed.
 *
 * Timeline: 1,020 frames, index 0 to 1019, 30 fps, playback length 34.000 s.
 */

export const FRAME_COUNT = 1020;
export const FPS = 30;
export const DURATION_S = FRAME_COUNT / FPS;

export const PALETTE = {
  stage: "#0B1019",
  metal: "#344257",
  cyan: "#00E5FF",
  gold: "#FFD166",
  violet: "#9D4EDD",
  ink: "#E7EDF5",
  muted: "#9AA6B6",
};

/** Illustrative geometry in model units. Not aircraft dimensions. */
export const GEO = {
  mastR: 0.062,
  plateIn: 0.15,
  plateOut: 0.36,
  plateHalfT: 0.028,
  ringGap: 0.078,
  lugR: 0.33,
  hornLen: 0.42,
  hornRadial: 0.38,
  hornY: 1.02,
  bladeRoot: 0.34,
  bladeLen: 2.05,
  hubY: 1.12,
  hubR: 0.13,
  hRest: 0.46,
  hRise: 0.16,
  betaMax: 0.24,
  psiHigh: 0,
  servoR: 0.56,
  servoY: 0.1,
  servoAz: [Math.PI * 0.92, Math.PI * 0.92 + (2 * Math.PI) / 3, Math.PI * 0.92 + (4 * Math.PI) / 3],
  driveAz: [0.35, Math.PI + 0.35],
  antiAz: 2.15,
  bracket: [-0.78, 0.2, 0.28],
  scissorA: 0.64,
  scissorB: 0.64,
  ballR: 0.1,
};

export const STAGES = [
  { id: "rings", start: 0, end: 149, title: "Rings and links", clock: "0:00 to 0:05" },
  { id: "collective", start: 150, end: 299, title: "Collective translation", clock: "0:05 to 0:10" },
  { id: "cyclic", start: 300, end: 509, title: "Cyclic tilt", clock: "0:10 to 0:17" },
  { id: "feather", start: 510, end: 749, title: "Pitch link and feather", clock: "0:17 to 0:25" },
  { id: "response", start: 750, end: 1019, title: "Rotor state", clock: "0:25 to 0:34" },
];

export const SOURCE = {
  handbook: "FAA-H-8083-21B, Helicopter Flying Handbook",
  swashUrl: "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch04.pdf",
  controlsUrl: "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch03.pdf",
};

const NARRATION = [
  "The swash plate converts stationary pilot inputs into rotating blade inputs. The lower ring does not rotate. An anti-drive link holds it. The upper ring is driven with the mast and keeps a fixed relationship to the rotor. Both rings tilt and slide as one unit. A later cut in this shot is only a viewing plane through the uniball sleeve.",
  "Collective raises the whole unit. In this illustrated linkage every pitch link moves together, so every blade changes feather together. The handbook describes that pilot result: raising the collective increases the pitch angle of all main rotor blades equally. Horn and rod geometry that produces the sense is design-specific.",
  "Cyclic tilts the stationary ring and holds that tilt in the helicopter frame. The rotating ring turns in the tilted plane, so each pitch link rises and falls once per revolution. Tilt size is exaggerated. The three rods are a schematic input pattern, not a specific control system.",
  "One pitch link, followed. Its rise and fall rotates the pitch horn and feathers that blade about the spanwise feathering axis. The other blades stay in view because they share the ring. Lug clocking is simplified. Real clocking sets control phase and depends on the design.",
  "The view returns to the whole rotor. At this instant the blades show different feather angles because they sit at different azimuths on a tilted plate. The violet plot is that mechanical state. It is not a map of rotor-disc tilt. Disc response is omitted: phase depends on the rotor, and there is no universal same-azimuth result.",
];

export function stageAt(frame) {
  const f = clampFrame(frame);
  for (let i = 0; i < STAGES.length; i++) {
    if (f <= STAGES[i].end) return { ...STAGES[i], index: i };
  }
  return { ...STAGES[4], index: 4 };
}

export function narration(frame) {
  return NARRATION[stageAt(frame).index];
}

export function timecode(frame) {
  const ms = Math.round(clampFrame(frame) * 1000 / FPS);
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  const frac = ms % 1000;
  return `${m}:${String(rem).padStart(2, "0")}.${String(frac).padStart(3, "0")}`;
}

function clampFrame(frame) {
  if (frame < 0) return 0;
  if (frame > 1019) return 1019;
  return frame;
}

export function smootherstep(t) {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function window01(frame, a, b) {
  if (frame <= a || frame >= b) return frame >= b ? 1 : 0;
  return smootherstep((frame - a) / (b - a));
}

function omega(frame) {
  const keys = [
    [0, 0.008],
    [149, 0.01],
    [300, 0.012],
    [345, 0.072],
    [490, 0.072],
    [545, 0.031],
    [730, 0.031],
    [900, 0.012],
    [980, 0],
    [1019, 0],
  ];
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, w0] = keys[i];
    const [f1, w1] = keys[i + 1];
    if (frame <= f1) {
      const t = (frame - f0) / (f1 - f0);
      return lerp(w0, w1, t);
    }
  }
  return 0;
}

const THETA = (() => {
  const out = new Array(FRAME_COUNT);
  let theta = 0;
  out[0] = 0;
  for (let f = 0; f < FRAME_COUNT - 1; f++) {
    theta += 0.5 * (omega(f) + omega(f + 1));
    out[f + 1] = theta;
  }
  return out;
})();

export function rotorTheta(frame) {
  return THETA[clampFrame(frame)];
}

export function collectiveAmount(frame) {
  return window01(frame, 150, 236);
}

export function cyclicAmount(frame) {
  return window01(frame, 300, 430);
}

export function sectionAmount(frame) {
  const f = clampFrame(frame);
  if (f < 96) return 0;
  if (f < 132) return smootherstep((f - 96) / 36);
  if (f < 150) return 1;
  if (f < 188) return 1 - smootherstep((f - 150) / 38);
  return 0;
}

export function pose(frame) {
  const f = clampFrame(frame);
  const collective = collectiveAmount(f);
  const cyclic = cyclicAmount(f);
  return {
    frame: f,
    collective,
    cyclic,
    section: sectionAmount(f),
    theta: THETA[f],
    h: GEO.hRest + collective * GEO.hRise,
    beta: cyclic * GEO.betaMax,
    psiHigh: GEO.psiHigh,
    omega: omega(f),
  };
}

export function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function add(a, b, c, d) {
  const x = a[0] + b[0] + (c ? c[0] : 0) + (d ? d[0] : 0);
  const y = a[1] + b[1] + (c ? c[1] : 0) + (d ? d[1] : 0);
  const z = a[2] + b[2] + (c ? c[2] : 0) + (d ? d[2] : 0);
  return [x, y, z];
}

export function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function scale(a, s) {
  return [a[0] * s, a[1] * s, a[2] * s];
}

export function hypot3(a) {
  return Math.hypot(a[0], a[1], a[2]);
}

export function normalize(a) {
  const n = hypot3(a) || 1;
  return [a[0] / n, a[1] / n, a[2] / n];
}

export function lerp3(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function rodrigues(v, k, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const d = dot(k, v);
  const cr = cross(k, v);
  return [
    v[0] * c + cr[0] * s + k[0] * d * (1 - c),
    v[1] * c + cr[1] * s + k[1] * d * (1 - c),
    v[2] * c + cr[2] * s + k[2] * d * (1 - c),
  ];
}

export function plateBasis(h, beta, psiHigh) {
  const center = [0, h, 0];
  const high = [Math.cos(psiHigh), 0, -Math.sin(psiHigh)];
  let axis = [high[2], 0, -high[0]];
  const alen = Math.hypot(axis[0], axis[1], axis[2]);
  axis = alen < 1e-8 ? [0, 0, 1] : [axis[0] / alen, axis[1] / alen, axis[2] / alen];
  const normal = normalize(rodrigues([0, 1, 0], axis, -beta));
  const t1 = normalize(rodrigues([1, 0, 0], axis, -beta));
  const t2 = normalize(rodrigues([0, 0, 1], axis, -beta));
  return { center, normal, t1, t2, axis };
}

export function onPlate(basis, azimuth, radius, normalOffset = 0) {
  const c = Math.cos(azimuth);
  const s = Math.sin(azimuth);
  return add(
    basis.center,
    scale(basis.t1, radius * c),
    scale(basis.t2, -radius * s),
    scale(basis.normal, normalOffset),
  );
}

export function radialAt(azimuth) {
  return [Math.cos(azimuth), 0, -Math.sin(azimuth)];
}

export function tangentAt(azimuth) {
  return [-Math.sin(azimuth), 0, -Math.cos(azimuth)];
}

function dist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

let restLinkLength = null;

function hornTip(azimuth, feather) {
  const axis = scale(radialAt(azimuth), GEO.hornRadial);
  axis[1] = GEO.hornY;
  const tip = add(
    axis,
    scale(tangentAt(azimuth), GEO.hornLen * Math.cos(feather)),
    scale([0, 1, 0], GEO.hornLen * Math.sin(feather)),
  );
  return { axis, tip };
}

function linkLengthAt(frame, azimuth, feather) {
  const p = pose(frame);
  const basis = plateBasis(p.h, p.beta, p.psiHigh);
  const lug = onPlate(basis, azimuth, GEO.lugR, GEO.ringGap);
  return dist(lug, hornTip(azimuth, feather).tip);
}

function neutralLinkLength() {
  if (restLinkLength == null) restLinkLength = linkLengthAt(0, 0, 0);
  return restLinkLength;
}

export function solveFeather(lug, azimuth) {
  const target = neutralLinkLength();
  const tipAt = (phi) => hornTip(azimuth, phi).tip;
  const error = (phi) => dist(tipAt(phi), lug) - target;
  let phi = 0;
  let best = Infinity;
  for (let i = 0; i <= 28; i++) {
    const guess = -0.2 + (1.5 * i) / 28;
    const e = Math.abs(error(guess));
    if (e < best) {
      best = e;
      phi = guess;
    }
  }
  for (let k = 0; k < 12; k++) {
    const e = error(phi);
    const d = (error(phi + 1e-4) - error(phi - 1e-4)) / 2e-4;
    if (Math.abs(d) < 1e-8) break;
    phi -= e / d;
  }
  return { feather: phi, residual: error(phi), tip: tipAt(phi), axis: hornTip(azimuth, phi).axis };
}

export function bladeAzimuth(frame, index) {
  return rotorTheta(frame) + index * (Math.PI / 2);
}

export function bladeStates(frame) {
  const p = pose(frame);
  const basis = plateBasis(p.h, p.beta, p.psiHigh);
  const blades = [];
  for (let i = 0; i < 4; i++) {
    const azimuth = bladeAzimuth(frame, i);
    const lug = onPlate(basis, azimuth, GEO.lugR, GEO.ringGap);
    const solved = solveFeather(lug, azimuth);
    blades.push({
      index: i,
      name: "ABCD"[i],
      azimuth,
      feather: solved.feather,
      residual: solved.residual,
      lug,
      tip: solved.tip,
      axis: solved.axis,
      radial: radialAt(azimuth),
      tangent: tangentAt(azimuth),
    });
  }
  return blades;
}

export function stationaryLugs(frame) {
  const p = pose(frame);
  const basis = plateBasis(p.h, p.beta, p.psiHigh);
  return GEO.servoAz.map((azimuth, i) => ({
    index: i,
    azimuth,
    lug: onPlate(basis, azimuth, GEO.lugR, 0),
    base: [
      Math.cos(azimuth) * GEO.servoR,
      GEO.servoY,
      -Math.sin(azimuth) * GEO.servoR,
    ],
  }));
}

export function driveLinks(frame) {
  const p = pose(frame);
  const basis = plateBasis(p.h, p.beta, p.psiHigh);
  return GEO.driveAz.map((offset) => {
    const azimuth = p.theta + offset;
    const upper = [
      Math.cos(azimuth) * 0.12,
      0.86,
      -Math.sin(azimuth) * 0.12,
    ];
    const lower = onPlate(basis, azimuth, GEO.plateOut - 0.02, GEO.ringGap);
    return { azimuth, upper, lower };
  });
}

export function sphereHinge(a, b, la, lb, prefer) {
  const delta = sub(b, a);
  const d = hypot3(delta) || 1e-8;
  const ex = scale(delta, 1 / d);
  const along = (la * la - lb * lb + d * d) / (2 * d);
  const h2 = la * la - along * along;
  const h = Math.sqrt(Math.max(0, h2));
  const mid = add(a, scale(ex, along));
  let side = sub(prefer, scale(ex, dot(prefer, ex)));
  if (hypot3(side) < 1e-6) side = [0, 1, 0];
  side = normalize(side);
  return {
    hinge: add(mid, scale(side, h)),
    reach: d <= la + lb + 1e-6 && d + 1e-6 >= Math.abs(la - lb) && h2 >= -1e-6,
    separation: d,
  };
}

export function antiDrive(frame) {
  const p = pose(frame);
  const basis = plateBasis(p.h, p.beta, p.psiHigh);
  const lug = onPlate(basis, GEO.antiAz, GEO.plateOut + 0.01, 0);
  const prefer = add(normalize([lug[0], 0.35, lug[2]]), [0, 0.45, 0]);
  const solved = sphereHinge(GEO.bracket, lug, GEO.scissorA, GEO.scissorB, prefer);
  return { lug, bracket: GEO.bracket, hinge: solved.hinge, reach: solved.reach, separation: solved.separation };
}

export function featherSeries(frame, samples = 72) {
  const p = pose(frame);
  const basis = plateBasis(p.h, p.beta, p.psiHigh);
  const rows = [];
  for (let i = 0; i <= samples; i++) {
    const azimuth = (i / samples) * Math.PI * 2;
    const lug = onPlate(basis, azimuth, GEO.lugR, GEO.ringGap);
    const solved = solveFeather(lug, azimuth);
    rows.push({
      azimuth,
      deg: (azimuth * 180) / Math.PI,
      feather: solved.feather,
      featherDeg: (solved.feather * 180) / Math.PI,
    });
  }
  return rows;
}

const CAM_KEYS = [
  { f: 0, pos: [4.15, 2.55, 3.75], look: [0, 0.62, 0], fov: 38 },
  { f: 78, pos: [3.65, 2.28, 3.3], look: [0, 0.58, 0], fov: 36 },
  { f: 149, pos: [-2.7, 1.42, 2.95], look: [0, 0.55, 0], fov: 32 },
  { f: 230, pos: [1.4, 2.7, 4.15], look: [0, 0.7, 0], fov: 36 },
  { f: 299, pos: [4.35, 1.7, 1.85], look: [0, 0.72, 0], fov: 34 },
  { f: 509, pos: [-1.15, 3.7, 3.55], look: [0, 0.62, 0], fov: 36 },
];

const HERO = { pos: [4.45, 3.15, 4.05], look: [0, 0.72, 0], fov: 38 };

function interpKeys(frame) {
  let a = CAM_KEYS[0];
  let b = CAM_KEYS[CAM_KEYS.length - 1];
  for (let i = 0; i < CAM_KEYS.length - 1; i++) {
    if (frame >= CAM_KEYS[i].f && frame <= CAM_KEYS[i + 1].f) {
      a = CAM_KEYS[i];
      b = CAM_KEYS[i + 1];
      break;
    }
  }
  const span = b.f - a.f || 1;
  const t = smootherstep((frame - a.f) / span);
  return {
    pos: lerp3(a.pos, b.pos, t),
    look: lerp3(a.look, b.look, t),
    fov: lerp(a.fov, b.fov, t),
  };
}

function followCamera(frame) {
  const blade = bladeStates(frame)[0];
  const pos = add(blade.tip, scale(blade.tangent, -1.85), [0, 1.25, 0], scale(blade.radial, 1.05));
  const look = lerp3(blade.lug, blade.axis, 0.35);
  return { pos, look, fov: 38 };
}

export function camera(frame) {
  const f = clampFrame(frame);
  if (f <= 509) return interpKeys(f);
  const follow = followCamera(f);
  if (f <= 749) {
    const from = interpKeys(509);
    const u = smootherstep(Math.min(1, (f - 510) / 86));
    return {
      pos: lerp3(from.pos, follow.pos, u),
      look: lerp3(from.look, follow.look, u),
      fov: lerp(from.fov, follow.fov, u),
    };
  }
  const from = followCamera(749);
  const u = smootherstep(Math.min(1, (f - 750) / (960 - 750)));
  return {
    pos: lerp3(from.pos, HERO.pos, u),
    look: lerp3(from.look, HERO.look, u),
    fov: lerp(from.fov, HERO.fov, u),
  };
}

export function projectPoint(p, cam, width, height) {
  const rel = sub(p, cam.pos);
  const forward = normalize(sub(cam.look, cam.pos));
  const right = normalize(cross(forward, [0, 1, 0]));
  const up = cross(right, forward);
  const z = dot(rel, forward);
  const x = dot(rel, right);
  const y = dot(rel, up);
  if (z < 0.08) return { visible: false, x: 0, y: 0, z };
  const focal = 1 / Math.tan((cam.fov * Math.PI) / 360);
  return {
    visible: true,
    x: (x / z) * focal * (height / 2) + width / 2,
    y: (-y / z) * focal * (height / 2) + height / 2,
    z,
  };
}
