/**
 * Format the duration between two dates in a human-readable format
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns Formatted duration string (e.g., "2 days 3 hours", "3 hours 30 mins", "45 mins")
 */
export function formatDuration(startDate: Date, endDate: Date): string {
  const diffMs = endDate.getTime() - startDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  const parts: string[] = [];

  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);

  if (mins > 0 && days === 0) parts.push(`${mins} min${mins > 1 ? "s" : ""}`);

  return parts.length > 0 ? parts.join(" ") : "0 mins";
}
