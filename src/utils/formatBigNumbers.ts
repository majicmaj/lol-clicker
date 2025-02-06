export function formatBigNumbers(n: number | string, decimals = 1): string {
  const num = Number(n);
  const absNum = Math.abs(num);

  // If the number is less than 1000, just return it as a string.
  if (absNum < 1000) {
    return num.toString();
  }

  let formatted;

  // If it's larger than Sx, format it in scientific notation
  if (absNum >= 1e27) {
    formatted = num.toExponential(decimals);
  } else if (absNum >= 1e24) {
    formatted = (num / 1e24).toFixed(1) + "Sx";
  } else if (absNum >= 1e21) {
    formatted = (num / 1e21).toFixed(1) + "Sp";
  } else if (absNum >= 1e18) {
    formatted = (num / 1e18).toFixed(1) + "Qa";
  } else if (absNum >= 1e15) {
    formatted = (num / 1e15).toFixed(1) + "Qu";
  } else if (absNum >= 1e12) {
    formatted = (num / 1e12).toFixed(1) + "T";
  } else if (absNum >= 1e9) {
    formatted = (num / 1e9).toFixed(1) + "B";
  } else if (absNum >= 1e6) {
    formatted = (num / 1e6).toFixed(1) + "M";
  } else if (absNum >= 1e3) {
    formatted = (num / 1e3).toFixed(1) + "K";
  }

  // Remove trailing '.0' if present (e.g. "1.0K" becomes "1K")
  formatted = formatted.replace(/\.0([BKM])/, "$1");

  return formatted;
}
