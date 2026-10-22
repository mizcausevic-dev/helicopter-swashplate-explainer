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
