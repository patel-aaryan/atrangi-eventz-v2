import type { TicketType } from "@/types/checkout";
import type { TicketTier } from "@atrangi/types";

/**
 * Transform TicketTier (from database) to TicketType (for frontend drawer)
 */
export function transformTicketTier(
  tier: TicketTier,
  index: number,
): TicketType {
  const available = tier.remaining;
  return {
    id: `ticket-${index}`,
    name: tier.name,
    price: tier.price,
    description: tier.description || "",
    maxQuantity: Math.min(10, available), // Max 10 per order or available
    available,
    features: tier.features || [],
  };
}
