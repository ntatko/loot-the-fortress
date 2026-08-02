import { advance, canRuleTheWorld } from './useWorld';
import { getCountry } from '../assets/countries';
import { ACCOMPLICE, GOLD, WALES } from '../components/common/Inventory';

const vatican = getCountry('vatican'); // 764 people
const tuvalu = getCountry('tuvalu'); // 11,400 people
const china = getCountry('china'); // 1.43 billion people

const stationed = (delegation, progress = 0) => ({
  delegation,
  progress,
  conquered: false,
  paid: true,
});

// advance() works off wall-clock deltas, so a state is "N seconds ago".
const secondsAgo = (countries, seconds) => ({
  countries,
  lastTick: 1000000 - seconds * 1000,
  unlocked: true,
  sawEnding: false,
});
const NOW = 1000000;

describe('advance', () => {
  it('does nothing when no delegation is stationed', () => {
    const result = advance(secondsAgo({}, 30), NOW);
    expect(result.changed).toBe(false);
    expect(result.fallen).toEqual([]);
  });

  it('moves a delegation forward by the elapsed time', () => {
    // A delegation the size of the country loots 2% of it per second.
    const result = advance(secondsAgo({ tuvalu: stationed(tuvalu.population) }, 10), NOW);
    expect(result.changed).toBe(true);
    expect(result.next.countries.tuvalu.progress).toBeCloseTo(0.2, 10);
    expect(result.next.countries.tuvalu.conquered).toBe(false);
    expect(result.fallen).toEqual([]);
  });

  it('adds to progress already banked', () => {
    const result = advance(
      secondsAgo({ tuvalu: stationed(tuvalu.population, 0.5) }, 10),
      NOW
    );
    expect(result.next.countries.tuvalu.progress).toBeCloseTo(0.7, 10);
  });

  it('settles a country once the looting completes', () => {
    const delegation = vatican.population * 10; // caps the rate: five seconds
    const result = advance(secondsAgo({ vatican: stationed(delegation) }, 6), NOW);

    expect(result.fallen).toEqual([vatican]);
    expect(result.next.countries.vatican).toMatchObject({
      conquered: true,
      progress: 1,
      delegation: 0, // everyone comes home
    });
    // The delegation returns, and the whole country joins them.
    expect(result.rewards[ACCOMPLICE]).toBe(delegation + vatican.population);
    expect(result.rewards[GOLD]).toBe(vatican.population * 2500);
  });

  it('never reports progress past 100%', () => {
    const result = advance(secondsAgo({ vatican: stationed(vatican.population) }, 99999), NOW);
    expect(result.next.countries.vatican.progress).toBe(1);
  });

  it('settles several countries in a single pass', () => {
    const result = advance(
      secondsAgo(
        {
          vatican: stationed(vatican.population * 10),
          tuvalu: stationed(tuvalu.population * 10),
        },
        6
      ),
      NOW
    );

    expect(result.fallen.map((c) => c.id).sort()).toEqual(['tuvalu', 'vatican']);
    expect(result.rewards[ACCOMPLICE]).toBe(
      vatican.population * 11 + tuvalu.population * 11
    );
    expect(result.rewards[GOLD]).toBe((vatican.population + tuvalu.population) * 2500);
  });

  it('leaves conquered countries alone', () => {
    const conquered = { delegation: 0, progress: 1, conquered: true, paid: true };
    const result = advance(secondsAgo({ vatican: conquered }, 3600), NOW);
    expect(result.changed).toBe(false);
    expect(result.next.countries.vatican).toEqual(conquered);
    expect(result.rewards[GOLD]).toBe(0);
  });

  it('ignores countries that are no longer in the roster', () => {
    const result = advance(secondsAgo({ atlantis: stationed(5000) }, 60), NOW);
    expect(result.changed).toBe(false);
    expect(result.next.countries.atlantis).toBeDefined();
  });

  it('credits time spent away, but only up to twelve hours', () => {
    const twelveHours = 12 * 60 * 60;
    const perSecond = (0.02 * 1000) / china.population;

    const halfDay = advance(secondsAgo({ china: stationed(1000) }, twelveHours), NOW);
    const aWeek = advance(secondsAgo({ china: stationed(1000) }, twelveHours * 14), NOW);

    expect(halfDay.next.countries.china.progress).toBeCloseTo(perSecond * twelveHours, 12);
    expect(aWeek.next.countries.china.progress).toBeCloseTo(perSecond * twelveHours, 12);
  });

  it('does not run backwards if the clock jumps', () => {
    const result = advance(secondsAgo({ tuvalu: stationed(tuvalu.population) }, -500), NOW);
    expect(result.changed).toBe(false);
    expect(result.next.countries.tuvalu.progress).toBe(0);
  });

  it('always moves lastTick up to now', () => {
    expect(advance(secondsAgo({}, 30), NOW).next.lastTick).toBe(NOW);
  });

  it('leaves the state it was handed untouched', () => {
    const state = secondsAgo({ tuvalu: stationed(tuvalu.population) }, 10);
    advance(state, NOW);
    expect(state.countries.tuvalu.progress).toBe(0);
    expect(state.lastTick).not.toBe(NOW);
  });
});

describe('canRuleTheWorld', () => {
  const full = [
    { type: WALES, count: 1 },
    { type: ACCOMPLICE, count: 3200000 },
  ];

  it('needs Wales and enough accomplices to fill it', () => {
    expect(canRuleTheWorld(full)).toBe(true);
  });

  it('rejects an empty Wales', () => {
    expect(canRuleTheWorld([{ type: WALES, count: 1 }, { type: ACCOMPLICE, count: 3199999 }]))
      .toBe(false);
  });

  it('rejects a crowd with nowhere to stand', () => {
    expect(canRuleTheWorld([{ type: ACCOMPLICE, count: 99000000 }])).toBe(false);
  });

  it('handles an inventory that has neither', () => {
    expect(canRuleTheWorld([{ type: GOLD, count: 10 }])).toBe(false);
    expect(canRuleTheWorld([])).toBe(false);
  });
});
