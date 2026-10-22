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
