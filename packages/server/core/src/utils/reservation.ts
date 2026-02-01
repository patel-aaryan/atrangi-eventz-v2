import type { TicketTier } from "@atrangi/types";

interface Reservation {
  tierIndex: number;
  quantity: number;
}

interface TierValidation {
  tierIndex: number;
  remaining: number;
}

interface TierAvailability {
  remaining: number;
  reserved: number;
}

/**
 * Validate batch reservation inputs
 */
export function validateBatchReservationInputs(
  reservations: Reservation[]
): void {
  if (!reservations || reservations.length === 0) {
    throw new Error("At least one reservation is required");
  }

  for (const reservation of reservations) {
    if (reservation.quantity <= 0) {
      throw new Error("Requested quantity must be greater than 0");
    }
  }
}

/**
 * Validate tiers exist and check capacities
 */
export function validateTiersAndCapacities(
  reservations: Reservation[],
  ticketTiers: TicketTier[]
): TierValidation[] {
  const tierValidations: TierValidation[] = [];

  for (const reservation of reservations) {
    if (reservation.tierIndex >= ticketTiers.length) {
      throw new Error(`Tier at index ${reservation.tierIndex} does not exist`);
    }

    const tier = ticketTiers[reservation.tierIndex];
    if (!tier)
      throw new Error(`Tier at index ${reservation.tierIndex} does not exist`);
    if (reservation.quantity > tier.remaining) {
      throw new Error(
        `Requested quantity (${reservation.quantity}) exceeds tier remaining tickets (${tier.remaining}) for tier ${reservation.tierIndex}`
      );
    }

    tierValidations.push({
      tierIndex: reservation.tierIndex,
      remaining: tier.remaining,
    });
  }

  return tierValidations;
}

/**
 * Calculate tier availability from remaining tickets and existing reservations
 */
export function calculateTierAvailability(
  tierValidations: TierValidation[],
  remainingTicketsByTier: number[],
  allReservations: Array<{ tierIndex: number; quantity: number }>
): Map<number, TierAvailability> {
  const tierAvailability = new Map<number, TierAvailability>();

  for (let i = 0; i < tierValidations.length; i++) {
    const validation = tierValidations[i];
    const remainingTickets = remainingTicketsByTier[i];
    if (validation === undefined || remainingTickets === undefined) continue;

    const reservedTickets = allReservations
      .filter((reservation) => reservation.tierIndex === validation.tierIndex)
      .reduce((sum, reservation) => sum + reservation.quantity, 0);

    tierAvailability.set(validation.tierIndex, {
      remaining: remainingTickets,
      reserved: reservedTickets,
    });
  }

  return tierAvailability;
}

/**
 * Group requested reservations by tier and sum quantities
 */
export function groupReservationsByTier(
  reservations: Reservation[]
): Map<number, number> {
  const requestedByTier = new Map<number, number>();

  for (const reservation of reservations) {
    const current = requestedByTier.get(reservation.tierIndex) || 0;
    requestedByTier.set(reservation.tierIndex, current + reservation.quantity);
  }

  return requestedByTier;
}

/**
 * Validate availability for all requested reservations
 */
export function validateAvailability(
  requestedByTier: Map<number, number>,
  tierAvailability: Map<number, TierAvailability>
): void {
  for (const [tierIndex, requestedQuantity] of requestedByTier.entries()) {
    const availability = tierAvailability.get(tierIndex);
    if (!availability) {
      throw new Error(`Tier ${tierIndex} availability data not found`);
    }

    const available = availability.remaining - availability.reserved;

    if (requestedQuantity > available) {
      throw new Error(
        `Only ${available} tickets available for tier ${tierIndex}. Requested: ${requestedQuantity}`
      );
    }
  }
}
