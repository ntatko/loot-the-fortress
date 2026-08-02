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

/** 3661 -> "1h 1m". Used for delegation ETAs. */
export const formatDuration = (seconds) => {
  if (seconds === null || !isFinite(seconds)) {
    return "never";
  }
  const total = Math.max(1, Math.ceil(seconds));
  if (total < 60) {
    return `${total}s`;
  }
  const minutes = Math.floor(total / 60);
  if (minutes < 60) {
    return `${minutes}m ${total % 60}s`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${Math.floor(hours / 24)}d ${hours % 24}h`;
};
