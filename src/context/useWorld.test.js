import { advance, canRuleTheWorld } from './useWorld';
import { getCountry } from '../assets/countries';
import { ACCOMPLICE, GOLD, WALES } from '../components/common/Inventory';

const vatican = getCountry('vatican'); // 764 people
const tuvalu = getCountry('tuvalu'); // 11,400 people

const stationed = (delegation, progress = 0) => ({
  delegation,
  progress,
  conquered: false,
  paid: true,
});

const worldWith = (countries) => ({ countries, unlocked: true, sawEnding: false });

/** Tap Loot n times over. */
const tapTimes = (state, n) => {
  let current = state;
  const rewards = { [GOLD]: 0, [ACCOMPLICE]: 0 };
  const fallen = [];
  for (let i = 0; i < n; i++) {
    const result = advance(current);
    current = result.next;
    rewards[GOLD] += result.rewards[GOLD];
    rewards[ACCOMPLICE] += result.rewards[ACCOMPLICE];
    fallen.push(...result.fallen);
  }
  return { state: current, rewards, fallen };
};

describe('advance', () => {
  it('does nothing when no delegation is stationed', () => {
    const result = advance(worldWith({}));
    expect(result.changed).toBe(false);
    expect(result.fallen).toEqual([]);
  });

  it('loots a little on every tap', () => {
    // A delegation the size of the country takes 5% of it per tap.
    const one = advance(worldWith({ tuvalu: stationed(tuvalu.population) }));
    expect(one.changed).toBe(true);
    expect(one.next.countries.tuvalu.progress).toBeCloseTo(0.05, 10);

    const ten = tapTimes(worldWith({ tuvalu: stationed(tuvalu.population) }), 10);
    expect(ten.state.countries.tuvalu.progress).toBeCloseTo(0.5, 10);
    expect(ten.state.countries.tuvalu.conquered).toBe(false);
  });

  it('does not move on its own between taps', () => {
    // The whole point: no wall clock anywhere in here.
    const state = worldWith({ tuvalu: stationed(tuvalu.population) });
    const first = advance(state);
    const second = advance(state);
    expect(second.next.countries.tuvalu.progress).toBe(
      first.next.countries.tuvalu.progress
    );
  });

  it('adds to progress already banked', () => {
    const result = advance(worldWith({ tuvalu: stationed(tuvalu.population, 0.5) }));
    expect(result.next.countries.tuvalu.progress).toBeCloseTo(0.55, 10);
  });

  it('takes twenty taps at matched strength, and pays out on the last one', () => {
    const start = worldWith({ vatican: stationed(vatican.population) });

    const nineteen = tapTimes(start, 19);
    expect(nineteen.state.countries.vatican.conquered).toBe(false);
    expect(nineteen.rewards[GOLD]).toBe(0);

    const twenty = tapTimes(start, 20);
    expect(twenty.state.countries.vatican).toMatchObject({
      conquered: true,
      progress: 1,
      delegation: 0, // everyone comes home
    });
    expect(twenty.fallen).toEqual([vatican]);
    // The delegation returns, and the whole country joins them.
    expect(twenty.rewards[ACCOMPLICE]).toBe(vatican.population * 2);
    expect(twenty.rewards[GOLD]).toBe(vatican.population * 2500);
  });

  it('falls in two taps when the delegation overwhelms the place', () => {
    const start = worldWith({ vatican: stationed(vatican.population * 10) });
    expect(tapTimes(start, 1).state.countries.vatican.conquered).toBe(false);
    expect(tapTimes(start, 2).state.countries.vatican.conquered).toBe(true);
  });

  it('never reports progress past 100%', () => {
    const result = tapTimes(worldWith({ vatican: stationed(vatican.population) }), 500);
    expect(result.state.countries.vatican.progress).toBe(1);
  });

  it('loots every occupied country on the same tap', () => {
    const result = tapTimes(
      worldWith({
        vatican: stationed(vatican.population * 10),
        tuvalu: stationed(tuvalu.population * 10),
      }),
      2
    );

    expect(result.fallen.map((c) => c.id).sort()).toEqual(['tuvalu', 'vatican']);
    expect(result.rewards[ACCOMPLICE]).toBe(
      vatican.population * 11 + tuvalu.population * 11
    );
    expect(result.rewards[GOLD]).toBe((vatican.population + tuvalu.population) * 2500);
  });

  it('pays out only once, however many more times you tap', () => {
    const result = tapTimes(worldWith({ vatican: stationed(vatican.population * 10) }), 40);
    expect(result.fallen).toHaveLength(1);
    expect(result.rewards[GOLD]).toBe(vatican.population * 2500);
  });

  it('leaves conquered countries alone', () => {
    const conquered = { delegation: 0, progress: 1, conquered: true, paid: true };
    const result = advance(worldWith({ vatican: conquered }));
    expect(result.changed).toBe(false);
    expect(result.next.countries.vatican).toEqual(conquered);
    expect(result.rewards[GOLD]).toBe(0);
  });

  it('ignores a recalled delegation', () => {
    const recalled = { delegation: 0, progress: 0.4, conquered: false, paid: true };
    const result = advance(worldWith({ tuvalu: recalled }));
    expect(result.changed).toBe(false);
    expect(result.next.countries.tuvalu.progress).toBe(0.4);
  });

  it('ignores countries that are no longer in the roster', () => {
    const result = advance(worldWith({ atlantis: stationed(5000) }));
    expect(result.changed).toBe(false);
    expect(result.next.countries.atlantis).toBeDefined();
  });

  it('leaves the state it was handed untouched', () => {
    const state = worldWith({ tuvalu: stationed(tuvalu.population) });
    advance(state);
    expect(state.countries.tuvalu.progress).toBe(0);
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
