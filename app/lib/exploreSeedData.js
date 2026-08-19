// Starter content for the Explore tab's two sub-tabs, so both lists have something real to
// show before any business has posted. Same role programsData.js/mockData.js/athletes.js
// play elsewhere in this app: hand-authored seed content, not fetched from anywhere.
export const eventTypes = ["HYROX", "CrossFit", "DEKA", "Spartan", "Other"];

export const seedEvents = [
  {
    id: "ev1",
    title: "HYROX Denver",
    type: "HYROX",
    date: "Oct 18, 2026",
    location: "Denver, CO",
    hostName: "HYROX North America",
    hostEmail: "events@hyroxnorthamerica.example",
    description:
      "The full HYROX format — 8 stations, 8 runs. Open, Pro, and Doubles divisions all racing the same day at the National Western Complex.",
    registrationLink: "https://hyrox.example.com/denver",
    imageUrl: null,
    status: "approved",
    reports: [],
    createdAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "ev2",
    title: "DEKA Strong Championship",
    type: "DEKA",
    date: "Nov 8, 2026",
    location: "Austin, TX",
    hostName: "Life Time DEKA",
    hostEmail: "deka@lifetime.example",
    description:
      "23 strength-biased zones back to back. Qualifier standards apply for the Elite heat — Open heats welcome all fitness levels.",
    registrationLink: "https://deka.example.com/strong-championship",
    imageUrl: null,
    status: "approved",
    reports: [],
    createdAt: "2026-06-03T00:00:00.000Z",
  },
  {
    id: "ev3",
    title: "Spartan Sprint — Iron Peak",
    type: "Spartan",
    date: "Sep 27, 2026",
    location: "Boulder, CO",
    hostName: "Iron Peak Athletics",
    hostEmail: "events@ironpeak.example",
    description:
      "A 5K, 20-obstacle sprint through the foothills. Family heats in the morning, competitive heats in the afternoon.",
    registrationLink: "https://spartan.example.com/iron-peak-sprint",
    imageUrl: null,
    status: "approved",
    reports: [],
    createdAt: "2026-06-05T00:00:00.000Z",
  },
];

export const dealCategories = [
  "Gear & Apparel",
  "Nutrition & Supplements",
  "Gym Membership",
  "Recovery & Wellness",
  "Coaching",
  "Other",
];

export const seedDeals = [
  {
    id: "dl1",
    businessName: "SurgeFuel",
    businessEmail: "deals@surgefuel.example",
    title: "20% off race-day electrolyte packs",
    category: "Nutrition & Supplements",
    location: "Ships nationwide",
    discount: "20% off",
    expiry: "Sep 30, 2026",
    description: "Zero-sugar electrolyte mix built for race day. Use the code at checkout — stacks with subscribe & save.",
    imageUrl: null,
    status: "approved",
    reports: [],
    createdAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "dl2",
    businessName: "Iron Peak Athletics",
    businessEmail: "hello@ironpeak.example",
    title: "First month free on any membership",
    category: "Gym Membership",
    location: "Boulder, CO",
    discount: "1 month free",
    expiry: "Oct 15, 2026",
    description: "New members only. Includes full access to the HYROX training room and all group classes.",
    imageUrl: null,
    status: "approved",
    reports: [],
    createdAt: "2026-06-04T00:00:00.000Z",
  },
];
