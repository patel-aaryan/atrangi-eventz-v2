import { redis } from "@atrangi/infra/redis";

/**
 * QStash Cache - Handles all Redis operations for QStash message tracking
 */
export class QStashCache {
  private readonly MESSAGE_KEY_PREFIX = "qstash:payment:";
  private readonly MESSAGE_TTL = 20 * 60 + 60; // Reservation TTL + 60 seconds buffer

  /**
   * Store a QStash message ID for a PaymentIntent
   * Allows cancellation of the scheduled cleanup on successful payment
   */
  async setMessageId(
    paymentIntentId: string,
    messageId: string,
  ): Promise<void> {
    try {
      const messageKey = `${this.MESSAGE_KEY_PREFIX}${paymentIntentId}`;
      await redis.set(messageKey, messageId, {
        ex: this.MESSAGE_TTL,
      });
    } catch (error) {
      console.error("[QStash Cache] Error storing message ID:", error);
      throw new Error("Failed to store QStash message ID");
    }
  }

  /**
   * Get the QStash message ID for a PaymentIntent
   * Returns null if not found
   */
  async getMessageId(paymentIntentId: string): Promise<string | null> {
    try {
      const messageKey = `${this.MESSAGE_KEY_PREFIX}${paymentIntentId}`;
      return await redis.get<string>(messageKey);
    } catch (error) {
      console.error("[QStash Cache] Error getting message ID:", error);
      return null;
    }
  }

  /**
   * Delete the QStash message ID for a PaymentIntent
   * Called after successfully cancelling the scheduled cleanup
   */
  async deleteMessageId(paymentIntentId: string): Promise<void> {
    try {
      const messageKey = `${this.MESSAGE_KEY_PREFIX}${paymentIntentId}`;
      await redis.del(messageKey);
    } catch (error) {
      console.error("[QStash Cache] Error deleting message ID:", error);
      // Don't throw - cache cleanup failures shouldn't break the app
    }
  }

  /**
   * Atomically get and delete the QStash message ID using a pipeline
   * Reduces Redis roundtrips during webhook processing
   */
  async getAndDeleteMessageId(paymentIntentId: string): Promise<string | null> {
    try {
      const messageKey = `${this.MESSAGE_KEY_PREFIX}${paymentIntentId}`;
      
      const pipeline = redis.pipeline();
      pipeline.get<string>(messageKey);
      pipeline.del(messageKey);
      
      const results = await pipeline.exec();
      // results[0] is the result of GET, results[1] is result of DEL
      return (results[0] as string) || null;
    } catch (error) {
      console.error("[QStash Cache] Error atomic get/delete message ID:", error);
      return null;
    }
  }
}
