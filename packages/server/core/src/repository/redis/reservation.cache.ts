import { redis } from "@atrangi/infra/redis";
import type { ReservationData } from "@atrangi/core/types";

/**
 * Reservation Cache - Handles all Redis operations for ticket reservations
 */
export class ReservationCache {
  private readonly LOCK_KEY_PREFIX = "lock:event:";
  private readonly RESERVATION_KEY_PREFIX = "reservation:event:";
  private readonly LOCK_TTL = 30; // 30 seconds lock timeout
  private readonly RESERVATION_TTL = 1200; // 20 minutes in seconds

  /**
   * Acquire a lock for an event to prevent race conditions
   * Returns true if lock was acquired, false if already locked
   * @private - Use acquireLockWithRetry for public API
   */
  private async acquireLock(eventId: string): Promise<boolean> {
    try {
      const lockKey = `${this.LOCK_KEY_PREFIX}${eventId}`;
      // Use SET with NX (only if not exists) and EX (expiration)
      const result = await redis.set(lockKey, "locked", {
        nx: true,
        ex: this.LOCK_TTL,
      });
      return result === "OK";
    } catch (error) {
      console.error("Error acquiring lock:", error);
      return false;
    }
  }

  /**
   * Release a lock for an event
   */
  async releaseLock(eventId: string): Promise<void> {
    try {
      const lockKey = `${this.LOCK_KEY_PREFIX}${eventId}`;
      await redis.del(lockKey);
    } catch (error) {
      console.error("Error releasing lock:", error);
      // Don't throw - lock release failures shouldn't break the app
    }
  }

  /**
   * Acquire a lock with retry mechanism
   * Uses exponential backoff with jitter to prevent thundering herd
   *
   * @param eventId - The event ID to acquire lock for
   * @param maxRetries - Maximum number of retry attempts (default: 4)
   * @param baseDelayMs - Base delay in milliseconds for exponential backoff (default: 100ms)
   * @returns true if lock was acquired, false if all retries failed
   */
  async acquireLockWithRetry(
    eventId: string,
    maxRetries: number = 4,
    baseDelayMs: number = 100,
  ): Promise<boolean> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const acquired = await this.acquireLock(eventId);
      if (acquired) {
        return true;
      }

      // Don't sleep after the last failed attempt
      if (attempt < maxRetries) {
        // Exponential backoff: 100ms, 200ms, 400ms, 800ms...
        const delay = baseDelayMs * Math.pow(2, attempt);
        // Add jitter (0-50% of delay) to prevent thundering herd
        const jitter = Math.random() * delay * 0.5;
        await this.sleep(delay + jitter);
      }
    }

    return false;
  }

  /**
   * Sleep for specified milliseconds
   * Helper method for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get all reservation keys for an event
   * Scans for keys matching the pattern: reservation:event:<eventId>:*
   */
  async getReservationKeys(eventId: string): Promise<string[]> {
    try {
      const pattern = `${this.RESERVATION_KEY_PREFIX}${eventId}:*`;
      // Use SCAN to find all matching keys
      const keys: string[] = [];
      let cursor: number | string = 0;

      do {
        // Upstash Redis scan returns [cursor, keys[]] where cursor is a string
        const result: any = await redis.scan(cursor, {
          match: pattern,
          count: 100,
        });

        // Handle both tuple and object return types
        if (Array.isArray(result)) {
          const cursorStr: string | number = result[0];
          cursor =
            typeof cursorStr === "string"
              ? Number.parseInt(cursorStr, 10)
              : cursorStr;
          const scannedKeys: string[] = result[1] || [];
          keys.push(...scannedKeys);
        } else {
          // If result is an object with cursor and keys properties
          const cursorValue: string | number = result.cursor;
          cursor =
            typeof cursorValue === "string"
              ? Number.parseInt(cursorValue, 10)
              : cursorValue || 0;
          const scannedKeys: string[] = result.keys || [];
          keys.push(...scannedKeys);
        }
      } while (Number(cursor) !== 0);

      return keys;
    } catch (error) {
      console.error("Error scanning reservation keys:", error);
      return [];
    }
  }

  /**
   * Get all reservations for an event
   * Returns flattened array of all reserved tickets across all sessions (for availability calculation)
   */
  async getReservations(eventId: string): Promise<ReservationData> {
    try {
      const keys = await this.getReservationKeys(eventId);
      if (keys.length === 0) return [];

      // Get all reservation arrays in a single round-trip using mget
      const values = await redis.mget<ReservationData[]>(...keys);

      // Filter out null values (expired during fetch) and flatten the session arrays
      return values
        .filter((value): value is ReservationData => value !== null)
        .flat();
    } catch (error) {
      console.error("Error getting reservations:", error);
      return [];
    }
  }

  /**
   * Get reservations for an event filtered by session ID
   * Returns array of reserved tickets for the given session
   */
  async getReservationsBySession(
    eventId: string,
    sessionId: string,
  ): Promise<Array<{ quantity: number; tierIndex: number }>> {
    try {
      const reservationKey = `${this.RESERVATION_KEY_PREFIX}${eventId}:${sessionId}`;
      const sessionReservations = await redis.get<ReservationData>(reservationKey);
      return sessionReservations || [];
    } catch (error) {
      console.error("Error getting reservations by session:", error);
      return [];
    }
  }

  /**
   * Delete all reservations for a given event and session
   * Used after a successful ticket purchase to clear the cache.
   * Now O(1) instead of requiring a full EVENT scan.
   */
  async deleteReservationsBySession(
    eventId: string,
    sessionId: string,
  ): Promise<void> {
    try {
      const reservationKey = `${this.RESERVATION_KEY_PREFIX}${eventId}:${sessionId}`;
      await redis.del(reservationKey);
    } catch (error) {
      console.error("Error deleting reservations by session:", error);
      // Don't throw - cache cleanup failures shouldn't break the app
    }
  }

  async createReservation(
    eventId: string,
    sessionId: string,
    quantity: number,
    tierIndex: number,
  ): Promise<string> {
    return this.createReservations(eventId, sessionId, [{ quantity, tierIndex }]);
  }

  /**
   * Create multiple reservations atomically in a single session key
   * Overwrites the previous active cart for the session.
   * Returns the session ID.
   */
  async createReservations(
    eventId: string,
    sessionId: string,
    reservations: Array<{ quantity: number; tierIndex: number }>,
  ): Promise<string> {
    try {
      const reservationKey = `${this.RESERVATION_KEY_PREFIX}${eventId}:${sessionId}`;

      const reservationData: ReservationData = reservations.map(r => ({
        quantity: r.quantity,
        tierIndex: r.tierIndex,
      }));

      // Store grouped reservations with TTL
      await redis.set(reservationKey, reservationData, {
        ex: this.RESERVATION_TTL,
      });

      // Returning sessionId to denote the cart was assembled
      return sessionId;
    } catch (error) {
      console.error("Error creating batch reservations:", error);
      throw new Error("Failed to create batch reservations");
    }
  }
}
