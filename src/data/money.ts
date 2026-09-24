import {factSchema, sourceSchema} from '../content/schema';

const metresPerMile = 1609.344;

export const moneySources = sourceSchema.array().parse([
  {
    id: 'us-currency-100-note',
    organization: 'U.S. Currency Education Program',
    title: '$100 Note',
    url: 'https://www.uscurrency.gov/denominations/100',
    retrieved: '2026-09-24',
  },
  {
    id: 'us-currency-facts',
    organization: 'U.S. Currency Education Program',
    title: 'Currency Facts',
    url: 'https://www.uscurrency.gov/index.php/about-us/currency-facts',
    retrieved: '2026-09-24',
  },
  {
    id: 'burj-khalifa-fact-sheet',
    organization: 'Emaar Properties / Burj Khalifa',
    title: 'Burj Khalifa Fact Sheet',
    url: 'https://www.burjkhalifa.ae/img/fact-sheet.pdf',
    retrieved: '2026-09-24',
  },
]);

export const moneyFacts = factSchema.array().parse([
  {
    id: 'hundred-dollar-note-value-usd',
    claim: 'Face value of each note used in the comparison',
    value: 100,
    unit: 'usd',
    basis: 'defined',
    sourceIds: ['us-currency-100-note'],
    display: '$100',
    notes: 'The comparison uses current-design U.S. $100 Federal Reserve notes.',
  },
  {
    id: 'hundred-dollar-note-width-mm',
    claim: 'Long dimension of a current U.S. $100 note',
    value: 155.956,
    unit: 'mm',
    basis: 'defined',
    sourceIds: ['us-currency-100-note'],
    display: '155.956 mm',
    notes: 'Converted from the official 6.14-inch long dimension.',
  },
  {
    id: 'hundred-dollar-note-height-mm',
    claim: 'Short dimension of a current U.S. $100 note',
    value: 66.294,
    unit: 'mm',
    basis: 'defined',
    sourceIds: ['us-currency-100-note'],
    display: '66.294 mm',
    notes: 'Converted from the official 2.61-inch short dimension.',
  },
  {
    id: 'us-banknote-weight-g',
    claim: 'Approximate weight of one U.S. banknote',
    value: 1,
    unit: 'g',
    basis: 'estimated',
    sourceIds: ['us-currency-facts'],
    display: '≈1 g',
    notes: 'The U.S. Currency Education Program says a banknote weighs approximately one gram regardless of denomination.',
  },
  {
    id: 'billion-in-hundreds-note-count',
    claim: 'Number of $100 notes required to total one billion dollars',
    value: 10000000,
    unit: 'count',
    basis: 'derived',
    sourceIds: ['us-currency-100-note'],
    display: '10,000,000 notes',
    notes: 'Derived as $1,000,000,000 divided by $100 per note.',
  },
  {
    id: 'billion-in-hundreds-weight-kg',
    claim: 'Approximate mass of one billion dollars in $100 notes',
    value: 10000,
    unit: 'kg',
    basis: 'derived',
    sourceIds: ['us-currency-facts', 'us-currency-100-note'],
    display: '≈10,000 kg',
    notes: 'Derived from 10,000,000 notes at approximately one gram each; equivalent to about 10 metric tons.',
  },
  {
    id: 'billion-single-stack-height-m',
    claim: 'Approximate height of ten million U.S. banknotes in one stack',
    value: metresPerMile * (10000000 / 14500000),
    unit: 'm',
    basis: 'derived',
    sourceIds: ['us-currency-facts', 'us-currency-100-note'],
    display: '≈1.1 km',
    notes: 'Derived from the official statement that a mile-high stack contains more than 14.5 million notes. The result is intentionally rounded and is a slight upper estimate.',
  },
  {
    id: 'burj-khalifa-height-m',
    claim: 'Architectural height of Burj Khalifa',
    value: 828,
    unit: 'm',
    basis: 'measured',
    sourceIds: ['burj-khalifa-fact-sheet'],
    display: '828 m',
    notes: 'Official architectural height reported by the building owner.',
  },
]);

export const moneyFactById = Object.fromEntries(
  moneyFacts.map((fact) => [fact.id, fact]),
);

export const moneyScale = {
  billValue: moneyFactById['hundred-dollar-note-value-usd']!.value,
  billionNoteCount: moneyFactById['billion-in-hundreds-note-count']!.value,
  billionWeightKg: moneyFactById['billion-in-hundreds-weight-kg']!.value,
  billionStackHeightM: moneyFactById['billion-single-stack-height-m']!.value,
  millionNoteCount: 10000,
  millionStackHeightM:
    moneyFactById['billion-single-stack-height-m']!.value / 1000,
  blockColumns: 25,
  blockRows: 40,
  blockWidthM:
    moneyFactById['hundred-dollar-note-width-mm']!.value * 25 / 1000,
  blockDepthM:
    moneyFactById['hundred-dollar-note-height-mm']!.value * 40 / 1000,
  burjHeightM: moneyFactById['burj-khalifa-height-m']!.value,
} as const;
