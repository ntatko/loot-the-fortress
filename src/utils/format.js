const UNITS = [
  { value: 1e12, suffix: "T" },
  { value: 1e9, suffix: "B" },
  { value: 1e6, suffix: "M" },
  { value: 1e3, suffix: "K" },
];

// Under this, the digits are still readable at a glance and being exact is
// worth more than being short — a price of 3,000 shouldn't read as "3.00K".
const ABBREVIATE_FROM = 10000;

/**
 * 3000 -> "3,000", 1428600000 -> "1.43B". Numbers in this game run from three
 * gold to the population of China, and the wide ones have to survive a phone.
 */
export const formatCount = (count) => {
  const rounded = Math.floor(count);

  // Fixed locale: a German browser would otherwise render 3000 as "3.000",
  // which collides with the decimal point in the abbreviated forms.
  if (Math.abs(rounded) < ABBREVIATE_FROM) {
    return rounded.toLocaleString("en-US");
  }

  const unit = UNITS.find((u) => Math.abs(rounded) >= u.value);
  const scaled = rounded / unit.value;
  const digits = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
  return `${scaled.toFixed(digits)}${unit.suffix}`;
};

/** The exact figure, for the tooltip behind a shortened one. */
export const formatExact = (count) => Math.floor(count).toLocaleString("en-US");
