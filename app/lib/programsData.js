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
    weeks: [
      { week: 1, title: "Meet the Stations", focus: "Technique walkthrough for all eight stations" },
      { week: 2, title: "Running Consistency", focus: "Establishing a repeatable easy running pace" },
      { week: 3, title: "Sled Basics", focus: "Push and pull technique, light loads" },
      { week: 4, title: "Carries & Grip", focus: "Farmer's carry and sandbag lunge volume" },
      { week: 5, title: "Compromised Running I", focus: "Short runs off station fatigue" },
      { week: 6, title: "Compromised Running II", focus: "Longer runs off station fatigue" },
      { week: 7, title: "Station Strength Building", focus: "Increasing load across all stations" },
      { week: 8, title: "Aerobic Volume", focus: "Building overall running endurance" },
      { week: 9, title: "Full Station Walkthrough I", focus: "All eight stations back to back, easy pace" },
      { week: 10, title: "Full Station Walkthrough II", focus: "All eight stations back to back, faster pace" },
      { week: 11, title: "Sharpen & Simulate", focus: "Short race simulation at moderate effort" },
      { week: 12, title: "Race Week Prep", focus: "Deload and race-day logistics" },
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
      { week: 1, title: "Foundation & Testing", focus: "Baseline 1km run + station technique check" },
      { week: 2, title: "Aerobic Base", focus: "Zone 2 running volume + compromised running intro" },
      { week: 3, title: "Station Strength", focus: "Heavy sled work and carries, moderate running" },
      { week: 4, title: "Engine Building", focus: "Interval running under fatigue" },
      { week: 5, title: "Mixed Modal", focus: "Full station circuits at race pace" },
      { week: 6, title: "Compromised Running Intensives", focus: "Hard running off station fatigue" },
      { week: 7, title: "Peak Volume", focus: "Highest weekly training load of the block" },
      { week: 8, title: "Race Simulation I", focus: "Half-distance HYROX simulation" },
      { week: 9, title: "Race Simulation II", focus: "Full-distance HYROX simulation" },
      { week: 10, title: "Strength Retention", focus: "Maintain power output, reduce volume" },
      { week: 11, title: "Sharpen", focus: "Race-pace intervals and technique polish" },
      { week: 12, title: "Taper & Race Week", focus: "Deload, mobility, and race day" },
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
      { week: 1, title: "Performance Testing", focus: "Baseline benchmarks across all eight stations" },
      { week: 2, title: "High Volume Running", focus: "Elevated mileage under normal fatigue" },
      { week: 3, title: "Heavy Station Load", focus: "Max-effort sled and carry work" },
      { week: 4, title: "Race Pace Intervals", focus: "Running intervals at target race pace" },
      { week: 5, title: "Compromised Running Intensives I", focus: "Hard running off heavy station fatigue" },
      { week: 6, title: "Compromised Running Intensives II", focus: "Extended hard running off station fatigue" },
      { week: 7, title: "Peak Volume", focus: "Highest combined running and station load" },
      { week: 8, title: "Full Race Simulation I", focus: "Complete HYROX simulation at race intensity" },
      { week: 9, title: "Full Race Simulation II", focus: "Second full race simulation" },
      { week: 10, title: "Power Retention", focus: "Maintain intensity, trim volume" },
      { week: 11, title: "Sharpen & Simulate", focus: "Final race simulation, technique polish" },
      { week: 12, title: "Taper & Race Week", focus: "Deload into race day" },
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
      { week: 1, title: "Zone Familiarization", focus: "Technique for all 10 DEKA FIT zones" },
      { week: 2, title: "Aerobic Base", focus: "Running volume between zone work" },
      { week: 3, title: "Strength Base", focus: "Building capacity in strength zones" },
      { week: 4, title: "Zone Circuits I", focus: "Grouped zones at moderate pace" },
      { week: 5, title: "Compromised Running I", focus: "Running off zone fatigue" },
      { week: 6, title: "Zone Circuits II", focus: "Grouped zones at race pace" },
      { week: 7, title: "Compromised Running II", focus: "Longer runs off zone fatigue" },
      { week: 8, title: "Peak Volume", focus: "Highest combined running and zone load" },
      { week: 9, title: "Full Zone Simulation I", focus: "All 10 zones plus running in sequence" },
      { week: 10, title: "Full Zone Simulation II", focus: "Repeat simulation at race intensity" },
      { week: 11, title: "Sharpen", focus: "Race-pace zones and running polish" },
      { week: 12, title: "Taper", focus: "Deload and race-day prep" },
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
      { week: 1, title: "Zone Familiarization", focus: "Technique for every DEKA STRONG zone" },
      { week: 2, title: "Strength Base", focus: "Building raw strength in key lifts" },
      { week: 3, title: "Carry Capacity", focus: "Loaded carries and grip endurance" },
      { week: 4, title: "Zone Circuits I", focus: "Grouped zones at moderate intensity" },
      { week: 5, title: "Grip & Pull Volume", focus: "Rope climbs and pulling strength" },
      { week: 6, title: "Zone Circuits II", focus: "Grouped zones at race intensity" },
      { week: 7, title: "Strength Intensity", focus: "Heavier loads across key zone lifts" },
      { week: 8, title: "Carry & Grip Peak", focus: "Highest carry and grip volume of the block" },
      { week: 9, title: "Full Zone Simulation I", focus: "All 23 zones in sequence" },
      { week: 10, title: "Full Zone Simulation II", focus: "Repeat simulation at race intensity" },
      { week: 11, title: "Sharpen", focus: "Technique polish and race-pace zones" },
      { week: 12, title: "Taper", focus: "Deload and movement prep for race day" },
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
      { week: 1, title: "Base Building", focus: "Easy running volume, zone technique intro" },
      { week: 2, title: "Zone Intro", focus: "Light functional work between runs" },
      { week: 3, title: "Aerobic Volume I", focus: "Building weekly running volume" },
      { week: 4, title: "Tempo + Zones I", focus: "Tempo running paired with zone circuits" },
      { week: 5, title: "Zone Circuit Practice I", focus: "Grouped zones at moderate pace" },
      { week: 6, title: "Aerobic Volume II", focus: "Continued running buildup" },
      { week: 7, title: "Tempo + Zones II", focus: "Tempo running at increased zone intensity" },
      { week: 8, title: "Endurance Volume", focus: "Peak weekly running mileage" },
      { week: 9, title: "Zone Circuit Practice II", focus: "All 10 zones run through in sequence" },
      { week: 10, title: "Full Zone Simulation", focus: "Complete DEKA MILE simulation" },
      { week: 11, title: "Taper Begins", focus: "Reduced volume, legs freshening up" },
      { week: 12, title: "Race Week", focus: "Deload and race-day pacing plan" },
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
      { week: 1, title: "Zone & Distance Testing", focus: "Baseline benchmarks across zones and running" },
      { week: 2, title: "Aerobic Base", focus: "Building running volume alongside zone technique" },
      { week: 3, title: "Strength Base", focus: "Building capacity across all zone types" },
      { week: 4, title: "Zone Circuits I", focus: "Grouped zones at moderate intensity" },
      { week: 5, title: "Compromised Running I", focus: "Running under zone fatigue" },
      { week: 6, title: "Zone Circuits II", focus: "Grouped zones at increased intensity" },
      { week: 7, title: "Compromised Running II", focus: "Extended running under fatigue" },
      { week: 8, title: "Peak Volume", focus: "Highest combined running and zone load" },
      { week: 9, title: "Full Zone & Distance Simulation", focus: "Complete DEKA ATLAS simulation" },
      { week: 10, title: "Power Retention", focus: "Maintain intensity, trim volume" },
      { week: 11, title: "Sharpen", focus: "Race-pace zones and running polish" },
      { week: 12, title: "Taper & Race Week", focus: "Deload into race day" },
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
      { week: 1, title: "Base Building", focus: "Establishing running and zone endurance" },
      { week: 2, title: "Aerobic Volume I", focus: "Extended easy running" },
      { week: 3, title: "Zone Endurance I", focus: "Zone work at extended volume" },
      { week: 4, title: "Aerobic Volume II", focus: "Continued running buildup" },
      { week: 5, title: "Zone Endurance II", focus: "Increasing zone circuit volume" },
      { week: 6, title: "Compromised Running I", focus: "Running off zone fatigue" },
      { week: 7, title: "Peak Volume I", focus: "High combined running and zone load" },
      { week: 8, title: "Compromised Running II", focus: "Extended running under fatigue" },
      { week: 9, title: "Peak Volume II", focus: "Highest weekly combined load" },
      { week: 10, title: "Full Distance Simulation", focus: "Complete DEKA DOUBLE simulation" },
      { week: 11, title: "Taper Begins", focus: "Reduced volume, race prep" },
      { week: 12, title: "Race Week", focus: "Full taper into race day" },
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
      { week: 1, title: "Base Building", focus: "Establishing consistent running volume" },
      { week: 2, title: "Threshold Base", focus: "Establishing lactate threshold pace" },
      { week: 3, title: "Speed Intro", focus: "Short intervals at 5K effort" },
      { week: 4, title: "Aerobic Volume", focus: "Building overall running endurance" },
      { week: 5, title: "Race Pace Repeats I", focus: "Repeats at target 5K pace" },
      { week: 6, title: "Volume Peak", focus: "Highest weekly mileage of the block" },
      { week: 7, title: "Race Pace Repeats II", focus: "Longer repeats at target pace" },
      { week: 8, title: "Race Pace Repeats III", focus: "Increasing repeat volume at target pace" },
      { week: 9, title: "Speed Sharpening", focus: "Short, fast reps with full recovery" },
      { week: 10, title: "Peak Speed Work", focus: "Highest-intensity session of the block" },
      { week: 11, title: "Taper Begins", focus: "Reduced volume, legs freshening up" },
      { week: 12, title: "Taper & Race", focus: "Deload into race day" },
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
      { week: 1, title: "Base Building", focus: "Establishing consistent running volume" },
      { week: 2, title: "Aerobic Volume I", focus: "Extending easy run distance" },
      { week: 3, title: "Tempo Intro", focus: "First tempo run of the block" },
      { week: 4, title: "Aerobic Volume II", focus: "Continued mileage buildup" },
      { week: 5, title: "Aerobic Volume III", focus: "Further extending weekly mileage" },
      { week: 6, title: "Race Pace Intro", focus: "Short repeats at 10K effort" },
      { week: 7, title: "Peak Volume I", focus: "Building toward highest weekly mileage" },
      { week: 8, title: "Peak Volume II", focus: "Highest weekly mileage of the block" },
      { week: 9, title: "Race Pace Repeats I", focus: "Repeats at target 10K pace" },
      { week: 10, title: "Race Pace Repeats II", focus: "Longer repeats at 10K pace" },
      { week: 11, title: "Taper Begins", focus: "Reduced volume, legs freshening up" },
      { week: 12, title: "Taper & Race", focus: "Deload into race day" },
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
      { week: 1, title: "Base Building", focus: "Establishing consistent weekly mileage" },
      { week: 2, title: "Aerobic Volume", focus: "Easy mileage buildup" },
      { week: 3, title: "Tempo Intro", focus: "First tempo run of the block" },
      { week: 4, title: "Long Run Progression I", focus: "Extending the weekly long run" },
      { week: 5, title: "Speed Intro", focus: "Short intervals to sharpen turnover" },
      { week: 6, title: "Long Run Progression II", focus: "Continued long run buildup" },
      { week: 7, title: "Peak Volume", focus: "Highest weekly mileage of the block" },
      { week: 8, title: "Race Pace Tempo", focus: "Tempo runs at goal race pace" },
      { week: 9, title: "Longest Run", focus: "Final and longest long run" },
      { week: 10, title: "Sharpening", focus: "Shorter, faster reps with recovery" },
      { week: 11, title: "Taper Begins", focus: "Reduced volume, legs freshening up" },
      { week: 12, title: "Race Week", focus: "Full taper into race day" },
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
      { week: 1, title: "Base Building", focus: "Establishing consistent weekly mileage" },
      { week: 2, title: "Aerobic Volume I", focus: "Easy mileage buildup" },
      { week: 3, title: "Aerobic Volume II", focus: "Continued mileage buildup" },
      { week: 4, title: "Long Run Progression I", focus: "Extending the weekly long run" },
      { week: 5, title: "Tempo Intro", focus: "First tempo run of the block" },
      { week: 6, title: "Long Run Progression II", focus: "Continued long run buildup" },
      { week: 7, title: "Peak Volume", focus: "Highest weekly mileage of the block" },
      { week: 8, title: "Race Pace Tempo", focus: "Tempo runs at goal marathon pace" },
      { week: 9, title: "Longest Run", focus: "Final and longest long run" },
      { week: 10, title: "Sharpening", focus: "Shorter, faster reps with recovery" },
      { week: 11, title: "Taper Begins", focus: "Reduced volume, legs freshening up" },
      { week: 12, title: "Race Week", focus: "Full taper into race day" },
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
      { week: 1, title: "Movement Screening", focus: "Assessing mobility and lift technique" },
      { week: 2, title: "Squat Focus", focus: "Building squat pattern and confidence" },
      { week: 3, title: "Bench Focus", focus: "Building bench press technique" },
      { week: 4, title: "Deadlift Focus", focus: "Building deadlift pattern and pull strength" },
      { week: 5, title: "Press Focus", focus: "Overhead press technique and shoulder stability" },
      { week: 6, title: "Volume Block I", focus: "Higher rep ranges across all lifts" },
      { week: 7, title: "Volume Block II", focus: "Continued volume accumulation" },
      { week: 8, title: "Intensity Block I", focus: "Heavier loads, lower reps" },
      { week: 9, title: "Intensity Block II", focus: "Approaching working maxes" },
      { week: 10, title: "Conditioning Push", focus: "Metabolic finishers layered in" },
      { week: 11, title: "Peak Week", focus: "Heaviest lifts of the block" },
      { week: 12, title: "Deload & Test", focus: "Recovery week and new max testing" },
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
      { week: 1, title: "Foundations & Baseline", focus: "Establishing starting weights and technique" },
      { week: 2, title: "Push Volume I", focus: "Chest, shoulders, and triceps hypertrophy work" },
      { week: 3, title: "Pull Volume I", focus: "Back and biceps hypertrophy work" },
      { week: 4, title: "Leg Volume I", focus: "Quad and hamstring hypertrophy work" },
      { week: 5, title: "Push Volume II", focus: "Increasing push day volume" },
      { week: 6, title: "Pull Volume II", focus: "Increasing pull day volume" },
      { week: 7, title: "Leg Volume II", focus: "Increasing leg day volume" },
      { week: 8, title: "Intensity Block I", focus: "Heavier loads, lower reps" },
      { week: 9, title: "Intensity Block II", focus: "Continued intensity progression" },
      { week: 10, title: "Peak Volume", focus: "Highest weekly training volume" },
      { week: 11, title: "Deload", focus: "Reduced volume, active recovery" },
      { week: 12, title: "Retest & Measure", focus: "Strength retest and progress check" },
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
      { week: 1, title: "Foundations & Assessment", focus: "Movement screening and glute activation basics" },
      { week: 2, title: "Activation Volume I", focus: "Glute activation and hip hinge patterning" },
      { week: 3, title: "Posterior Chain Base", focus: "Building hamstring and glute strength" },
      { week: 4, title: "Quad & Glute Balance", focus: "Balancing quad and posterior chain work" },
      { week: 5, title: "Unilateral Focus I", focus: "Single-leg strength and stability" },
      { week: 6, title: "Volume Block I", focus: "Higher rep glute and hamstring work" },
      { week: 7, title: "Unilateral Focus II", focus: "Progressing single-leg loading" },
      { week: 8, title: "Volume Block II", focus: "Continued volume accumulation" },
      { week: 9, title: "Intensity Block I", focus: "Heavier compound lower body lifts" },
      { week: 10, title: "Intensity Block II", focus: "Continued intensity progression" },
      { week: 11, title: "Peak Week", focus: "Heaviest lower body lifts of the block" },
      { week: 12, title: "Deload & Retest", focus: "Recovery week and strength retest" },
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
    return sibling ? { kind: "level-up", type: "different-program", programId: sibling.id, nextLevel } : null;
  }

  const rounds = program.roundsCompletedAtLevel || 0;
  if (rounds < 2) {
    return { kind: "continue" };
  }

  if (!nextLevel) return null;
  return { kind: "level-up", type: "same-program", nextLevel };
}
