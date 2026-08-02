import { formatCount, formatDuration } from './format';

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

describe('formatDuration', () => {
  it('counts seconds', () => {
    expect(formatDuration(5)).toBe('5s');
    expect(formatDuration(59)).toBe('59s');
  });

  it('rounds part-seconds up, never to zero', () => {
    expect(formatDuration(4.2)).toBe('5s');
    expect(formatDuration(0.1)).toBe('1s');
    expect(formatDuration(0)).toBe('1s');
  });

  it('breaks into minutes, hours and days', () => {
    expect(formatDuration(90)).toBe('1m 30s');
    expect(formatDuration(3660)).toBe('1h 1m');
    expect(formatDuration(90000)).toBe('1d 1h');
  });

  it('says so when a delegation will never finish', () => {
    expect(formatDuration(null)).toBe('never');
    expect(formatDuration(Infinity)).toBe('never');
  });
});
