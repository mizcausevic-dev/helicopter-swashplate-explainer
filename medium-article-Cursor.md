# Publish sheet

- SEO title: How a Helicopter Swashplate Works
- H1: How a Helicopter Swashplate Changes Blade Pitch
- Subtitle: Two rings, one mast, and the step from stick to feather that most diagrams skip.
- Slug: how-a-helicopter-swashplate-works
- Meta description: A helicopter swashplate keeps one ring still and one spinning. Follow collective and cyclic to the pitch link, and see why disc tilt is not the same azimuth.
- Canonical for the film: https://mizcausevic-dev.github.io/helicopter-swashplate-explainer/
- Tags: Helicopter, Aviation, Aerospace Engineering, Mechanical Engineering, Flight Controls
- Primary keyword: helicopter swashplate
- Secondary: swash plate, collective pitch, cyclic control, pitch link, blade feather

---

# How a Helicopter Swashplate Changes Blade Pitch

A helicopter swashplate is the part that lets a pilot move a stick that does not spin, and still change the pitch of blades that do. The mechanism is older than most of the aircraft that use it. The confusion around it is newer, and mostly comes from pictures that finish a sentence the hardware never started.

The Federal Aviation Administration describes the job in one line. The swash plate converts stationary control inputs from the pilot into rotating inputs that can be connected to the rotor blades. That sentence is the whole machine. Everything else is how the conversion is built, and where a drawing should stop.

If you want the motion before the prose, the 34-second film is here: [helicopter swashplate explainer](https://mizcausevic-dev.github.io/helicopter-swashplate-explainer/). It is an anatomy model, not a type design and not a flight lesson. Scrub it. The same frame always draws the same picture.

## Two rings share one center

FAA-H-8083-21B, the Helicopter Flying Handbook, Chapter 4, splits the assembly in two.

The stationary swash plate sits around the main rotor mast. Pushrods from the cyclic and collective controls reach it. An anti-drive link keeps it from rotating. It can still tilt in any direction, and it can slide up and down the mast.

The rotating swash plate is mounted to that stationary plate by a uniball sleeve. Drive links tie it to the mast, so it turns in a fixed relationship with the rotor. It does not invent its own tilt. Both plates tilt and slide as one unit. Pitch links then run from the rotating plate to the pitch horns on the blades.

Read that again as a path, not a parts list.

Stick and levers stay in the helicopter. Pushrods move the lower ring. The lower ring cannot spin, because the anti-drive link holds it. The upper ring is free to spin with the mast, and it is forced to copy the lower ring's height and tilt. Each pitch link takes that copied position out to one blade.

The film's first five seconds are only that path. A section plane opens through the uniball sleeve so the ball is visible. The cut is a viewing plane. The rotor is not taken apart.

Names vary by shop and by drawing. Some people write swashplate as one word. The handbook uses swash plate. The hardware does not care. The direction of the linkage does. A pitch horn can be arranged so that an upward link increases blade pitch, or so that it decreases it. This model uses one illustrated sense and says so. It is not a claim about every helicopter.

## Collective moves every blade the same way

Collective is the control that asks the rotor for more or less thrust from the whole disc, rather than from one side of it.

Chapter 3 of the same handbook states the pilot result without decoration. As the collective pitch control is raised, there is a simultaneous and equal increase in pitch angle of all main rotor blades. Lowering collective decreases that pitch equally.

Mechanically, the swashplate does this by translation. The whole pair of rings rises or drops on the mast. Every pitch link sees the same change, so every blade feathers together. In the film, that is seconds 5 through 10. At the midpoint of the rise, the four illustrated blades sit on the same feather angle. A plot of feather against azimuth is a flat line. Flat is the point. If the line had a wave in it, the control would no longer be collective.

The handbook describes the result at the blade. It does not freeze the rod geometry. Another aircraft can get the same pilot result with the opposite horn sense, a different number of servos, or a mixer you never see from outside. The film uses three schematic rods and labels them as a pattern, not as a hydraulic model of a named type.

## Cyclic holds a tilt while the ring turns

Cyclic is the control that asks the rotor to tilt, so the helicopter moves forward, back, or sideways. The swashplate's contribution is still mechanical, and it is easy to overclaim.

The pilot tilts the stationary ring and the rigging holds that tilt in the helicopter's frame. The ring does not chase the blades. The rotating ring turns inside that tilted plane. A pitch link on the high side of the plate is up. A quarter turn later, the same link is on the way down. One revolution, one rise and fall.

That is why the control is called cyclic. The feathering angle of each blade changes as the blade goes around. Chapter 4 puts it in operational language: the magnitude of lift follows collective, and the location of that lift follows pitch and roll, because feather changes with rotation.

In the film, seconds 10 through 17 hold an exaggerated tilt while the upper ring makes a little more than two slow turns. The exaggeration is labeled. A real swashplate tilt is small. A teaching picture that uses a flight-sized tilt looks like a flat washer. The sine wave on the violet plot is the honest part: feather against azimuth, one peak at the high side of the plate, one trough opposite it. Gold dots mark the four blades on that curve.

Four blades are a display choice. Helicopters fly with two, three, four, five, and more. The wave does not require four. Four makes the once-per-turn change visible without hiding the other blades.

## One pitch link is the whole lesson

Follow a single pitch link and the rest of the system gets quieter, which is what seconds 17 through 25 do.

The link runs from a lug on the rotating ring to the pitch horn. The horn is a lever on the blade root. Vertical motion of the link rotates the blade about its feathering axis, the spanwise axis the handbook calls the pitch change axis. The blade's leading edge comes up or goes down. That angle is feather. Feather changes the blade's angle of attack only after the air is in the story. The link itself does not know about air.

The other blades stay in the frame because they share the ring. If a diagram isolates one blade and erases the plate, it has thrown away the cause. Lug clocking in the film is simplified. On a real rotor, where the lug sits relative to the blade is part of how the controls are phased. That clocking is design work. It is not a universal number you can copy off a screenshot.

Two labels sit on this shot for a reason. The viewpoint is closer, and the blade chord is drawn larger than a scale model would allow. Part size did not change. The camera did. Rotor rate is slowed for the whole film. Nothing on the plate is a flight rpm.

## The disc does not owe you the same azimuth

Here is the sentence that bad swashplate graphics skip, and that this one refuses to draw.

A tilted swashplate gives you a once-per-turn change in blade pitch. It does not, by itself, tell you where the rotor disc tilts. The blade has to fly to the new angle. It flaps. A rotor is a large spinning mass, and it behaves somewhat like a gyroscope.

Chapter 4 says a control input is usually realized on the attached body at a position 90 degrees prior to the control input displacement in the axis of rotation. Designers place the control inputs so that a forward cyclic stick still produces nominally forward aircraft motion. The effect is made transparent to the pilot. "Usually" is the handbook's word. Hinge offset, flap hinge, delta hinge geometry, and control phasing all move the result. There is no universal tilt angle, and there is no same-azimuth aerodynamic response you can stamp on every rotor.

So the violet plot in the film is mechanical state. Peak feather sits at the high side of this illustrated plate. That peak is not an arrow that says "the disc tilts here." If a poster draws that arrow at a fixed 90 degrees and calls it the physics, it has promoted a rigging outcome into a law.

You can still use the 90-degree figure. Use it the way the handbook does: as the usual gyroscopic offset that the control system is built to hide from the person holding the stick. Then go read the rotor you actually have.

## What the 34 seconds refuse to invent

The film is 1,020 frames at 30 frames per second. Frame 0 is the first picture. Frame 1019 is the last. Playback length is 34 seconds. Those numbers describe the movie, not the aircraft.

What the movie will not show:

- A flight rpm, a blade angle from a maintenance manual, or a load.
- A claim that upward always means more pitch. The illustrated horn increases feather when the link rises. Other installations do the opposite and still match the collective result in Chapter 3.
- Bearing-ball circulation, built-in blade twist, flap, or lead and lag. The blades are rigid in the model. The cuff on a bearingless rotor is a different problem.
- A rotor-disc tilt. The last nine seconds pull back to the whole rotor and hold. You see four blades at different feather angles because they occupy different places on a tilted ring. You do not see a tip-path plane swinging to a compass point.

Cyan marks the control path. Gold marks the actuators. Violet marks state. None of those colors are a claim that the metal glows. The stationary ring is metal. The annotation is ink.

If you build teaching tools, that split is the reusable part. Hardware in plausible materials. Fields and math in a second layer, labeled as a layer. Section the part you need to see. Do not explode the machine into pieces that could not come apart that way.

## How to watch it without being fooled

Open the [swashplate film](https://mizcausevic-dev.github.io/helicopter-swashplate-explainer/) and use the clock, not the play button, the first time through.

| Clock | Frames | Look for |
| --- | --- | --- |
| 0:00 to 0:05 | 0 to 149 | Which ring is allowed to spin, and the section through the uniball |
| 0:05 to 0:10 | 150 to 299 | One rise, four blades, a flat feather line |
| 0:10 to 0:17 | 300 to 509 | A tilt held in the helicopter frame while the upper ring turns |
| 0:17 to 0:25 | 510 to 749 | One pitch link, one horn, one feathering axis |
| 0:25 to 0:34 | 750 to 1019 | The same mechanism, seen whole, then held still |

Space pauses. The arrow keys step one frame. Keys 1 through 5 jump to those stages. If your browser asks for reduced motion, the film starts paused on purpose.

The source notes sit in the safeguard bar. Chapter 4 is the parts description. Chapter 3 is the collective result. Both are public: [Chapter 4](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch04.pdf) and [Chapter 3](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch03.pdf). The repository is [mizcausevic-dev/helicopter-swashplate-explainer](https://github.com/mizcausevic-dev/helicopter-swashplate-explainer).

## Questions the search box actually asks

**What does a helicopter swashplate do?**
It turns stationary pilot inputs into rotating blade inputs. The lower ring takes the stick. The upper ring spins with the rotor and carries that motion out through the pitch links.

**What is the difference between collective and cyclic?**
Collective raises or lowers the whole swashplate, so every blade changes pitch together. Cyclic tilts the swashplate, so each blade's pitch rises and falls once per revolution.

**Does the rotor disc tilt where the swashplate is high?**
Not as a universal rule. Pitch peaks on the high side of the plate in a direct linkage. Where the disc then tilts depends on the rotor and on how the controls were phased. The handbook treats a roughly 90-degree gyroscopic offset as usual, and treats the rigging as the thing that makes forward stick produce forward flight.

**Which direction does the swashplate move for more pitch?**
The pilot's collective comes up, and blade pitch increases together. Whether the plate itself must rise, or the horn must be pulled the other way, is the linkage design. Do not copy a diagram into a maintenance sign-off.

## The only next step that matters

Watch the flat line become a sine wave. That is the whole distinction between collective and cyclic, and it takes about twelve seconds once you know which ring is allowed to spin.

Then close the picture and open the handbook chapter for the rotor you fly or the rotor you design. The film was built to make the mechanism legible. It was not built to sign your logbook, your drawing, or your lesson plan.
