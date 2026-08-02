// Stage three: once you have enough accomplices to populate Wales, you stop
// stealing gold and start "buying" countries with it. A delegation of Welsh
// accomplices is stationed abroad, loots the place, and the population joins
// the cause. Repeat until Wales is the only country left standing.

export const WALES_POPULATION = 3200000;

const WORLD_POPULATION = 8100000000;

// Every accomplice you station abroad loots this share of the local population
// per second, so a delegation the size of the country takes ~50 seconds.
const LOOT_RATE = 0.02;

// ...but a country can never fall in less than five seconds, no matter how
// absurdly large the delegation is.
const MAX_LOOT_RATE = 0.2;

// What it costs, in gold, to get a delegation through the door.
const PRICE_PER_CAPITA = 1000;

// What that country's treasury is worth once the delegation owns the place.
const REWARD_PER_CAPITA = 2500;

const NATIONS = [
  { id: "vatican", name: "Vatican City", flag: "🇻🇦", population: 764 },
  { id: "tuvalu", name: "Tuvalu", flag: "🇹🇻", population: 11400 },
  { id: "nauru", name: "Nauru", flag: "🇳🇷", population: 12800 },
  { id: "san-marino", name: "San Marino", flag: "🇸🇲", population: 33600 },
  { id: "monaco", name: "Monaco", flag: "🇲🇨", population: 38400 },
  { id: "liechtenstein", name: "Liechtenstein", flag: "🇱🇮", population: 39600 },
  { id: "andorra", name: "Andorra", flag: "🇦🇩", population: 80100 },
  { id: "iceland", name: "Iceland", flag: "🇮🇸", population: 393000 },
  { id: "malta", name: "Malta", flag: "🇲🇹", population: 542000 },
  { id: "luxembourg", name: "Luxembourg", flag: "🇱🇺", population: 660000 },
  { id: "estonia", name: "Estonia", flag: "🇪🇪", population: 1370000 },
  {
    id: "northern-ireland",
    name: "Northern Ireland",
    flag: "🇬🇧",
    population: 1900000,
  },
  { id: "slovenia", name: "Slovenia", flag: "🇸🇮", population: 2120000 },
  { id: "ireland", name: "Ireland", flag: "🇮🇪", population: 5230000 },
  { id: "new-zealand", name: "New Zealand", flag: "🇳🇿", population: 5250000 },
  { id: "scotland", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", population: 5470000 },
  { id: "norway", name: "Norway", flag: "🇳🇴", population: 5520000 },
  { id: "denmark", name: "Denmark", flag: "🇩🇰", population: 5950000 },
  { id: "switzerland", name: "Switzerland", flag: "🇨🇭", population: 8850000 },
  { id: "portugal", name: "Portugal", flag: "🇵🇹", population: 10300000 },
  { id: "belgium", name: "Belgium", flag: "🇧🇪", population: 11700000 },
  { id: "netherlands", name: "Netherlands", flag: "🇳🇱", population: 17900000 },
  { id: "australia", name: "Australia", flag: "🇦🇺", population: 26700000 },
  { id: "poland", name: "Poland", flag: "🇵🇱", population: 36700000 },
  { id: "canada", name: "Canada", flag: "🇨🇦", population: 40100000 },
  { id: "spain", name: "Spain", flag: "🇪🇸", population: 48400000 },
  { id: "south-korea", name: "South Korea", flag: "🇰🇷", population: 51700000 },
  { id: "england", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", population: 57100000 },
  { id: "italy", name: "Italy", flag: "🇮🇹", population: 58900000 },
  { id: "france", name: "France", flag: "🇫🇷", population: 68400000 },
  { id: "germany", name: "Germany", flag: "🇩🇪", population: 84500000 },
  { id: "japan", name: "Japan", flag: "🇯🇵", population: 123300000 },
  { id: "mexico", name: "Mexico", flag: "🇲🇽", population: 129400000 },
  { id: "russia", name: "Russia", flag: "🇷🇺", population: 144400000 },
  { id: "brazil", name: "Brazil", flag: "🇧🇷", population: 216400000 },
  { id: "nigeria", name: "Nigeria", flag: "🇳🇬", population: 223800000 },
  { id: "indonesia", name: "Indonesia", flag: "🇮🇩", population: 277500000 },
  { id: "united-states", name: "United States", flag: "🇺🇸", population: 335900000 },
  { id: "china", name: "China", flag: "🇨🇳", population: 1425700000 },
  { id: "india", name: "India", flag: "🇮🇳", population: 1428600000 },
];

const namedPopulation = NATIONS.reduce((sum, n) => sum + n.population, 0);

// Everyone who didn't get their own card. They fall last, all at once.
const REST_OF_WORLD = {
  id: "rest-of-world",
  name: "The Rest of the World",
  flag: "🌍",
  population: WORLD_POPULATION - namedPopulation - WALES_POPULATION,
};

export const COUNTRIES = [...NATIONS, REST_OF_WORLD].sort(
  (a, b) => a.population - b.population
);

const COUNTRIES_BY_ID = COUNTRIES.reduce((map, country) => {
  map[country.id] = country;
  return map;
}, {});

export const getCountry = (id) => COUNTRIES_BY_ID[id];

export const delegationPrice = (country) =>
  country.population * PRICE_PER_CAPITA;

export const conquestReward = (country) =>
  country.population * REWARD_PER_CAPITA;

/**
 * The smallest delegation that still hits MAX_LOOT_RATE. Anything beyond this
 * is wasted — the country falls in five seconds either way.
 */
export const fastestDelegation = (country) =>
  Math.ceil((MAX_LOOT_RATE / LOOT_RATE) * country.population);

/** Share of a country a delegation of this size loots per second. */
export const lootRate = (country, delegation) => {
  if (delegation <= 0) {
    return 0;
  }
  return Math.min(MAX_LOOT_RATE, (LOOT_RATE * delegation) / country.population);
};

/** Seconds until this delegation finishes looting, or null if it never will. */
export const lootEta = (country, delegation, progress = 0) => {
  const rate = lootRate(country, delegation);
  if (rate <= 0) {
    return null;
  }
  return (1 - progress) / rate;
};
