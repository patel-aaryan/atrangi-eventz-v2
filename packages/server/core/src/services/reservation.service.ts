import { ReservationCache } from "@atrangi/core/cache/reservation";
import { EventRepository } from "@atrangi/core/repository/event";
import {
  validateBatchReservationInputs,
  validateTiersAndCapacities,
  calculateTierAvailability,
  groupReservationsByTier,
  validateAvailability,
} from "@atrangi/core/utils/reservation";
import type {
  ReserveTicketsParams,
  ReserveTicketsResult,
  BatchReserveTicketsParams,
  BatchReserveTicketsResult,
} from "@atrangi/core/types";

/**
 * Reservation Service - Contains business logic for ticket reservations
 */
class ReservationService {
  private readonly reservationCache: ReservationCache;
  private readonly eventRepository: EventRepository;

  constructor() {
    this.reservationCache = new ReservationCache();
    this.eventRepository = new EventRepository();
  }

  /**
   * Reserve tickets for an event
   * This method handles locking, availability checking, and reservation creation
   */
  async reserveTickets(
    params: ReserveTicketsParams,
  ): Promise<ReserveTicketsResult> {
    const { eventId, tierIndex, requestedQuantity, sessionId } = params;

    // Validate inputs
    if (requestedQuantity <= 0) {
      throw new Error("Requested quantity must be greater than 0");
    }

    // Get event to validate tier exists and get capacity
    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new Error(`Event with ID ${eventId} does not exist`);

    // Validate tier exists
    if (!event.ticket_tiers || tierIndex >= event.ticket_tiers.length) {
      throw new Error(`Tier at index ${tierIndex} does not exist`);
    }

    const tier = event.ticket_tiers[tierIndex];
    if (!tier) throw new Error(`Tier at index ${tierIndex} does not exist`);
    const tierRemaining = tier.remaining;

    if (requestedQuantity > tierRemaining) {
      throw new Error(
        `Requested quantity (${requestedQuantity}) exceeds tier remaining tickets (${tierRemaining})`,
      );
    }

    // Acquire lock for the event with retry mechanism
    const lockAcquired =
      await this.reservationCache.acquireLockWithRetry(eventId);
    if (!lockAcquired) {
      throw new Error(
        "Unable to process your request due to high demand. Please try again in a moment.",
      );
    }

    try {
      // 1. Get current remaining tickets from event
      const currentEvent = await this.eventRepository.findById(eventId);
      if (!currentEvent)
        throw new Error(`Event with ID ${eventId} does not exist`);
      const currentTier = currentEvent.ticket_tiers[tierIndex];
      if (!currentTier)
        throw new Error(`Tier at index ${tierIndex} does not exist`);
      const remainingTickets = currentTier.remaining;

      // 2. Get reserved tickets from Redis and sum for this specific tier
      const reservations = await this.reservationCache.getReservations(eventId);
      const reservedTickets = reservations
        .filter((reservation) => reservation.tierIndex === tierIndex)
        .reduce((sum, reservation) => sum + reservation.quantity, 0);

      // 3. Calculate available tickets
      const available = remainingTickets - reservedTickets;

      // 4. Check if requested quantity is available
      if (requestedQuantity > available) {
        throw new Error(
          `Only ${available} tickets available. Requested: ${requestedQuantity}`,
        );
      }

      // 5. Create reservation
      const reservationId = await this.reservationCache.createReservation(
        eventId,
        sessionId,
        requestedQuantity,
        tierIndex,
      );

      return { reservationId };
    } finally {
      // Always release the lock, even if an error occurs
      await this.reservationCache.releaseLock(eventId);
    }
  }

  /**
   * Get reservations for an event by session ID
   * Returns array of reservations with tierIndex and quantity
   */
  async getReservationsBySession(
    eventId: string,
    sessionId: string,
  ): Promise<Array<{ tierIndex: number; quantity: number }>> {
    const reservations = await this.reservationCache.getReservationsBySession(
      eventId,
      sessionId,
    );
    return reservations.map((reservation) => ({
      tierIndex: reservation.tierIndex,
      quantity: reservation.quantity,
    }));
  }

  /**
   * Clear all reservations for an event and session
   * Used after a successful purchase so the cart is emptied in cache
   */
  async clearReservationsForSession(
    eventId: string,
    sessionId: string,
  ): Promise<void> {
    await this.reservationCache.deleteReservationsBySession(eventId, sessionId);
  }

  /**
   * Reserve multiple tickets atomically in a single transaction
   * This prevents race conditions when reserving multiple tickets at once
   * All reservations succeed or all fail
   */
  async reserveTicketsBatch(
    params: BatchReserveTicketsParams,
  ): Promise<BatchReserveTicketsResult> {
    const { eventId, reservations, sessionId } = params;

    // Validate inputs
    validateBatchReservationInputs(reservations);

    // Get event to validate tiers exist and get capacities
    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new Error(`Event with ID ${eventId} does not exist`);

    if (!event.ticket_tiers) {
      throw new Error("Event has no ticket tiers");
    }

    // Validate all tiers exist and check capacities
    const tierValidations = validateTiersAndCapacities(
      reservations,
      event.ticket_tiers,
    );

    // Acquire lock for the event with retry mechanism
    const lockAcquired =
      await this.reservationCache.acquireLockWithRetry(eventId);
    if (!lockAcquired) {
      throw new Error(
        "Unable to process your request due to high demand. Please try again in a moment.",
      );
    }

    try {
      // Get current remaining tickets for all tiers we need
      const currentEvent = await this.eventRepository.findById(eventId);
      if (!currentEvent)
        throw new Error(`Event with ID ${eventId} does not exist`);

      const remainingTicketsByTier = tierValidations.map((validation) => {
        const t = currentEvent.ticket_tiers[validation.tierIndex];
        if (!t)
          throw new Error(
            `Tier at index ${validation.tierIndex} does not exist`,
          );
        return t.remaining;
      });

      // Get all reserved tickets from Redis
      const allReservations =
        await this.reservationCache.getReservations(eventId);

      // Calculate tier availability
      const tierAvailability = calculateTierAvailability(
        tierValidations,
        remainingTicketsByTier,
        allReservations,
      );

      // Group requested reservations by tier
      const requestedByTier = groupReservationsByTier(reservations);

      // Validate availability for all requested reservations
      validateAvailability(requestedByTier, tierAvailability);

      // All validations passed, create grouped reservations in cache
      const reservationId = await this.reservationCache.createReservations(
        eventId,
        sessionId,
        reservations,
      );

      return { reservationId };
    } finally {
      // Always release the lock, even if an error occurs
      await this.reservationCache.releaseLock(eventId);
    }
  }
}

export const reservationService = new ReservationService();
