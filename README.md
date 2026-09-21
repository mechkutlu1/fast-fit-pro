# FastFit — Plan Tracker & Form Coach

A single-file, installable PWA. Works offline once loaded. All data stays on the
device (localStorage); nothing is uploaded.

## What's inside
- **Today / Fasting** — 16:8 window ring, phase, daily checklist.
- **Meals · Supps · Progress · Workout** — your plan, weigh-ins, weekly training.
- **Coach (new)** — front-camera calisthenics scoring, on-device with MediaPipe.
- **Setup** — load your Excel plan, calendar reminders, install, data controls.

## Form Coach
Counts your reps and grades each set on **depth (range of motion)**, **form**, and
**tempo**. Exercises: Squats, Push-ups, Lunges, Glute Bridge, Jumping Jacks,
High Knees, and a Plank hold timer.

- Tap **Coach → pick an exercise → Start camera → Start set**. A 3-2-1 countdown,
  then it counts reps live and colours your skeleton (green good / amber off /
  red fix).
- Each set is graded A–E and saved under **Recent sets**.
- The camera feed and pose estimation never leave the device. Nothing is recorded.

**Notes:** the camera needs `https://` (or install the app to your home screen).
Front-facing exercises (squats, jacks, high knees) work best facing the phone;
for push-ups, lunges and planks, set the phone low to your side so your whole
body is in frame. Stand back ~2 m so your feet are visible.

## How it's built
Pose infrastructure (lazy `@mediapipe/tasks-vision` load, front camera, mirrored
landmark reading and skeleton overlay) is adapted from the **Slow Form** tai-chi
coach; the rep-counting and calisthenics scoring engine is purpose-built here.
The service worker caches the MediaPipe library, WASM and pose model on first
online use so scoring keeps working offline afterwards.

## Deploy
Serve the folder over HTTPS (e.g. GitHub Pages). `index.html` is self-contained
apart from the SheetJS and MediaPipe CDNs, which are cached after first load.
