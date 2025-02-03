export function formatBigNumbers(n: number | string): string {
  const num = Number(n);
  const absNum = Math.abs(num);

  // If the number is less than 1000, just return it as a string.
  if (absNum < 1000) {
    return num.toString();
  }

  let formatted;

  if (absNum >= 1e9) {
    // Format billions
    formatted = (num / 1e9).toFixed(1) + "B";
  } else if (absNum >= 1e6) {
    // Format millions
    formatted = (num / 1e6).toFixed(1) + "M";
  } else if (absNum >= 1e3) {
    // Format thousands
    formatted = (num / 1e3).toFixed(1) + "K";
  } else {
    // Format hundreds
    formatted = num.toFixed(1);
  }

  // Remove trailing '.0' if present (e.g. "1.0K" becomes "1K")
  formatted = formatted.replace(/\.0([BKM])/, "$1");

  return formatted;
}
