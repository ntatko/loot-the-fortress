const UNITS = [
  { value: 1e12, suffix: "T" },
  { value: 1e9, suffix: "B" },
  { value: 1e6, suffix: "M" },
  { value: 1e3, suffix: "K" },
];

/** 1428600000 -> "1.43B". Numbers get silly in this stage of the game. */
export const formatCount = (count) => {
  const rounded = Math.floor(count);
  const unit = UNITS.find((u) => Math.abs(rounded) >= u.value);
  if (!unit) {
    return rounded.toLocaleString();
  }
  const scaled = rounded / unit.value;
  const digits = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
  return `${scaled.toFixed(digits)}${unit.suffix}`;
};
