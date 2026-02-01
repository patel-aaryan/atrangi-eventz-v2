import type { Sponsor } from "@atrangi/types";

interface SponsorsResponse {
  sponsors: Sponsor[];
  count: number;
}

/**
 * Fetch all sponsors
 */
export async function getSponsors(): Promise<Sponsor[]> {
  const response = await fetch("/api/sponsors", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to fetch sponsors" }));
    throw new Error(error.error || "Failed to fetch sponsors");
  }

  const data: SponsorsResponse = await response.json();
  return data.sponsors;
}
