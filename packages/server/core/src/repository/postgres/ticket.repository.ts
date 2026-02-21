import { pool } from "@atrangi/db";
import type { CreateTicketData, Ticket } from "@atrangi/core/types";

/**
 * Ticket Repository - Handles all database operations for tickets
 */
export class TicketRepository {
  /**
   * Count sold tickets for a specific event and tier
   * Returns the total number of sold tickets for the given tier_index
   */
  async countSoldTicketsByTier(
    eventId: string,
    tierIndex: number,
  ): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM tickets
      WHERE event_id = $1
        AND tier_index = $2
        AND status IN ('confirmed', 'pending')
    `;

    const result = await pool.query(query, [eventId, tierIndex]);

    return Number.parseInt(result.rows[0]?.count || "0", 10);
  }

  /**
   * Create a single ticket
   * Returns the created ticket with auto-generated ticket_code
   */
  async create(data: CreateTicketData): Promise<Ticket> {
    const query = `
      INSERT INTO tickets (
        event_id,
        order_id,
        order_number,
        order_subtotal,
        order_discount,
        order_processing_fee,
        order_total,
        tier_name,
        tier_index,
        price_at_purchase,
        attendee_first_name,
        attendee_last_name,
        buyer_first_name,
        buyer_last_name,
        buyer_phone,
        billing_zip,
        billing_address,
        amount_paid,
        currency,
        stripe_payment_intent_id,
        stripe_charge_id,
        stripe_payment_method_id,
        payment_status,
        qr_code_data,
        status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      )
      RETURNING *
    `;

    const values = [
      data.eventId,
      data.orderId,
      data.orderNumber,
      data.orderSubtotal,
      data.orderDiscount,
      data.orderProcessingFee,
      data.orderTotal,
      data.tierName,
      data.tierIndex,
      data.priceAtPurchase,
      data.attendeeFirstName,
      data.attendeeLastName,
      data.buyerFirstName,
      data.buyerLastName,
      data.buyerPhone || null,
      data.billingZip || null,
      data.billingAddress || null,
      data.amountPaid,
      data.currency || "CAD",
      data.stripePaymentIntentId || null,
      data.stripeChargeId || null,
      data.stripePaymentMethodId || null,
      data.paymentStatus || "pending",
      data.qrCodeData || null,
      "pending",
    ];

    const result = await pool.query(query, values);
    return this.mapRowToTicket(result.rows[0]);
  }

  /**
   * Create multiple tickets in a transaction
   * Returns array of created tickets
   */
  async createBatch(tickets: CreateTicketData[]): Promise<Ticket[]> {
    if (tickets.length === 0) {
      return [];
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const createdTickets: Ticket[] = [];

      for (const ticketData of tickets) {
        const query = `
          INSERT INTO tickets (
            event_id, order_id, order_number, order_subtotal, order_discount,
            order_processing_fee, order_total, tier_name, tier_index, price_at_purchase,
            attendee_first_name, attendee_last_name,
            buyer_first_name, buyer_last_name, buyer_phone,
            billing_zip, billing_address, amount_paid, currency,
            stripe_payment_intent_id, stripe_charge_id, stripe_payment_method_id,
            payment_status, qr_code_data, status
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
          )
          RETURNING *
        `;

        const values = [
          ticketData.eventId,
          ticketData.orderId,
          ticketData.orderNumber,
          ticketData.orderSubtotal,
          ticketData.orderDiscount,
          ticketData.orderProcessingFee,
          ticketData.orderTotal,
          ticketData.tierName,
          ticketData.tierIndex,
          ticketData.priceAtPurchase,
          ticketData.attendeeFirstName,
          ticketData.attendeeLastName,
          ticketData.buyerFirstName,
          ticketData.buyerLastName,
          ticketData.buyerPhone || null,
          ticketData.billingZip || null,
          ticketData.billingAddress || null,
          ticketData.amountPaid,
          ticketData.currency || "CAD",
          ticketData.stripePaymentIntentId || null,
          ticketData.stripeChargeId || null,
          ticketData.stripePaymentMethodId || null,
          ticketData.paymentStatus || "pending",
          ticketData.qrCodeData || null,
          "pending",
        ];

        const result = await client.query(query, values);
        createdTickets.push(this.mapRowToTicket(result.rows[0]));
      }

      await client.query("COMMIT");
      return createdTickets;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Find tickets by order ID
   */
  async findByOrderId(orderId: string): Promise<Ticket[]> {
    const query = `SELECT * FROM tickets WHERE order_id = $1 ORDER BY created_at ASC`;
    const result = await pool.query(query, [orderId]);

    return result.rows.map((row) => this.mapRowToTicket(row));
  }

  /**
   * Update ticket QR code data and status
   */
  async updateQrCodeAndStatus(
    ticketId: string,
    qrCodeData: string,
    status: "pending" | "confirmed" | "checked_in" = "confirmed",
  ): Promise<Ticket> {
    const query = `
      UPDATE tickets 
      SET qr_code_data = $1, status = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [qrCodeData, status, ticketId]);

    return this.mapRowToTicket(result.rows[0]);
  }

  private mapRowToTicket(row: any): Ticket {
    return {
      id: row.id,
      event_id: row.event_id,
      order_id: row.order_id,
      order_number: row.order_number,
      order_subtotal: Number.parseFloat(row.order_subtotal),
      order_discount: Number.parseFloat(row.order_discount),
      order_processing_fee: Number.parseFloat(row.order_processing_fee),
      order_total: Number.parseFloat(row.order_total),
      tier_name: row.tier_name,
      tier_index: row.tier_index,
      price_at_purchase: Number.parseFloat(row.price_at_purchase),
      attendee_first_name: row.attendee_first_name,
      attendee_last_name: row.attendee_last_name,
      buyer_first_name: row.buyer_first_name,
      buyer_last_name: row.buyer_last_name,
      buyer_phone: row.buyer_phone,
      billing_zip: row.billing_zip,
      billing_address: row.billing_address,
      ticket_code: row.ticket_code,
      qr_code_data: row.qr_code_data,
      amount_paid: Number.parseFloat(row.amount_paid),
      currency: row.currency,
      stripe_payment_intent_id: row.stripe_payment_intent_id,
      stripe_charge_id: row.stripe_charge_id,
      stripe_payment_method_id: row.stripe_payment_method_id,
      payment_status: row.payment_status,
      status: row.status,
      is_checked_in: row.is_checked_in,
      checked_in_at: row.checked_in_at,
      purchased_at: row.purchased_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
