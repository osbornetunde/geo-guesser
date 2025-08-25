// Curated global question set. Each raw entry lists the correct `answer` plus three `distractors`.
// At module load we shuffle options so the correct answer's position is randomized and
// `answerIndex` is computed to match the shuffled options array.

import type { Question } from "./types";
import type { RawQ } from "./types/game";

// Seeded RNG (mulberry32) so shuffles are reproducible when a seed is provided.
// Seed selection order:
// 1. Vite env: import.meta.env.VITE_SEED (recommended for frontend builds/tests)
// 2. Node env: process.env.SEED
// 3. Fallback: fixed seed 1337
const getSeed = (): number => {
  // Prefer Vite-provided seed when available
  const viteSeed = import.meta.env?.VITE_SEED;
  if (viteSeed) return Number(viteSeed);

  // Fall back to Node env accessed via globalThis to avoid referencing `process` directly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeSeed = (globalThis as any)?.process?.env?.SEED;
  if (nodeSeed) return Number(nodeSeed);

  // No explicit seed provided — use current time as a non-deterministic fallback.
  // Use a 32-bit unsigned integer derived from Date.now()
  return (Date.now() & 0xffffffff) >>> 0;
};

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const rng = mulberry32(getSeed());

const shuffleArray = <T>(arr: T[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const rawQuestions: RawQ[] = [
  {
    id: "eiffel-tower-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Eiffel Tower",
    distractors: ["Arc de Triomphe", "Louvre Pyramid", "Notre-Dame Cathedral"],
    hint: "Iconic wrought-iron lattice tower in a European capital.",
    explain:
      "Designed by Gustave Eiffel, it was built for the 1889 Exposition Universelle and remains Paris’s most recognised landmark.",
    category: "landmark",
    country: "France",
    coords: { lat: 48.8584, lng: 2.2945 },
    difficulty: "easy",
  },
  {
    id: "grand-canyon-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/af/Grand_Canyon_view_from_Pima_Point_2010.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Grand Canyon",
    distractors: ["Zion Canyon", "Bryce Canyon", "Monument Valley"],
    hint: "A vast, steep-sided gorge carved by a major North American river.",
    explain:
      "The Grand Canyon in Arizona was carved by the Colorado River and exposes nearly two billion years of Earth’s geological history.",
    category: "nature",
    country: "USA",
    coords: { lat: 36.1069, lng: -112.1129 },
    difficulty: "medium",
  },
  {
    id: "great-wall-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/38/GreatWall_2004_Summer_4.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Great Wall of China",
    distractors: ["Terracotta Army", "Forbidden City", "Temple of Heaven"],
    hint: "Ancient series of fortifications running across northern Asia.",
    explain:
      "Built and rebuilt between the 7th century BC and the 17th century to protect Chinese states and empires from nomadic incursions.",
    category: "landmark",
    country: "China",
    coords: { lat: 40.4319, lng: 116.5704 },
    difficulty: "medium",
  },
  {
    id: "machu-picchu-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Machu Picchu",
    distractors: ["Sacsayhuamán", "Ollantaytambo", "Choquequirao"],
    hint: "High-altitude Inca citadel perched above a Urubamba valley.",
    explain:
      "Machu Picchu is an Inca site in Peru, famous for its dry-stone walls and panoramic mountain setting.",
    category: "cultural",
    country: "Peru",
    coords: { lat: -13.1631, lng: -72.545 },
    difficulty: "hard",
  },
  {
    id: "taj-mahal-1",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Taj Mahal",
    distractors: ["Red Fort", "Qutub Minar", "Humayun's Tomb"],
    hint: "White-marble mausoleum built as a monument to love.",
    explain:
      "Commissioned by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal, the Taj Mahal is an emblem of India’s Mughal architecture.",
    category: "landmark",
    country: "India",
    coords: { lat: 27.1751, lng: 78.0421 },
    difficulty: "easy",
  },
  {
    id: "sydney-opera-house-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Sydney_Opera_House_Sails.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Sydney Opera House",
    distractors: ["Harbour Bridge", "Bondi Beach", "Taronga Zoo"],
    hint: "Performing-arts centre known for its sail-like roof shells.",
    explain:
      "Designed by Jørn Utzon, the Sydney Opera House sits on Bennelong Point and is one of Australia’s most famous 20th-century buildings.",
    category: "landmark",
    country: "Australia",
    coords: { lat: -33.8568, lng: 151.2153 },
    difficulty: "easy",
  },
  {
    id: "burj-khalifa-1",
    image: "https://upload.wikimedia.org/wikipedia/en/9/93/Burj_Khalifa.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Burj Khalifa",
    distractors: ["Petronas Towers", "Shanghai Tower", "CN Tower"],
    hint: "World’s tallest skyscraper located in a Middle Eastern megacity.",
    explain:
      "The Burj Khalifa in Dubai is the tallest man-made structure in the world.",
    category: "landmark",
    country: "UAE",
    coords: { lat: 25.1972, lng: 55.2744 },
    difficulty: "medium",
  },
  {
    id: "colosseum-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseo_2020.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Colosseum",
    distractors: ["Pantheon", "Roman Forum", "St. Peter's Basilica"],
    hint: "Ancient Roman amphitheatre in a historic Italian city.",
    explain:
      "The Colosseum held gladiatorial contests and public spectacles in ancient Rome.",
    category: "cultural",
    country: "Italy",
    coords: { lat: 41.8902, lng: 12.4922 },
    difficulty: "easy",
  },
  {
    id: "golden-gate-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/GoldenGateBridge-001.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Golden Gate Bridge",
    distractors: ["Brooklyn Bridge", "Tower Bridge", "Sydney Harbour Bridge"],
    hint: "Suspension bridge painted in international orange spanning a foggy bay.",
    explain:
      "The Golden Gate Bridge connects San Francisco to Marin County and is a symbol of California.",
    category: "landmark",
    country: "USA",
    coords: { lat: 37.8199, lng: -122.4783 },
    difficulty: "easy",
  },
  {
    id: "great-pyramid-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Great Pyramid of Giza",
    distractors: ["Karnak Temple", "Luxor Temple", "Valley of the Kings"],
    hint: "Oldest and largest of the three pyramids on the Giza Plateau.",
    explain:
      "The Great Pyramid is the oldest of the Seven Wonders of the Ancient World and remains largely intact.",
    category: "historic",
    country: "Egypt",
    coords: { lat: 29.9792, lng: 31.1342 },
    difficulty: "hard",
  },
  {
    id: "table-mountain-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/dc/Table_Mountain_DanieVDM.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Table Mountain",
    distractors: ["Lion's Head", "Signal Hill", "Devil's Peak"],
    hint: "Flat-topped mountain overlooking a coastal South African city.",
    explain:
      "Table Mountain forms a prominent landmark overlooking Cape Town and the Atlantic seaboard.",
    category: "nature",
    country: "South Africa",
    coords: { lat: -33.9628, lng: 18.4098 },
    difficulty: "medium",
  },
  {
    id: "mount-fuji-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/f8/View_of_Mount_Fuji_from_%C5%8Cwakudani_20211202.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Mount Fuji",
    distractors: ["Mount Takao", "Mount Kita", "Mount Tate"],
    hint: "Iconic snow-capped stratovolcano and Japan's tallest peak.",
    explain:
      "Mount Fuji is a cultural and spiritual symbol of Japan and a popular climbing destination.",
    category: "nature",
    country: "Japan",
    coords: { lat: 35.3606, lng: 138.7274 },
    difficulty: "medium",
  },
  {
    id: "petra-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Treasury_petra_crop.jpeg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Petra",
    distractors: ["Jerash", "Amman Citadel", "Wadi Rum"],
    hint: "Rock-cut ancient city with a famous rose-red façade.",
    explain:
      "Petra in Jordan was the capital of the Nabataean Kingdom and is famous for its carved rock architecture and water conduit system.",
    difficulty: "hard",
  },
  {
    id: "aurora-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flames_in_the_sky.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Aurora Borealis",
    distractors: ["Zodiacal Light", "Milky Way Core", "Noctilucent Clouds"],
    hint: "Natural light display often seen toward the poles.",
    explain:
      "The aurora borealis (northern lights) and aurora australis (southern lights) are produced by charged particles colliding with Earth’s atmosphere.",
    difficulty: "hard",
  },
  {
    id: "niagara-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e0/Niagara_Falls_from_Canada.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Niagara Falls",
    distractors: ["Iguazu Falls", "Victoria Falls", "Yosemite Falls"],
    hint: "Large waterfalls on a border between two countries in North America.",
    explain:
      "Niagara Falls straddles the border between Canada and the United States and is famed for its volume and hydroelectric power generation.",
    difficulty: "easy",
  },
  {
    id: "angkor-wat-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d4/20171126_Angkor_Wat_4712_DxO.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Angkor Wat",
    distractors: ["Bayon Temple", "Ta Prohm", "Banteay Srei"],
    hint: "Massive temple complex and national symbol of a Southeast Asian country.",
    explain:
      "Angkor Wat in Cambodia is the world’s largest religious monument and a masterpiece of Khmer architecture.",
    difficulty: "medium",
  },
  {
    id: "chichen-itza-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Chichen_Itza_3.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Chichén Itzá",
    distractors: ["Tikal", "Uxmal", "Palenque"],
    hint: "Mesoamerican step-pyramid and astronomical monument.",
    explain:
      "A major Mayan city on the Yucatán Peninsula, Chichén Itzá’s Kukulcán pyramid aligns with equinox shadow events.",
    difficulty: "medium",
  },
  {
    id: "mount-everest-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Mount_Everest_as_seen_from_Drukair2_PLW_edit.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Mount Everest",
    distractors: ["K2", "Kangchenjunga", "Lhotse"],
    hint: "Earth’s highest mountain above sea level.",
    explain:
      "Sitting on the border between Nepal and China (Tibet), Mount Everest is the world’s tallest peak at 8,848 m (approx).",
    category: "nature",
    country: "Nepal/China",
    difficulty: "hard",
  },
  {
    id: "great-barrier-reef-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/de/Part_of_Great_Barrier_Reef_from_Helicopter.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Great Barrier Reef",
    distractors: [
      "Belize Barrier Reef",
      "Red Sea Coral Reef",
      "New Caledonia Barrier Reef",
    ],
    hint: "World’s largest coral reef system off the coast of a large island continent.",
    explain:
      "Off the coast of Queensland, Australia, the Great Barrier Reef is the largest coral reef ecosystem on Earth.",
    category: "nature",
    country: "Australia",
    difficulty: "medium",
  },
  {
    id: "statue-of-liberty-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Statue_of_Liberty_7.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Statue of Liberty",
    distractors: ["Ellis Island", "Brooklyn Bridge", "Empire State Building"],
    hint: "Copper statue gifted by a European country symbolising freedom.",
    explain:
      "A gift from France to the United States, the Statue of Liberty stands on Liberty Island in New York Harbor.",
    category: "landmark",
    country: "USA",
    difficulty: "easy",
  },
  {
    id: "santorini-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/3d/Santorini-20070808-058248-panorama-small.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Santorini",
    distractors: ["Mykonos", "Crete", "Corfu"],
    hint: "Greek island known for whitewashed houses and blue-domed churches.",
    explain:
      "Santorini is a volcanic island in the Aegean Sea famed for dramatic views, sunsets, and its cliffside towns.",
    difficulty: "easy",
  },
  {
    id: "zuma-rock-1",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Zuma_Rock.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Zuma Rock",
    distractors: ["Aso Rock", "Olumo Rock", "Sukur Cultural Landscape"],
    hint: "Gigantic monolith near Abuja, often called the 'Gateway to Abuja'.",
    explain:
      "A massive monolithic inselberg just north of Nigeria’s capital that’s a cultural landmark and notable natural feature.",
    category: "natural landmark",
    country: "Nigeria",
    coords: { lat: 9.2134, lng: 7.2498 },
    difficulty: "medium",
  },
  {
    id: "olumo-rock-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/bf/Elevator_gears_at_Olumo.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Olumo Rock",
    distractors: ["Zuma Rock", "Aso Rock", "Nike Art Gallery"],
    hint: "Historic fortress rock in Abeokuta, once a refuge in tribal wars.",
    explain:
      "A 19th-century natural fortress used by the Egba people during inter-tribal conflicts; now a major tourist site and archaeological treasure.",
    category: "historic natural landmark",
    country: "Nigeria",
    coords: { lat: 7.15, lng: 3.35 },
    difficulty: "medium",
  },
  {
    id: "black-star-square-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/53/Independence_Square%2C_Accra%2C_Ghana.JPG",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Black Star Square (Independence Square)",
    distractors: ["Kwame Nkrumah Mausoleum", "Elmina Castle", "Osu Castle"],
    hint: "Huge public square in Accra used for national parades and independence celebrations.",
    explain:
      "Commissioned by Ghana’s first president in 1961, it was built to celebrate independence and remains the site of major civic ceremonies.",
    category: "public square",
    country: "Ghana",
    coords: { lat: 5.55, lng: -0.2 },
    difficulty: "easy",
  },
  {
    id: "kwame-nkrumah-mausoleum-1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Kwame_Nkrumah_Mausoleum_in_Accra_Ghana%2C_May_2008.jpg",
    credit: "Wikimedia Commons",
    license: "See file page",
    answer: "Kwame Nkrumah Mausoleum",
    distractors: ["Black Star Square", "Osu Castle", "Lake Volta"],
    hint: "Accra memorial park built as an upside-down sword clad in marble.",
    explain:
      "Dedicated to Ghana’s first president, it features his tomb, museum, and design elements symbolizing peace and unity.",
    category: "monument/museum",
    country: "Ghana",
    coords: { lat: 5.5508, lng: -0.1981 },
    difficulty: "medium",
  },
];

export const questions = rawQuestions.map((q): Question => {
  const options = shuffleArray([q.answer, ...q.distractors]);
  const answerIndex = options.findIndex((o) => o === q.answer);
  return {
    id: q.id,
    image: q.image,
    credit: q.credit ?? "",
    license: q.license,
    options,
    answerIndex,
    hint: q.hint,
    explain: q.explain ?? "",
    // pass through metadata for future UI/use
    category: q.category,
    country: q.country,
    coords: q.coords,
    difficulty: q.difficulty,
  };
});
