export const programCategories = ["HYROX", "DEKA", "Running", "Strength & Conditioning", "Public Safety Prep"];

// HYROX programs are already split into Beginner/Intermediate/Advanced cards, so they don't get a selector.
export const categoriesWithLevelSelector = ["DEKA", "Running", "Strength & Conditioning", "Public Safety Prep"];

// Completing a program in these categories goes straight to the next level, immediately,
// with no repeat of the same level. Running / Strength & Conditioning repeat the same level
// for a second 3-month round before Level Up is offered. Public Safety Prep (see
// freeChoiceLevelUpCategories below) offers both options every time.
export const directLevelUpCategories = ["HYROX", "DEKA"];

// Completing a cycle in these categories always offers a free choice between repeating the
// same level and leveling up (no forced repeat count, no forced immediate advance) — the
// athlete decides each time. Test-day readiness (CPAT, agency PT tests) is the kind of thing
// you repeat at your own pace rather than on a fixed schedule.
export const freeChoiceLevelUpCategories = ["Public Safety Prep"];

// Generic placeholder day/exercise scaffolding, reused across not-yet-programmed weeks so
// the image/video slots in the app have exercises to attach to before real programming is
// written. Names are generic stand-ins, not real CPAT/PT-test content. Every week below
// shares this same array reference — that's safe because MediaContext keys are built from
// program+week+day+section+index, not from this content, so uploads never collide across
// weeks even though the exercise names repeat.
const PLACEHOLDER_TRAINING_DAYS = [1, 2, 3, 4].map((day) => ({
  day,
  warmup: [{ name: "Warm-Up 1" }],
  exercises: [{ name: "Exercise 1" }, { name: "Exercise 2" }, { name: "Exercise 3" }],
  cooldown: [{ name: "Cooldown 1" }],
}));

export const programs = [
  {
    id: "p1",
    title: "HYROX Beginner",
    category: "HYROX",
    duration: 12,
    difficulty: "Beginner",
    shortDescription: "Learn the eight HYROX stations and build the base fitness to finish strong.",
    fullDescription:
      "A 12-week on-ramp for first-time HYROX athletes. Covers proper technique for every station, builds running consistency, and layers in compromised running so race day doesn't come as a shock.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 963,
    sessionsPerWeek: "3-4 sessions/week",
    joined: true,
    currentWeek: 12,
    hasCompletedLevel: true,
    // Real draft programming (pilot for the placeholder-content rollout) — first pass,
    // not yet reviewed/adjusted by a coach. Foundation (wk 1-4): station technique + easy
    // running, light loads. Build (wk 5-8): compromised running + increasing station loads.
    // Peak (wk 9-12): full simulations at race effort, taper into race day.
    weeks: [
      {
        week: 1,
        title: "Meet the Stations",
        focus: "Technique walkthrough for all eight stations",
        days: [
          {
            day: 1,
            label: "Ski & Sled Technique",
            warmup: [{ name: "Easy Row or Bike", duration: "10 min", notes: "Followed by dynamic mobility" }],
            exercises: [
              { name: "SkiErg Technique", sets: 4, reps: "250m", intensity: "Easy", rest: "90 sec" },
              { name: "Sled Push Technique", sets: 4, reps: "25m", notes: "Light load, focus on posture", rest: "2 min" },
              { name: "Sled Pull Technique", sets: 4, reps: "25m", notes: "Light load, rope-over-rope form", rest: "2 min" },
            ],
            cooldown: [{ name: "Walk + Hip Flexor Stretch", duration: "5 min" }],
          },
          {
            day: 2,
            label: "Run & Jump Technique",
            warmup: [{ name: "Easy Jog + A-Skips / High Knees", duration: "10 min" }],
            exercises: [
              { name: "Easy Run", duration: "20 min", intensity: "Zone 2" },
              { name: "Burpee Broad Jump Technique", sets: 4, reps: "10m", rest: "90 sec" },
              { name: "Wall Ball Technique", sets: 3, reps: "15", notes: "Light ball, dial in the squat-to-throw", rest: "90 sec" },
            ],
            cooldown: [{ name: "Walk + Quad/Calf Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Carry & Row Technique",
            warmup: [{ name: "Easy Bike + Band Pull-Aparts", duration: "5 min" }],
            exercises: [
              { name: "Farmers Carry Technique", sets: 4, reps: "50m", intensity: "Moderate load", rest: "90 sec" },
              { name: "Sandbag Lunge Technique", sets: 3, reps: "20m", notes: "Light bag, focus on knee tracking", rest: "2 min" },
              { name: "Rowing Technique", sets: 4, reps: "250m", intensity: "Easy", rest: "90 sec" },
            ],
            cooldown: [{ name: "Walk + Hamstring Stretch", duration: "5 min" }],
          },
          {
            day: 4,
            label: "Full Station Walkthrough",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "All 8 Stations Walkthrough", sets: 1, notes: "One easy-effort round, no clock — just reps and positions" },
              { name: "Easy Jog Between Stations", sets: 8, reps: "200m", intensity: "Easy" },
              { name: "Technique Review", notes: "Coach feedback on each station before next week's loading begins" },
            ],
            cooldown: [{ name: "Stretch + Foam Roll", duration: "10 min" }],
          },
        ],
      },
      {
        week: 2,
        title: "Running Consistency",
        focus: "Establishing a repeatable easy running pace",
        days: [
          {
            day: 1,
            label: "Easy Run Base",
            warmup: [{ name: "Walk + Leg Swings", duration: "5 min" }],
            exercises: [
              { name: "Easy Run", duration: "25 min", intensity: "Zone 2, steady pace" },
              { name: "Strides", sets: 4, reps: "20m", notes: "Relaxed, not a sprint", rest: "60 sec" },
              { name: "Plank", sets: 3, duration: "30 sec" },
            ],
            cooldown: [{ name: "Walk + Full-Body Stretch", duration: "5 min" }],
          },
          {
            day: 2,
            label: "Station Strength Intro",
            warmup: [{ name: "Easy Row + Mobility Flow", duration: "5 min" }],
            exercises: [
              { name: "Sled Push", sets: 5, reps: "25m", intensity: "Light load", rest: "2 min" },
              { name: "Sled Pull", sets: 5, reps: "25m", intensity: "Light load", rest: "2 min" },
              { name: "Farmers Carry", sets: 4, reps: "50m", intensity: "Moderate load", rest: "90 sec" },
            ],
            cooldown: [{ name: "Walk + Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Tempo Run Intro",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Tempo Run", duration: "15 min", intensity: "Comfortably hard" },
              { name: "Wall Ball", sets: 4, reps: "20", rest: "90 sec" },
              { name: "Burpee Broad Jump", sets: 4, reps: "10m", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "10 min" }],
          },
          {
            day: 4,
            label: "Easy Run + Rowing",
            warmup: [{ name: "Dynamic Mobility Flow", duration: "5 min" }],
            exercises: [
              { name: "Easy Run", duration: "20 min", intensity: "Zone 2" },
              { name: "Rowing", sets: 4, reps: "300m", intensity: "Easy", rest: "90 sec" },
              { name: "Sandbag Lunge", sets: 3, reps: "20m", intensity: "Light bag", rest: "2 min" },
            ],
            cooldown: [{ name: "Walk + Stretch", duration: "5 min" }],
          },
        ],
      },
      {
        week: 3,
        title: "Sled Basics",
        focus: "Push and pull technique, light loads",
        days: [
          {
            day: 1,
            label: "Easy Run + Core",
            warmup: [{ name: "Easy Jog", duration: "5 min" }],
            exercises: [
              { name: "Easy Run", duration: "25 min", intensity: "Zone 2" },
              { name: "Strides", sets: 4, reps: "20m", rest: "60 sec" },
              { name: "Plank", sets: 3, duration: "30 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 2,
            label: "Sled Focus",
            warmup: [{ name: "Easy Row", duration: "5 min" }],
            exercises: [
              { name: "Sled Push", sets: 6, reps: "25m", intensity: "Light load", rest: "2 min" },
              { name: "Sled Pull", sets: 6, reps: "25m", intensity: "Light load", rest: "2 min" },
              { name: "Sled Push + Pull Combo", sets: 3, reps: "50m", notes: "Push out, pull back", rest: "2 min" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Tempo + Stations",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Tempo Run", duration: "15 min", intensity: "Comfortably hard" },
              { name: "Wall Ball", sets: 4, reps: "20", rest: "90 sec" },
              { name: "Farmers Carry", sets: 4, reps: "50m", intensity: "Moderate load", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 4,
            label: "4-Station Circuit",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Ski, Sled Push, Sled Pull, Row Circuit", sets: 2, notes: "Light effort, focus on transitions", rest: "3 min" },
              { name: "Easy Run Between Stations", sets: 4, reps: "200m", intensity: "Easy" },
              { name: "Burpee Broad Jump", sets: 4, reps: "10m", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch + Foam Roll", duration: "10 min" }],
          },
        ],
      },
      {
        week: 4,
        title: "Carries & Grip",
        focus: "Farmer's carry and sandbag lunge volume",
        days: [
          {
            day: 1,
            label: "Easy Run + Core",
            warmup: [{ name: "Easy Jog", duration: "5 min" }],
            exercises: [
              { name: "Easy Run", duration: "25 min", intensity: "Zone 2" },
              { name: "Strides", sets: 5, reps: "20m", rest: "60 sec" },
              { name: "Plank", sets: 3, duration: "40 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 2,
            label: "Grip & Carry Focus",
            warmup: [{ name: "Band Pull-Aparts + Mobility", duration: "5 min" }],
            exercises: [
              { name: "Farmers Carry", sets: 5, reps: "75m", intensity: "Moderate load", rest: "90 sec" },
              { name: "Sandbag Lunge", sets: 4, reps: "30m", intensity: "Light bag", rest: "2 min" },
              { name: "Dead Hang", sets: 3, duration: "30 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Tempo + Carries",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Tempo Run", duration: "18 min", intensity: "Comfortably hard" },
              { name: "Farmers Carry", sets: 4, reps: "75m", intensity: "Moderate load", rest: "90 sec" },
              { name: "Wall Ball", sets: 4, reps: "25", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 4,
            label: "4-Station Circuit",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Carry, Lunge, Sled Push, Sled Pull Circuit", sets: 2, notes: "Moderate effort", rest: "3 min" },
              { name: "Easy Run Between Stations", sets: 4, reps: "200m", intensity: "Easy" },
              { name: "Burpee Broad Jump", sets: 5, reps: "10m", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch + Foam Roll", duration: "10 min" }],
          },
        ],
      },
      {
        week: 5,
        title: "Compromised Running I",
        focus: "Short runs off station fatigue",
        days: [
          {
            day: 1,
            label: "Interval Run",
            warmup: [{ name: "Easy Jog + Strides", duration: "10 min" }],
            exercises: [
              { name: "Interval Run", sets: 6, reps: "400m", intensity: "5K effort", rest: "90 sec" },
              { name: "Strides", sets: 4, reps: "20m", rest: "60 sec" },
              { name: "Plank", sets: 3, duration: "40 sec" },
            ],
            cooldown: [{ name: "Easy Jog + Stretch", duration: "10 min" }],
          },
          {
            day: 2,
            label: "Station Loading",
            warmup: [{ name: "Easy Row", duration: "5 min" }],
            exercises: [
              { name: "Sled Push", sets: 6, reps: "25m", intensity: "Moderate load", rest: "90 sec" },
              { name: "Sled Pull", sets: 6, reps: "25m", intensity: "Moderate load", rest: "90 sec" },
              { name: "Wall Ball", sets: 5, reps: "20", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Compromised Running Intro",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Sled Push into Run", sets: 4, notes: "25m sled push, then 200m run, repeat", rest: "2 min" },
              { name: "Farmers Carry", sets: 4, reps: "75m", intensity: "Moderate load", rest: "90 sec" },
              { name: "Burpee Broad Jump", sets: 5, reps: "10m", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "10 min" }],
          },
          {
            day: 4,
            label: "Run + Station Circuit",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "SkiErg", sets: 2, reps: "250m", rest: "90 sec" },
              { name: "Run Between Stations", sets: 2, reps: "200m", intensity: "Easy" },
              { name: "Sled Push + Row Circuit", sets: 2, notes: "25m sled push into 250m row", rest: "2 min" },
              { name: "Wall Ball", sets: 3, reps: "20", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch + Core", duration: "10 min" }],
          },
        ],
      },
      {
        week: 6,
        title: "Compromised Running II",
        focus: "Longer runs off station fatigue",
        days: [
          {
            day: 1,
            label: "Interval Run",
            warmup: [{ name: "Easy Jog + Strides", duration: "10 min" }],
            exercises: [
              { name: "Interval Run", sets: 5, reps: "600m", intensity: "5K effort", rest: "2 min" },
              { name: "Strides", sets: 4, reps: "20m", rest: "60 sec" },
              { name: "Plank", sets: 3, duration: "45 sec" },
            ],
            cooldown: [{ name: "Easy Jog + Stretch", duration: "10 min" }],
          },
          {
            day: 2,
            label: "Station Loading",
            warmup: [{ name: "Easy Row", duration: "5 min" }],
            exercises: [
              { name: "Sled Push", sets: 6, reps: "30m", intensity: "Moderate load", rest: "90 sec" },
              { name: "Sled Pull", sets: 6, reps: "30m", intensity: "Moderate load", rest: "90 sec" },
              { name: "Sandbag Lunge", sets: 4, reps: "30m", intensity: "Moderate bag", rest: "2 min" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Compromised Running",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Run into Sled Push", sets: 5, notes: "400m run, then 25m sled push, repeat", rest: "2 min" },
              { name: "Farmers Carry", sets: 5, reps: "75m", intensity: "Moderate load", rest: "90 sec" },
              { name: "Wall Ball", sets: 5, reps: "25", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "10 min" }],
          },
          {
            day: 4,
            label: "Run + Station Circuit",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "SkiErg", sets: 2, reps: "250m", rest: "90 sec" },
              { name: "Run Between Stations", sets: 2, reps: "400m", intensity: "Easy" },
              { name: "Sled Pull + Row Circuit", sets: 2, notes: "30m sled pull into 250m row", rest: "2 min" },
              { name: "Burpee Broad Jump", sets: 5, reps: "10m", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch + Core", duration: "10 min" }],
          },
        ],
      },
      {
        week: 7,
        title: "Station Strength Building",
        focus: "Increasing load across all stations",
        days: [
          {
            day: 1,
            label: "Tempo Run",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Tempo Run", duration: "20 min", intensity: "Comfortably hard" },
              { name: "Strides", sets: 5, reps: "20m", rest: "60 sec" },
              { name: "Plank", sets: 3, duration: "45 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "10 min" }],
          },
          {
            day: 2,
            label: "Heavy Station Day",
            warmup: [{ name: "Easy Row + Mobility", duration: "10 min" }],
            exercises: [
              { name: "Sled Push", sets: 6, reps: "25m", intensity: "Heavy load", rest: "2 min" },
              { name: "Sled Pull", sets: 6, reps: "25m", intensity: "Heavy load", rest: "2 min" },
              { name: "Farmers Carry", sets: 4, reps: "75m", intensity: "Heavy load", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Compromised Running",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Run into Wall Ball", sets: 4, notes: "600m run, then 20 wall balls, repeat", rest: "2 min" },
              { name: "Sandbag Lunge", sets: 4, reps: "40m", intensity: "Moderate bag", rest: "2 min" },
              { name: "Burpee Broad Jump", sets: 5, reps: "10m", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "10 min" }],
          },
          {
            day: 4,
            label: "6-Station Circuit",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              {
                name: "Ski, Sled Push, Sled Pull, Row, Carry, Wall Ball",
                sets: 1,
                notes: "One round for time at light-moderate effort — dial in transitions",
              },
              { name: "Easy Run", duration: "15 min", intensity: "Zone 2" },
            ],
            cooldown: [{ name: "Stretch + Foam Roll", duration: "10 min" }],
          },
        ],
      },
      {
        week: 8,
        title: "Aerobic Volume",
        focus: "Building overall running endurance",
        days: [
          {
            day: 1,
            label: "Long Run",
            warmup: [{ name: "Easy Jog", duration: "5 min" }],
            exercises: [
              { name: "Long Run", duration: "35 min", intensity: "Zone 2" },
              { name: "Strides", sets: 4, reps: "20m", rest: "60 sec" },
              { name: "Plank", sets: 3, duration: "45 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "10 min" }],
          },
          {
            day: 2,
            label: "Station Loading",
            warmup: [{ name: "Easy Row + Mobility", duration: "10 min" }],
            exercises: [
              { name: "Sled Push", sets: 6, reps: "30m", intensity: "Moderate-heavy load", rest: "90 sec" },
              { name: "Sled Pull", sets: 6, reps: "30m", intensity: "Moderate-heavy load", rest: "90 sec" },
              { name: "Wall Ball", sets: 5, reps: "25", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Compromised Running",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Run into Farmers Carry", sets: 4, notes: "800m run, then 75m carry, repeat", rest: "2 min" },
              { name: "Sandbag Lunge", sets: 4, reps: "40m", intensity: "Moderate bag", rest: "2 min" },
              { name: "Burpee Broad Jump", sets: 5, reps: "12m", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "10 min" }],
          },
          {
            day: 4,
            label: "Half Simulation",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              {
                name: "4 Stations + 4x1km Run",
                sets: 1,
                notes: "Ski, Sled Push, Sled Pull, Row alternated with 1km runs — easy-moderate pace",
              },
            ],
            cooldown: [{ name: "Stretch + Mobility Flow", duration: "10 min" }],
          },
        ],
      },
      {
        week: 9,
        title: "Full Station Walkthrough I",
        focus: "All eight stations back to back, easy pace",
        days: [
          {
            day: 1,
            label: "Race-Pace Intervals",
            warmup: [{ name: "Easy Jog + Strides", duration: "10 min" }],
            exercises: [
              { name: "Interval Run", sets: 5, reps: "1km", intensity: "Target race pace", rest: "2 min" },
              { name: "Strides", sets: 4, reps: "20m", rest: "60 sec" },
              { name: "Plank", sets: 3, duration: "50 sec" },
            ],
            cooldown: [{ name: "Easy Jog + Stretch", duration: "10 min" }],
          },
          {
            day: 2,
            label: "Race-Load Stations",
            warmup: [{ name: "Easy Row + Mobility", duration: "10 min" }],
            exercises: [
              { name: "Sled Push", sets: 5, reps: "25m", intensity: "Race load", rest: "2 min" },
              { name: "Sled Pull", sets: 5, reps: "25m", intensity: "Race load", rest: "2 min" },
              { name: "Wall Ball", sets: 4, reps: "25", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Compromised Running",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Run into Sled Push", sets: 4, notes: "1km run, then 25m sled push, repeat", rest: "2 min" },
              { name: "Farmers Carry", sets: 4, reps: "75m", intensity: "Race load", rest: "90 sec" },
              { name: "Burpee Broad Jump", sets: 4, reps: "10m", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "10 min" }],
          },
          {
            day: 4,
            label: "Full Simulation — Easy Pace",
            warmup: [{ name: "Easy Jog + Dynamic Mobility", duration: "10 min" }],
            exercises: [
              {
                name: "Full HYROX Simulation",
                sets: 1,
                notes: "All 8 stations + 8x1km runs, controlled easy pace throughout",
              },
            ],
            cooldown: [{ name: "Cooldown Jog + Stretch", duration: "15 min" }],
          },
        ],
      },
      {
        week: 10,
        title: "Full Station Walkthrough II",
        focus: "All eight stations back to back, faster pace",
        days: [
          {
            day: 1,
            label: "Race-Pace Intervals",
            warmup: [{ name: "Easy Jog + Strides", duration: "10 min" }],
            exercises: [
              { name: "Interval Run", sets: 6, reps: "1km", intensity: "Target race pace", rest: "90 sec" },
              { name: "Strides", sets: 4, reps: "20m", rest: "60 sec" },
              { name: "Plank", sets: 3, duration: "50 sec" },
            ],
            cooldown: [{ name: "Easy Jog + Stretch", duration: "10 min" }],
          },
          {
            day: 2,
            label: "Race-Load Stations",
            warmup: [{ name: "Easy Row + Mobility", duration: "10 min" }],
            exercises: [
              { name: "Sled Push", sets: 5, reps: "25m", intensity: "Race load", rest: "90 sec" },
              { name: "Sled Pull", sets: 5, reps: "25m", intensity: "Race load", rest: "90 sec" },
              { name: "Wall Ball", sets: 4, reps: "30", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Compromised Running",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Run into Farmers Carry", sets: 4, notes: "1km run, then 75m carry, repeat", rest: "2 min" },
              { name: "Sandbag Lunge", sets: 4, reps: "40m", intensity: "Race load", rest: "2 min" },
              { name: "Burpee Broad Jump", sets: 4, reps: "12m", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "10 min" }],
          },
          {
            day: 4,
            label: "Full Simulation — Race Effort",
            warmup: [{ name: "Easy Jog + Dynamic Mobility", duration: "10 min" }],
            exercises: [
              {
                name: "Full HYROX Simulation",
                sets: 1,
                notes: "All 8 stations + 8x1km runs, race-effort controlled pace",
              },
            ],
            cooldown: [{ name: "Cooldown Jog + Stretch", duration: "15 min" }],
          },
        ],
      },
      {
        week: 11,
        title: "Sharpen & Simulate",
        focus: "Short race simulation at moderate effort",
        days: [
          {
            day: 1,
            label: "Sharpening Intervals",
            warmup: [{ name: "Easy Jog + Strides", duration: "10 min" }],
            exercises: [
              { name: "Interval Run", sets: 4, reps: "800m", intensity: "Race pace", rest: "3 min" },
              { name: "Strides", sets: 4, reps: "20m", rest: "60 sec" },
              { name: "Plank", sets: 2, duration: "30 sec" },
            ],
            cooldown: [{ name: "Easy Jog + Stretch", duration: "10 min" }],
          },
          {
            day: 2,
            label: "Light Station Touch",
            warmup: [{ name: "Easy Row", duration: "5 min" }],
            exercises: [
              { name: "Sled Push", sets: 3, reps: "25m", intensity: "Race load", rest: "2 min" },
              { name: "Sled Pull", sets: 3, reps: "25m", intensity: "Race load", rest: "2 min" },
              { name: "Wall Ball", sets: 3, reps: "20", rest: "90 sec" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Half Simulation",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "4 Stations + 4x1km Run", sets: 1, notes: "Moderate effort, race-pace practice" },
              { name: "Easy Run", duration: "10 min", intensity: "Zone 2" },
            ],
            cooldown: [{ name: "Stretch", duration: "10 min" }],
          },
          {
            day: 4,
            label: "Technique Polish",
            warmup: [{ name: "Easy Jog", duration: "10 min" }],
            exercises: [
              { name: "Station Technique Review", sets: 1, notes: "All 8 stations, light effort, clean up any weak transitions" },
              { name: "Easy Run", duration: "15 min", intensity: "Zone 2" },
            ],
            cooldown: [{ name: "Mobility Flow", duration: "10 min" }],
          },
        ],
      },
      {
        week: 12,
        title: "Race Week Prep",
        focus: "Deload and race-day logistics",
        days: [
          {
            day: 1,
            label: "Shakeout",
            warmup: [{ name: "Walk", duration: "5 min" }],
            exercises: [
              { name: "Easy Run", duration: "15 min", intensity: "Very easy" },
              { name: "Strides", sets: 3, reps: "20m", rest: "60 sec" },
            ],
            cooldown: [{ name: "Mobility Flow", duration: "10 min" }],
          },
          {
            day: 2,
            label: "Light Station Touch",
            warmup: [{ name: "Easy Walk", duration: "5 min" }],
            exercises: [
              { name: "Sled Push", sets: 3, reps: "25m", intensity: "Light load", rest: "2 min" },
              { name: "Wall Ball", sets: 2, reps: "15", rest: "90 sec" },
              { name: "Easy Row", reps: "500m", intensity: "Easy" },
            ],
            cooldown: [{ name: "Stretch", duration: "5 min" }],
          },
          {
            day: 3,
            label: "Rest & Prep",
            warmup: [{ name: "Easy Walk", duration: "5 min" }],
            exercises: [
              { name: "Easy Walk/Jog", duration: "15 min", intensity: "Very easy" },
              { name: "Light Mobility Flow", duration: "10 min" },
              { name: "Race Logistics Review", notes: "Gear check, pacing plan, nutrition timing" },
            ],
            cooldown: [{ name: "Rest", notes: "Prioritize sleep and hydration" }],
          },
          {
            day: 4,
            label: "Race Day",
            warmup: [{ name: "Race Warm-Up", duration: "10 min", notes: "Easy jog + dynamic mobility" }],
            exercises: [{ name: "HYROX Race", notes: "Trust the training — pace the run legs even" }],
            cooldown: [{ name: "Post-Race Cooldown Walk", duration: "10 min" }],
          },
        ],
      },
    ],
  },
  {
    id: "p2",
    title: "HYROX Intermediate",
    category: "HYROX",
    duration: 12,
    difficulty: "Intermediate",
    shortDescription: "Race-specific engine and station work to peak for your next HYROX.",
    fullDescription:
      "A 12-week block built around HYROX's eight-station format — running intervals paired with sled pushes, wall balls, farmer's carries, and burpee broad jumps. Designed to build the mixed aerobic-strength engine HYROX demands, with a taper in the final week so you toe the line fresh.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 1842,
    sessionsPerWeek: "4-5 sessions/week",
    joined: true,
    currentWeek: 4,
    weeks: [
      {
        week: 1,
        title: "Foundation & Testing",
        focus: "Baseline 1km run + station technique check",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Aerobic Base",
        focus: "Zone 2 running volume + compromised running intro",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Station Strength",
        focus: "Heavy sled work and carries, moderate running",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Engine Building",
        focus: "Interval running under fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Mixed Modal",
        focus: "Full station circuits at race pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Compromised Running Intensives",
        focus: "Hard running off station fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Peak Volume",
        focus: "Highest weekly training load of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Race Simulation I",
        focus: "Half-distance HYROX simulation",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Race Simulation II",
        focus: "Full-distance HYROX simulation",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Strength Retention",
        focus: "Maintain power output, reduce volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Sharpen",
        focus: "Race-pace intervals and technique polish",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Taper & Race Week",
        focus: "Deload, mobility, and race day",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p3",
    title: "HYROX Advanced",
    category: "HYROX",
    duration: 12,
    difficulty: "Advanced",
    shortDescription: "A race-simulation-heavy block for athletes chasing a podium finish.",
    fullDescription:
      "Twelve weeks of high-volume running and near-maximal station loading, capped with two full race simulations. Built for experienced HYROX athletes with at least one race under their belt.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 512,
    sessionsPerWeek: "4-5 sessions/week",
    joined: false,
    currentWeek: 0,
    weeks: [
      {
        week: 1,
        title: "Performance Testing",
        focus: "Baseline benchmarks across all eight stations",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "High Volume Running",
        focus: "Elevated mileage under normal fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Heavy Station Load",
        focus: "Max-effort sled and carry work",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Race Pace Intervals",
        focus: "Running intervals at target race pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Compromised Running Intensives I",
        focus: "Hard running off heavy station fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Compromised Running Intensives II",
        focus: "Extended hard running off station fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Peak Volume",
        focus: "Highest combined running and station load",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Full Race Simulation I",
        focus: "Complete HYROX simulation at race intensity",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Full Race Simulation II",
        focus: "Second full race simulation",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Power Retention",
        focus: "Maintain intensity, trim volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Sharpen & Simulate",
        focus: "Final race simulation, technique polish",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Taper & Race Week",
        focus: "Deload into race day",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p4",
    title: "DEKA FIT",
    category: "DEKA",
    duration: 12,
    difficulty: "Intermediate",
    shortDescription: "Balanced strength-and-cardio prep for DEKA FIT's 10 functional zones.",
    fullDescription:
      "A 12-week program blending running with strength-endurance zone work, built for athletes preparing for DEKA FIT's 10-zone format.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 745,
    sessionsPerWeek: "4-5 sessions/week",
    joined: true,
    currentWeek: 5,
    enrolledLevel: "Beginner",
    weeks: [
      {
        week: 1,
        title: "Zone Familiarization",
        focus: "Technique for all 10 DEKA FIT zones",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Aerobic Base",
        focus: "Running volume between zone work",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Strength Base",
        focus: "Building capacity in strength zones",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Zone Circuits I",
        focus: "Grouped zones at moderate pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Compromised Running I",
        focus: "Running off zone fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Zone Circuits II",
        focus: "Grouped zones at race pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Compromised Running II",
        focus: "Longer runs off zone fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Peak Volume",
        focus: "Highest combined running and zone load",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Full Zone Simulation I",
        focus: "All 10 zones plus running in sequence",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Full Zone Simulation II",
        focus: "Repeat simulation at race intensity",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Sharpen",
        focus: "Race-pace zones and running polish",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Taper",
        focus: "Deload and race-day prep",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p5",
    title: "DEKA STRONG",
    category: "DEKA",
    duration: 12,
    difficulty: "Advanced",
    shortDescription: "Strength-biased prep for DEKA STRONG's 23 functional zones.",
    fullDescription:
      "Twelve weeks targeting the strength-endurance blend DEKA STRONG demands — sandbag work, sled work, rope climbs, and odd-object carries under time pressure across all 23 zones.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 587,
    sessionsPerWeek: "4-5 sessions/week",
    joined: false,
    currentWeek: 0,
    weeks: [
      {
        week: 1,
        title: "Zone Familiarization",
        focus: "Technique for every DEKA STRONG zone",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Strength Base",
        focus: "Building raw strength in key lifts",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Carry Capacity",
        focus: "Loaded carries and grip endurance",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Zone Circuits I",
        focus: "Grouped zones at moderate intensity",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Grip & Pull Volume",
        focus: "Rope climbs and pulling strength",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Zone Circuits II",
        focus: "Grouped zones at race intensity",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Strength Intensity",
        focus: "Heavier loads across key zone lifts",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Carry & Grip Peak",
        focus: "Highest carry and grip volume of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Full Zone Simulation I",
        focus: "All 23 zones in sequence",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Full Zone Simulation II",
        focus: "Repeat simulation at race intensity",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Sharpen",
        focus: "Technique polish and race-pace zones",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Taper",
        focus: "Deload and movement prep for race day",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p6",
    title: "DEKA MILE",
    category: "DEKA",
    duration: 12,
    difficulty: "Beginner",
    shortDescription: "Build the aerobic engine to move fast between DEKA MILE's 10 zones.",
    fullDescription:
      "A 12-week endurance-first program pairing steady running with light functional zone work, built for athletes tackling their first DEKA MILE.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 421,
    sessionsPerWeek: "3-4 sessions/week",
    joined: true,
    currentWeek: 12,
    enrolledLevel: "Beginner",
    hasCompletedLevel: true,
    weeks: [
      {
        week: 1,
        title: "Base Building",
        focus: "Easy running volume, zone technique intro",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Zone Intro",
        focus: "Light functional work between runs",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Aerobic Volume I",
        focus: "Building weekly running volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Tempo + Zones I",
        focus: "Tempo running paired with zone circuits",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Zone Circuit Practice I",
        focus: "Grouped zones at moderate pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Aerobic Volume II",
        focus: "Continued running buildup",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Tempo + Zones II",
        focus: "Tempo running at increased zone intensity",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Endurance Volume",
        focus: "Peak weekly running mileage",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Zone Circuit Practice II",
        focus: "All 10 zones run through in sequence",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Full Zone Simulation",
        focus: "Complete DEKA MILE simulation",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Taper Begins",
        focus: "Reduced volume, legs freshening up",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Race Week",
        focus: "Deload and race-day pacing plan",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p14",
    title: "DEKA ATLAS",
    category: "DEKA",
    duration: 12,
    difficulty: "Advanced",
    shortDescription: "The ultimate DEKA test — endurance and strength combined across an extended format.",
    fullDescription:
      "A 12-week peak program combining the running volume of DEKA MILE with the strength demands of DEKA STRONG, preparing athletes for DEKA ATLAS's extended combined format.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 298,
    sessionsPerWeek: "4-5 sessions/week",
    joined: false,
    currentWeek: 0,
    weeks: [
      {
        week: 1,
        title: "Zone & Distance Testing",
        focus: "Baseline benchmarks across zones and running",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Aerobic Base",
        focus: "Building running volume alongside zone technique",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Strength Base",
        focus: "Building capacity across all zone types",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Zone Circuits I",
        focus: "Grouped zones at moderate intensity",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Compromised Running I",
        focus: "Running under zone fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Zone Circuits II",
        focus: "Grouped zones at increased intensity",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Compromised Running II",
        focus: "Extended running under fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Peak Volume",
        focus: "Highest combined running and zone load",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Full Zone & Distance Simulation",
        focus: "Complete DEKA ATLAS simulation",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Power Retention",
        focus: "Maintain intensity, trim volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Sharpen",
        focus: "Race-pace zones and running polish",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Taper & Race Week",
        focus: "Deload into race day",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p15",
    title: "DEKA DOUBLE",
    category: "DEKA",
    duration: 12,
    difficulty: "Intermediate",
    shortDescription: "Double the distance, double the zones — an endurance-heavy DEKA build.",
    fullDescription:
      "A 12-week endurance-focused program built for DEKA DOUBLE's extended distance and zone count, layering running volume onto steady zone-circuit progression.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 214,
    sessionsPerWeek: "4-5 sessions/week",
    joined: false,
    currentWeek: 0,
    weeks: [
      {
        week: 1,
        title: "Base Building",
        focus: "Establishing running and zone endurance",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Aerobic Volume I",
        focus: "Extended easy running",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Zone Endurance I",
        focus: "Zone work at extended volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Aerobic Volume II",
        focus: "Continued running buildup",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Zone Endurance II",
        focus: "Increasing zone circuit volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Compromised Running I",
        focus: "Running off zone fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Peak Volume I",
        focus: "High combined running and zone load",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Compromised Running II",
        focus: "Extended running under fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Peak Volume II",
        focus: "Highest weekly combined load",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Full Distance Simulation",
        focus: "Complete DEKA DOUBLE simulation",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Taper Begins",
        focus: "Reduced volume, race prep",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Race Week",
        focus: "Full taper into race day",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p8",
    title: "5K",
    category: "Running",
    duration: 12,
    difficulty: "Intermediate",
    shortDescription: "Sharpen your speed and dial in pacing to run your best 5K.",
    fullDescription:
      "A 12-week block combining tempo runs, VO2max intervals, and race-pace repeats for runners looking to PR their 5K.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 1105,
    sessionsPerWeek: "4-5 sessions/week",
    joined: true,
    currentWeek: 12,
    enrolledLevel: "Beginner",
    roundsCompletedAtLevel: 2,
    hasCompletedLevel: true,
    weeks: [
      {
        week: 1,
        title: "Base Building",
        focus: "Establishing consistent running volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Threshold Base",
        focus: "Establishing lactate threshold pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Speed Intro",
        focus: "Short intervals at 5K effort",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Aerobic Volume",
        focus: "Building overall running endurance",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Race Pace Repeats I",
        focus: "Repeats at target 5K pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Volume Peak",
        focus: "Highest weekly mileage of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Race Pace Repeats II",
        focus: "Longer repeats at target pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Race Pace Repeats III",
        focus: "Increasing repeat volume at target pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Speed Sharpening",
        focus: "Short, fast reps with full recovery",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Peak Speed Work",
        focus: "Highest-intensity session of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Taper Begins",
        focus: "Reduced volume, legs freshening up",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Taper & Race",
        focus: "Deload into race day",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p16",
    title: "10K",
    category: "Running",
    duration: 12,
    difficulty: "Intermediate",
    shortDescription: "Bridge the gap from 5K fitness to a strong, confident 10K finish.",
    fullDescription:
      "A 12-week progression building weekly mileage and steady-state endurance to take you from 5K fitness to a confident 10K finish.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 1476,
    sessionsPerWeek: "4-5 sessions/week",
    joined: false,
    currentWeek: 0,
    weeks: [
      {
        week: 1,
        title: "Base Building",
        focus: "Establishing consistent running volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Aerobic Volume I",
        focus: "Extending easy run distance",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Tempo Intro",
        focus: "First tempo run of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Aerobic Volume II",
        focus: "Continued mileage buildup",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Aerobic Volume III",
        focus: "Further extending weekly mileage",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Race Pace Intro",
        focus: "Short repeats at 10K effort",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Peak Volume I",
        focus: "Building toward highest weekly mileage",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Peak Volume II",
        focus: "Highest weekly mileage of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Race Pace Repeats I",
        focus: "Repeats at target 10K pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Race Pace Repeats II",
        focus: "Longer repeats at 10K pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Taper Begins",
        focus: "Reduced volume, legs freshening up",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Taper & Race",
        focus: "Deload into race day",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p9",
    title: "Half Marathon",
    category: "Running",
    duration: 12,
    difficulty: "Intermediate",
    shortDescription: "Build the endurance and pacing to cross a half marathon finish line strong.",
    fullDescription:
      "A 12-week progression of long runs, tempo work, and easy mileage designed to get you race-ready for 21.1 kilometers.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 1348,
    sessionsPerWeek: "4-5 sessions/week",
    joined: false,
    currentWeek: 0,
    weeks: [
      {
        week: 1,
        title: "Base Building",
        focus: "Establishing consistent weekly mileage",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Aerobic Volume",
        focus: "Easy mileage buildup",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Tempo Intro",
        focus: "First tempo run of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Long Run Progression I",
        focus: "Extending the weekly long run",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Speed Intro",
        focus: "Short intervals to sharpen turnover",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Long Run Progression II",
        focus: "Continued long run buildup",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Peak Volume",
        focus: "Highest weekly mileage of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Race Pace Tempo",
        focus: "Tempo runs at goal race pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Longest Run",
        focus: "Final and longest long run",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Sharpening",
        focus: "Shorter, faster reps with recovery",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Taper Begins",
        focus: "Reduced volume, legs freshening up",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Race Week",
        focus: "Full taper into race day",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p10",
    title: "Full Marathon",
    category: "Running",
    duration: 12,
    difficulty: "Advanced",
    shortDescription: "A complete 12-week buildup to race-day-ready marathon fitness.",
    fullDescription:
      "Twelve weeks of progressive mileage, long runs, and race-pace tempo work for runners with a solid base preparing to take on 42.2 kilometers.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 892,
    sessionsPerWeek: "4-5 sessions/week",
    joined: false,
    currentWeek: 0,
    weeks: [
      {
        week: 1,
        title: "Base Building",
        focus: "Establishing consistent weekly mileage",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Aerobic Volume I",
        focus: "Easy mileage buildup",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Aerobic Volume II",
        focus: "Continued mileage buildup",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Long Run Progression I",
        focus: "Extending the weekly long run",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Tempo Intro",
        focus: "First tempo run of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Long Run Progression II",
        focus: "Continued long run buildup",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Peak Volume",
        focus: "Highest weekly mileage of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Race Pace Tempo",
        focus: "Tempo runs at goal marathon pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Longest Run",
        focus: "Final and longest long run",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Sharpening",
        focus: "Shorter, faster reps with recovery",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Taper Begins",
        focus: "Reduced volume, legs freshening up",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Race Week",
        focus: "Full taper into race day",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p11",
    title: "General S&C",
    category: "Strength & Conditioning",
    duration: 12,
    shortDescription: "Learn the big lifts and build a strength base from the ground up.",
    fullDescription:
      "A 12-week linear progression through squat, bench, deadlift, and press, paired with conditioning finishers — built for lifters at any stage who want a well-rounded strength base.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 1560,
    sessionsPerWeek: "4-5 sessions/week",
    joined: true,
    currentWeek: 12,
    enrolledLevel: "Intermediate",
    roundsCompletedAtLevel: 1,
    hasCompletedLevel: true,
    weeks: [
      {
        week: 1,
        title: "Movement Screening",
        focus: "Assessing mobility and lift technique",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Squat Focus",
        focus: "Building squat pattern and confidence",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Bench Focus",
        focus: "Building bench press technique",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Deadlift Focus",
        focus: "Building deadlift pattern and pull strength",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Press Focus",
        focus: "Overhead press technique and shoulder stability",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Volume Block I",
        focus: "Higher rep ranges across all lifts",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Volume Block II",
        focus: "Continued volume accumulation",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Intensity Block I",
        focus: "Heavier loads, lower reps",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Intensity Block II",
        focus: "Approaching working maxes",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Conditioning Push",
        focus: "Metabolic finishers layered in",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Peak Week",
        focus: "Heaviest lifts of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Deload & Test",
        focus: "Recovery week and new max testing",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p12",
    title: "Bodybuilding",
    category: "Strength & Conditioning",
    duration: 12,
    shortDescription: "Build muscle and size with a structured hypertrophy-focused split.",
    fullDescription:
      "A 12-week bodybuilding block split across push, pull, and leg days, emphasizing progressive overload and mind-muscle connection to maximize muscle growth.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 1024,
    sessionsPerWeek: "4-5 sessions/week",
    joined: false,
    currentWeek: 0,
    weeks: [
      {
        week: 1,
        title: "Foundations & Baseline",
        focus: "Establishing starting weights and technique",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Push Volume I",
        focus: "Chest, shoulders, and triceps hypertrophy work",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Pull Volume I",
        focus: "Back and biceps hypertrophy work",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Leg Volume I",
        focus: "Quad and hamstring hypertrophy work",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Push Volume II",
        focus: "Increasing push day volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Pull Volume II",
        focus: "Increasing pull day volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Leg Volume II",
        focus: "Increasing leg day volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Intensity Block I",
        focus: "Heavier loads, lower reps",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Intensity Block II",
        focus: "Continued intensity progression",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Peak Volume",
        focus: "Highest weekly training volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Deload",
        focus: "Reduced volume, active recovery",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Retest & Measure",
        focus: "Strength retest and progress check",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p13",
    title: "Glute & Lower Body Focus",
    category: "Strength & Conditioning",
    duration: 12,
    shortDescription: "Build strength, shape, and stability through the glutes and lower body.",
    fullDescription:
      "A 12-week lower-body-focused block combining hip hinge patterning, unilateral strength work, and progressive volume to build the glutes, hamstrings, and quads.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 1287,
    sessionsPerWeek: "4-5 sessions/week",
    joined: false,
    currentWeek: 0,
    weeks: [
      {
        week: 1,
        title: "Foundations & Assessment",
        focus: "Movement screening and glute activation basics",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Activation Volume I",
        focus: "Glute activation and hip hinge patterning",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Posterior Chain Base",
        focus: "Building hamstring and glute strength",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Quad & Glute Balance",
        focus: "Balancing quad and posterior chain work",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Unilateral Focus I",
        focus: "Single-leg strength and stability",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Volume Block I",
        focus: "Higher rep glute and hamstring work",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Unilateral Focus II",
        focus: "Progressing single-leg loading",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Volume Block II",
        focus: "Continued volume accumulation",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Intensity Block I",
        focus: "Heavier compound lower body lifts",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Intensity Block II",
        focus: "Continued intensity progression",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Peak Week",
        focus: "Heaviest lower body lifts of the block",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Deload & Retest",
        focus: "Recovery week and strength retest",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
  {
    id: "p17",
    title: "Fire Department Prep",
    category: "Public Safety Prep",
    duration: 12,
    shortDescription: "Build the continuous-effort engine and event technique to pass the CPAT.",
    fullDescription:
      "A 12-week program built around the CPAT's continuous timed circuit — stair climb, hose drag, equipment carry, ladder raise, forcible entry, search, rescue, and ceiling breach/pull, all performed back to back against the clock. Training layers event technique onto a growing aerobic and muscular-endurance base so the circuit stops feeling like eight separate tests and starts feeling like one continuous effort.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 312,
    sessionsPerWeek: "4-5 sessions/week",
    joined: false,
    currentWeek: 0,
    // Beginner/Intermediate/Test-Ready get their own Month 1-3 content (see `levels`
    // below) rather than sharing one generic `weeks` array — CPAT prep genuinely differs
    // by level, unlike categories where the level selector is just a difficulty label.
    levels: {
      Beginner: {
        weeks: [
          {
            week: 1,
            title: "Foundation Testing",
            focus: "Baseline CPAT circuit assessment and pacing introduction",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 2,
            title: "Circuit Familiarization",
            focus: "Technique for all eight CPAT events",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 3,
            title: "Aerobic Base",
            focus: "Building the engine for continuous timed effort",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 4,
            title: "Load Carry Basics",
            focus: "Stair climb with weighted vest, equipment carry technique",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 5,
            title: "Continuous Circuit I",
            focus: "Linking events under moderate fatigue",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 6,
            title: "Grip & Carry Strength",
            focus: "Equipment carry and forcible entry simulation",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 7,
            title: "Continuous Circuit II",
            focus: "Linking events under race-pace fatigue",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 8,
            title: "Peak Volume",
            focus: "Highest combined circuit and conditioning load",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 9,
            title: "Full CPAT Simulation I",
            focus: "All eight events back to back, controlled pace",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 10,
            title: "Full CPAT Simulation II",
            focus: "All eight events back to back, test pace",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 11,
            title: "Sharpen",
            focus: "Technique polish and pacing strategy",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 12,
            title: "Test Week",
            focus: "Taper and CPAT test-day prep",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
        ],
      },
      // Intermediate / Test-Ready reuse the Beginner scaffolding (including the shared
      // PLACEHOLDER_TRAINING_DAYS) as a placeholder until their own level-specific content
      // is written — same 12-week shape and week titles/focus text for now.
      Intermediate: {
        weeks: [
          {
            week: 1,
            title: "Foundation Testing",
            focus: "Baseline CPAT circuit assessment and pacing introduction",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 2,
            title: "Circuit Familiarization",
            focus: "Technique for all eight CPAT events",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 3,
            title: "Aerobic Base",
            focus: "Building the engine for continuous timed effort",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 4,
            title: "Load Carry Basics",
            focus: "Stair climb with weighted vest, equipment carry technique",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 5,
            title: "Continuous Circuit I",
            focus: "Linking events under moderate fatigue",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 6,
            title: "Grip & Carry Strength",
            focus: "Equipment carry and forcible entry simulation",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 7,
            title: "Continuous Circuit II",
            focus: "Linking events under race-pace fatigue",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 8,
            title: "Peak Volume",
            focus: "Highest combined circuit and conditioning load",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 9,
            title: "Full CPAT Simulation I",
            focus: "All eight events back to back, controlled pace",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 10,
            title: "Full CPAT Simulation II",
            focus: "All eight events back to back, test pace",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 11,
            title: "Sharpen",
            focus: "Technique polish and pacing strategy",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 12,
            title: "Test Week",
            focus: "Taper and CPAT test-day prep",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
        ],
      },
      "Test-Ready": {
        weeks: [
          {
            week: 1,
            title: "Foundation Testing",
            focus: "Baseline CPAT circuit assessment and pacing introduction",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 2,
            title: "Circuit Familiarization",
            focus: "Technique for all eight CPAT events",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 3,
            title: "Aerobic Base",
            focus: "Building the engine for continuous timed effort",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 4,
            title: "Load Carry Basics",
            focus: "Stair climb with weighted vest, equipment carry technique",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 5,
            title: "Continuous Circuit I",
            focus: "Linking events under moderate fatigue",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 6,
            title: "Grip & Carry Strength",
            focus: "Equipment carry and forcible entry simulation",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 7,
            title: "Continuous Circuit II",
            focus: "Linking events under race-pace fatigue",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 8,
            title: "Peak Volume",
            focus: "Highest combined circuit and conditioning load",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 9,
            title: "Full CPAT Simulation I",
            focus: "All eight events back to back, controlled pace",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 10,
            title: "Full CPAT Simulation II",
            focus: "All eight events back to back, test pace",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 11,
            title: "Sharpen",
            focus: "Technique polish and pacing strategy",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
          {
            week: 12,
            title: "Test Week",
            focus: "Taper and CPAT test-day prep",
            days: PLACEHOLDER_TRAINING_DAYS,
          },
        ],
      },
    },
  },
  {
    id: "p18",
    title: "Law Enforcement Prep",
    category: "Public Safety Prep",
    duration: 12,
    shortDescription: "One 12-week program covering the shared core of Police, DPS Trooper, and Border Patrol fitness tests.",
    fullDescription:
      "A 12-week program built around the run, push-ups, sit-ups, and agility/step-test components that overlap across Police, DPS Trooper, and Border Patrol PT tests. Pick an agency focus to get phase-level emphasis notes tailored to your test — the underlying workouts stay the same since the core components are shared.",
    coach: {
      name: "Carlos Canales",
      initials: "CC",
      title: "HYROX Competitor & Personal Trainer",
      bio: "HYROX competitor, Spartan World Championship qualifier, and certified personal trainer. Programs built from real competition experience.",
    },
    enrolledCount: 428,
    sessionsPerWeek: "4-5 sessions/week",
    joined: false,
    currentWeek: 0,
    focusOptions: ["Police", "DPS Trooper", "Border Patrol"],
    weeks: [
      {
        week: 1,
        title: "Foundation Testing",
        focus: "Baseline run, push-up, and sit-up benchmarks",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 2,
        title: "Aerobic Base",
        focus: "Building running volume and pacing consistency",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 3,
        title: "Muscular Endurance Base",
        focus: "Push-up and sit-up volume building",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 4,
        title: "Agility & Step Test Intro",
        focus: "Technique for agility run and step test components",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 5,
        title: "Circuit Building I",
        focus: "Linking running and calisthenics under fatigue",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 6,
        title: "Muscular Endurance Peak",
        focus: "Max push-up and sit-up set volume",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 7,
        title: "Circuit Building II",
        focus: "Full test circuit at moderate pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 8,
        title: "Peak Volume",
        focus: "Highest combined running and calisthenics load",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 9,
        title: "Full Test Simulation I",
        focus: "Complete agency test circuit, controlled pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 10,
        title: "Full Test Simulation II",
        focus: "Complete agency test circuit, test pace",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 11,
        title: "Sharpen",
        focus: "Pacing strategy and technique polish",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
      {
        week: 12,
        title: "Test Week",
        focus: "Taper and test-day prep",
        days: PLACEHOLDER_TRAINING_DAYS,
      },
    ],
  },
];

export function getProgram(id) {
  return programs.find((p) => p.id === id);
}

// Resolves the week list to actually render for a program. Most categories still just
// have a flat `weeks` array shared across every level. Programs that need level-specific
// content (e.g. Fire Department Prep) instead have a `levels` map — this picks the weeks
// for whichever level the athlete is enrolled at, falling back to the first defined level
// before they've chosen one (so the Browse-tab preview isn't empty).
export function getActiveWeeks(program) {
  if (!program.levels) return program.weeks || [];
  const level = program.enrolledLevel || Object.keys(program.levels)[0];
  return program.levels[level]?.weeks || [];
}

// Same shape as getActiveWeeks, but for an explicit level rather than the athlete's own
// enrolledLevel — used by the admin editor, which resolves the level from its route
// instead of from an enrollment. Read-only; doesn't touch `programs` or any seed data.
export function getWeeksForLevel(program, levelKey) {
  if (!program.levels) return program.weeks || [];
  return program.levels[levelKey]?.weeks || program.levels[Object.keys(program.levels)[0]]?.weeks || [];
}

// program.sessionsPerWeek is a display string like "4-5 sessions/week" — pull the lower
// bound out to use as a session/day count when a week has no real day content yet.
function parseSessionsPerWeek(text) {
  const match = /(\d+)/.exec(text || "");
  return match ? Math.min(Math.max(parseInt(match[1], 10), 1), 6) : 4;
}

// Resolves the actual training days to check off for a given week. Real day-level content
// (warmup/exercises/cooldown, written per program) takes priority when it exists; almost no
// week has that yet, so this falls back to generic "Day N" sessions sized off
// sessionsPerWeek, so the training flow works everywhere before real content is written.
export function getDaysForWeek(program, week) {
  if (week.days && week.days.length > 0) {
    return week.days.map((d, i) => ({
      day: d.day ?? i + 1,
      label: d.label || `Day ${d.day ?? i + 1}`,
      source: d,
    }));
  }
  const count = parseSessionsPerWeek(program.sessionsPerWeek);
  return Array.from({ length: count }, (_, i) => ({
    day: i + 1,
    label: `Day ${i + 1}`,
    source: null,
  }));
}

// Which day numbers are checked off for a given week, as a plain array (never undefined).
export function getCompletedDays(program, weekNumber) {
  return program.completedDays?.[weekNumber] || [];
}

// "not-enrolled" | "enrolled" | "completed"
export function getEnrollmentStatus(program) {
  if (!program.joined) return "not-enrolled";
  if (program.currentWeek >= program.duration) return "completed";
  return "enrolled";
}

// Card-level status (Browse tab, My Programs tab). Once a program has ever been
// completed, hasCompletedLevel is a one-way ratchet — it never gets cleared, so the
// "Completed" badge stays put permanently even after leveling up starts a fresh
// currentWeek cycle. The detail page still uses getEnrollmentStatus directly so it can
// show real live progress (current week, phase checkmarks) for whatever cycle is active.
export function getCardStatus(program) {
  return program.hasCompletedLevel ? "completed" : getEnrollmentStatus(program);
}

// Most categories progress Beginner -> Intermediate -> Advanced. Public Safety Prep uses
// "Test-Ready" in place of "Advanced" since the top level is framed around test-day
// readiness rather than a generic difficulty tier.
const DEFAULT_LEVEL_ORDER = ["Beginner", "Intermediate", "Advanced"];
const LEVEL_ORDER_BY_CATEGORY = {
  "Public Safety Prep": ["Beginner", "Intermediate", "Test-Ready"],
};

export function getLevelOrder(category) {
  return LEVEL_ORDER_BY_CATEGORY[category] || DEFAULT_LEVEL_ORDER;
}

export function getNextLevel(level, category) {
  const order = getLevelOrder(category);
  const index = order.indexOf(level);
  if (index === -1 || index === order.length - 1) return null;
  return order[index + 1];
}

// For categories where each level is its own separate program record (HYROX has no level
// selector — Beginner/Intermediate/Advanced are three distinct programs), finds the sibling
// record one level up. Returns null at the top level or if no sibling exists.
export function getNextLevelProgram(program, allPrograms) {
  const nextLevel = getNextLevel(program.difficulty, program.category);
  if (!nextLevel) return null;
  return (
    allPrograms.find((p) => p.category === program.category && p.difficulty === nextLevel && p.id !== program.id) ||
    null
  );
}

// What action a *just-finished* cycle (live status "completed") should offer.
//
// Public Safety Prep (freeChoiceLevelUpCategories): completing always offers a free choice —
// repeat the same level, or (if there's a next level) level up. The athlete decides each
// time; there's no forced repeat count and no forced immediate advance.
//
// HYROX / DEKA (directLevelUpCategories): completing always offers "level-up" immediately,
// never a repeat.
//   - DEKA has a level selector, so leveling up re-enrolls the *same* program record at
//     the next level (type "same-program").
//   - HYROX has no selector — each level is its own separate program record, so leveling
//     up points at the sibling program in the same category (type "different-program").
//
// Running / Strength & Conditioning: completing offers "continue" (repeat the same level,
// a fresh 3-month block) until roundsCompletedAtLevel reaches 2, at which point it offers
// "level-up" (same-program, since these categories all use the level selector).
export function getCompletionAction(program, allPrograms) {
  const currentLevel = program.enrolledLevel || program.difficulty;
  const nextLevel = getNextLevel(currentLevel, program.category);

  if (freeChoiceLevelUpCategories.includes(program.category)) {
    return { kind: "choice", nextLevel };
  }

  if (directLevelUpCategories.includes(program.category)) {
    if (!nextLevel) return null;

    if (categoriesWithLevelSelector.includes(program.category)) {
      return { kind: "level-up", type: "same-program", nextLevel };
    }

    const sibling = allPrograms.find(
      (p) => p.category === program.category && p.difficulty === nextLevel && p.id !== program.id
    );
    // Once the athlete has already enrolled in the sibling program (whether they're mid-way
    // through it or have since completed it too), the prompt has served its purpose — nothing
    // left to act on from this completed lower-level card.
    return sibling && !sibling.joined
      ? { kind: "level-up", type: "different-program", programId: sibling.id, nextLevel }
      : null;
  }

  const rounds = program.roundsCompletedAtLevel || 0;
  if (rounds < 2) {
    return { kind: "continue" };
  }

  if (!nextLevel) return null;
  return { kind: "level-up", type: "same-program", nextLevel };
}
