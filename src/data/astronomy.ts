import {factSchema, sourceSchema} from '../content/schema';

export const astronomySources = sourceSchema.array().parse([
  {
    id: 'nasa-earth-fact-sheet',
    organization: 'NASA Goddard / NSSDC',
    title: 'Earth Fact Sheet',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
    retrieved: '2026-09-22',
  },
  {
    id: 'jpl-planetary-physical-parameters',
    organization: 'NASA Jet Propulsion Laboratory',
    title: 'Planetary Physical Parameters',
    url: 'https://ssd.jpl.nasa.gov/planets/phys_par.html',
    retrieved: '2026-09-22',
  },
  {
    id: 'nasa-universe-glossary-solar-radius',
    organization: 'NASA Science',
    title: 'Universe glossary — solar radius',
    url: 'https://science.nasa.gov/universe/glossary/',
    retrieved: '2026-09-22',
  },
  {
    id: 'nasa-solar-math-relative-stars',
    organization: 'NASA Space Math',
    title: 'The relative sizes of the Sun and stars',
    url: 'https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/s/Solar_Math.pdf',
    retrieved: '2026-09-22',
  },
  {
    id: 'nasa-betelgeuse-2024',
    organization: 'NASA',
    title: 'Betelgeuse! Betelgeuse! Betelgeuse!',
    url: 'https://www.nasa.gov/blogs/watch-the-skies/2024/09/06/betelgeuse-betelgeuse-betelgeuse-stargazers-wont-see-ghosts-but-supergiant-star-for-spooky-season/',
    retrieved: '2026-09-22',
  },
]);

export const astronomyFacts = factSchema.array().parse([
  {
    id: 'earth-mean-radius-km',
    claim: "Earth's volumetric mean radius",
    value: 6371,
    unit: 'km',
    basis: 'measured',
    sourceIds: ['nasa-earth-fact-sheet'],
    display: '6,371 km mean radius',
    notes: 'The video doubles this value for its rounded 12,742 km diameter label.',
  },
  {
    id: 'jupiter-mean-radius-km',
    claim: "Jupiter's volumetric mean radius",
    value: 69911,
    unit: 'km',
    basis: 'measured',
    sourceIds: ['jpl-planetary-physical-parameters'],
    display: '69,911 km mean radius',
    notes: 'Compared like-for-like with the volumetric mean radius of Earth.',
  },
  {
    id: 'sun-radius-km',
    claim: 'Nominal solar radius used as a stellar-size unit',
    value: 695700,
    unit: 'km',
    basis: 'defined',
    sourceIds: ['nasa-universe-glossary-solar-radius'],
    display: '695,700 km solar radius',
    notes: 'NASA defines this convenient stellar-size unit in its universe glossary.',
  },
  {
    id: 'rigel-radius-solar',
    claim: "Rigel's approximate radius relative to the Sun",
    value: 50,
    unit: 'solar-radii',
    basis: 'estimated',
    sourceIds: ['nasa-solar-math-relative-stars'],
    display: '≈50 solar radii',
    notes: 'A rounded educational comparison. The video visibly uses an approximation mark.',
  },
  {
    id: 'betelgeuse-radius-solar',
    claim: "Betelgeuse's estimated radius relative to the Sun",
    value: 724,
    unit: 'solar-radii',
    basis: 'estimated',
    sourceIds: ['nasa-betelgeuse-2024'],
    display: 'estimated ≈724 solar radii',
    notes: 'Betelgeuse is variable and distance/model assumptions produce different radius estimates. No largest-star claim is made.',
  },
]);

export const factById = Object.fromEntries(
  astronomyFacts.map((fact) => [fact.id, fact]),
);

export const scaleRatios = {
  jupiterToEarth:
    factById['jupiter-mean-radius-km']!.value / factById['earth-mean-radius-km']!.value,
  sunToJupiter:
    factById['sun-radius-km']!.value / factById['jupiter-mean-radius-km']!.value,
  rigelToSun: factById['rigel-radius-solar']!.value,
  betelgeuseToSun: factById['betelgeuse-radius-solar']!.value,
} as const;

