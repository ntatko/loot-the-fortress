import { formatCount, formatExact } from './format';

describe('formatCount', () => {
  it('leaves small numbers alone', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(3)).toBe('3');
    expect(formatCount(764)).toBe('764');
    expect(formatCount(999)).toBe('999');
  });

  it('keeps readable four figure numbers exact, with a comma', () => {
    // A shop price of 3,000 reads worse as "3.00K".
    expect(formatCount(1000)).toBe('1,000');
    expect(formatCount(3000)).toBe('3,000');
    expect(formatCount(9999)).toBe('9,999');
  });

  it('abbreviates from ten thousand up', () => {
    expect(formatCount(10000)).toBe('10.0K');
    expect(formatCount(11400)).toBe('11.4K');
    expect(formatCount(48200)).toBe('48.2K');
    expect(formatCount(123456)).toBe('123K');
    expect(formatCount(1000000)).toBe('1.00M');
    expect(formatCount(3200000)).toBe('3.20M');
    expect(formatCount(1428600000)).toBe('1.43B');
    expect(formatCount(5000000000000)).toBe('5.00T');
  });

  it('never renders a number wider than seven characters', () => {
    // The shop price box has to survive a phone.
    [0, 999, 9999, 12345, 999999, 1000000, 8100000000, 5e12].forEach((n) => {
      expect(formatCount(n).length).toBeLessThanOrEqual(7);
    });
  });

  it('floors fractional counts', () => {
    expect(formatCount(3.7)).toBe('3');
  });

  it('handles negatives without crashing', () => {
    expect(formatCount(-5)).toBe('-5');
    expect(formatCount(-2000000)).toBe('-2.00M');
  });
});

describe('formatExact', () => {
  it('spells the whole number out for a tooltip', () => {
    expect(formatExact(1000000)).toBe('1,000,000');
    expect(formatExact(3)).toBe('3');
  });
});
