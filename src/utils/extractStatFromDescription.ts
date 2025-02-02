// A helper that strips HTML tags and searches for a stat in the plain text.
export function extractStatFromDescription(
  description: string,
  statLabel: string
): number {
  // Remove HTML tags (e.g. <mainText>, <attention>, etc.)
  const plain = description.replace(/<[^>]+>/g, " ");
  // Create a regex to search for the stat label followed by a number.
  // This example looks for something like "Lethality 15" or "Ability Power: 20"
  const regex = new RegExp(`${statLabel}[:\\s]*([\\d\\.]+)`, "i");
  const match = plain.match(regex);
  return match && match[1] ? parseFloat(match[1]) : 0;
}
