# Helicopter swash plate

Live film: https://mizcausevic-dev.github.io/helicopter-swashplate-explainer/

Deterministic 34-second anatomy film of a single main-rotor swash plate. 1,020 frames, index 0 to 1019, at 30 fps. GitHub Pages serves this repository from the `pages` branch.

This is an explanatory model, not a certified engineering reference, a maintenance instruction, or a flight procedure.

## What is on screen

Hardware names follow FAA-H-8083-21B, Helicopter Flying Handbook, Chapter 4: stationary swash plate, anti-drive link, rotating swash plate on a uniball sleeve, drive links, pitch links, and pitch horns. Both plates tilt and slide as one unit.

Chapter 3 is the source for the collective pilot result used here: raising collective increases the pitch of all main rotor blades equally.

The film does not draw rotor-disc tilt. Chapter 4 says a control input is usually realized about 90 degrees prior in the direction of rotation, and that designers rig the controls so forward cyclic still produces nominally forward aircraft motion. Linkage sense, servo layout, blade count, tilt size, and rotor rate in this film are illustrative.

- Cyan marks the primary control pathway.
- Gold marks actuation.
- Violet marks mechanical state.
- Those colors are annotations, not glowing hardware.

## Timeline

| Frames | Clock | What changes |
| --- | --- | --- |
| 0 to 149 | 0:00 to 0:05 | Rings, anti-drive link, drive links, then a section plane through the uniball sleeve |
| 150 to 299 | 0:05 to 0:10 | Collective raises the whole unit. Every illustrated blade feather changes together |
| 300 to 509 | 0:10 to 0:17 | Cyclic holds a tilt in the helicopter frame while the rotating ring turns |
| 510 to 749 | 0:17 to 0:25 | One pitch link is followed into the pitch horn and the feathering axis |
| 750 to 1019 | 0:25 to 0:34 | Pull back to the full rotor and hold |

Rotor rate is slowed. Control inputs are shown in sequence. Plate tilt is exaggerated. Blade chord is enlarged. Each of those is labeled on the film.

## Check the linkage

```bash
node verify-swashplate-Cursor.mjs
```

The audit checks collective equality, cyclic high-side azimuth, stationary-ring invariance, pitch-link length, scissor reach, and camera continuity. It does not claim aerodynamic truth.

## View it

Keyboard: Space plays or pauses. Arrow keys step one frame. Home and End jump to the ends. Keys 1 through 5 jump to stages. Playback starts paused when the browser requests reduced motion.

## Sources

- [FAA-H-8083-21B Chapter 4](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch04.pdf)
- [FAA-H-8083-21B Chapter 3](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch03.pdf)

## About and topics

About: Deterministic 34-second anatomy film of a helicopter main-rotor swash plate, with collective, cyclic, and feathering labeled as an explanatory model.

Topics: helicopter, swashplate, aerospace, rotorcraft, kinematics, mechanical-engineering, educational-animation, aviation, engineering-visualization
