import { qstash } from "@atrangi/infra/qstash";
import { QStashCache } from "@atrangi/core/cache/qstash";

const RESERVATION_TTL = 20 * 60;

class QStashService {
  private readonly qstashCache: QStashCache;

  constructor() {
    this.qstashCache = new QStashCache();
  }

  /**
   * Schedule a PaymentIntent cleanup message
   * Message will be delivered after the reservation expires
   */
  async schedulePaymentCleanup(paymentIntentId: string): Promise<string> {
    const cleanupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/cleanup-payment-intent`;

    // Schedule message to arrive after 20 minutes
    const result = await qstash.publishJSON({
      url: cleanupUrl,
      body: { paymentIntentId },
      delay: RESERVATION_TTL,
      retries: 3,
    });

    // Store message ID in cache so we can cancel it on successful payment
    await this.qstashCache.setMessageId(paymentIntentId, result.messageId);

    console.log(
      `[QStash] Scheduled cleanup for PaymentIntent ${paymentIntentId}, messageId: ${result.messageId}`,
    );

    return result.messageId;
  }

  /**
   * Cancel a scheduled cleanup message (called on successful payment)
   */
  async cancelPaymentCleanup(paymentIntentId: string): Promise<boolean> {
    try {
      // Use pipeline for atomic get & delete to reduce Redis roundtrips
      const messageId = await this.qstashCache.getAndDeleteMessageId(paymentIntentId);

      if (!messageId) {
        console.log(
          `[QStash] No scheduled cleanup found for PaymentIntent ${paymentIntentId}`,
        );
        return false;
      }

      await qstash.messages.delete(messageId);

      console.log(
        `[QStash] Cancelled cleanup for PaymentIntent ${paymentIntentId}, messageId: ${messageId}`,
      );
      return true;
    } catch (error) {
      // Message might have already been delivered or expired
      console.error(
        `[QStash] Error cancelling cleanup for ${paymentIntentId}:`,
        error,
      );
      return false;
    }
  }
}

export const qstashService = new QStashService();
