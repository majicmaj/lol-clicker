// A helper that extracts a stat's value from an item description.
// It first isolates the <stats> block (if it exists) so that values in other sections (like passives)
// aren't accidentally matched.
export function extractStatFromDescription(
  description: string,
  statLabel: string
): number {
  // Try to extract the content of the <stats> block.
  const statsMatch = description.match(/<stats[^>]*>(.*?)<\/stats>/is);
  // If found, only use that section; otherwise, fall back to the entire description.
  const statsSection = statsMatch ? statsMatch[1] : description;

  // Remove HTML tags from the stats section.
  const plainText = statsSection.replace(/<[^>]+>/g, " ");

  // Attempt 1: Look for a number that appears immediately BEFORE the stat label.
  // This handles cases like "15 Lethality"
  let regex = new RegExp(`([\\d\\.]+)(?=\\s+${statLabel}\\b)`, "i");
  let match = plainText.match(regex);
  if (match && match[1]) {
    return parseFloat(match[1]);
  }

  // Attempt 2 (fallback): Look for the stat label followed by a number.
  // This handles cases like "Ability Power: 20"
  regex = new RegExp(`${statLabel}\\s*[:\\s]+([\\d\\.]+)`, "i");
  match = plainText.match(regex);
  return match && match[1] ? parseFloat(match[1]) : 0;
}
