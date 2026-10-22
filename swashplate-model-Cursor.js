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
