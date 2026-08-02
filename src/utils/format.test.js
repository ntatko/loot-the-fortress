import { formatCount } from './format';

describe('formatCount', () => {
  it('leaves small numbers alone', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(764)).toBe('764');
    expect(formatCount(999)).toBe('999');
  });

  it('abbreviates larger numbers', () => {
    expect(formatCount(11400)).toBe('11.4K');
    expect(formatCount(3200000)).toBe('3.20M');
    expect(formatCount(1428600000)).toBe('1.43B');
    expect(formatCount(5000000000000)).toBe('5.00T');
  });

  it('drops decimals as the number gets wider', () => {
    expect(formatCount(1234)).toBe('1.23K');
    expect(formatCount(12345)).toBe('12.3K');
    expect(formatCount(123456)).toBe('123K');
  });

  it('floors fractional counts', () => {
    expect(formatCount(3.7)).toBe('3');
  });
});
