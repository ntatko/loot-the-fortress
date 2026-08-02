import {
  COUNTRIES,
  conquestReward,
  delegationPrice,
  fastestDelegation,
  getCountry,
  progressPerTap,
  tapsToFall,
  WALES_POPULATION,
} from './countries';

const vatican = getCountry('vatican');
const tuvalu = getCountry('tuvalu');

describe('the country roster', () => {
  it('has unique ids', () => {
    const ids = COUNTRIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('is ordered smallest country first', () => {
    const populations = COUNTRIES.map((c) => c.population);
    expect(populations).toEqual([...populations].sort((a, b) => a - b));
  });

  it('accounts for the whole planet once Wales is included', () => {
    const total = COUNTRIES.reduce((sum, c) => sum + c.population, WALES_POPULATION);
    expect(total).toBe(8100000000);
  });

  it('gives every country a positive population', () => {
    COUNTRIES.forEach((c) => expect(c.population).toBeGreaterThan(0));
  });

  it('looks countries up by id', () => {
    expect(getCountry('vatican').name).toBe('Vatican City');
    expect(getCountry('nowhere')).toBeUndefined();
  });
});

describe('the conquest economy', () => {
  it('always pays out more than the entry fee', () => {
    COUNTRIES.forEach((c) => {
      expect(conquestReward(c)).toBeGreaterThan(delegationPrice(c));
    });
  });

  it('prices entry and rewards per head', () => {
    expect(delegationPrice(vatican)).toBe(764 * 1000);
    expect(conquestReward(vatican)).toBe(764 * 2500);
  });

  it('stays inside safe integer range for the largest country', () => {
    const biggest = COUNTRIES[COUNTRIES.length - 1];
    expect(conquestReward(biggest)).toBeLessThan(Number.MAX_SAFE_INTEGER);
  });
});

describe('progressPerTap', () => {
  it('is zero without a delegation', () => {
    expect(progressPerTap(tuvalu, 0)).toBe(0);
    expect(progressPerTap(tuvalu, -5)).toBe(0);
  });

  it('takes 20 taps when the delegation matches the population', () => {
    expect(progressPerTap(tuvalu, tuvalu.population)).toBeCloseTo(0.05, 10);
    expect(tapsToFall(tuvalu, tuvalu.population)).toBe(20);
  });

  it('halving the delegation doubles the taps', () => {
    expect(tapsToFall(tuvalu, tuvalu.population / 2)).toBe(40);
  });

  it('caps out at two taps however many you send', () => {
    expect(tapsToFall(tuvalu, tuvalu.population * 10)).toBe(2);
    expect(tapsToFall(tuvalu, tuvalu.population * 1000000)).toBe(2);
  });

  it('reports the cheapest delegation that reaches the cap', () => {
    expect(fastestDelegation(tuvalu)).toBe(tuvalu.population * 10);
    expect(tapsToFall(tuvalu, fastestDelegation(tuvalu))).toBe(2);
  });

  it('accounts for progress already made', () => {
    expect(tapsToFall(tuvalu, tuvalu.population, 0.5)).toBe(10);
  });

  it('counts whole taps, since you cannot tap half a time', () => {
    expect(Number.isInteger(tapsToFall(tuvalu, tuvalu.population / 3))).toBe(true);
  });

  it('never finishes with nobody stationed', () => {
    expect(tapsToFall(tuvalu, 0)).toBeNull();
  });
});
