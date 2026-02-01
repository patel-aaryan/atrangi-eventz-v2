import { OrderRepository } from "@atrangi/core/repository/order";
import { TicketRepository } from "@atrangi/core/repository/ticket";
import { EventRepository } from "@atrangi/core/repository/event";
import { emailService } from "./email.service";
import type { CreateOrderData, CreateTicketData } from "@atrangi/core/types";
import type {
  CompletePurchaseData,
  CompletePurchaseResult,
} from "@atrangi/types";
import QRCode from "qrcode";

/**
 * Ticket Service - Contains business logic for ticket purchases
 */
class TicketService {
  private readonly orderRepository: OrderRepository;
  private readonly ticketRepository: TicketRepository;
  private readonly eventRepository: EventRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.ticketRepository = new TicketRepository();
    this.eventRepository = new EventRepository();
  }

  /**
   * Complete a ticket purchase
   * Creates order, tickets, generates QR codes, and sends confirmation email
   */
  async completePurchase(
    data: CompletePurchaseData
  ): Promise<CompletePurchaseResult> {
    // 1. Validate event exists
    const event = await this.eventRepository.findById(data.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // 2. Create order
    const orderData: CreateOrderData = {
      subtotal: data.paymentInfo.subtotal,
      discount: data.paymentInfo.discount,
      processingFee: data.paymentInfo.processingFee,
      total: data.paymentInfo.total,
      currency: "CAD",
      buyerFirstName: data.contactInfo.firstName,
      buyerLastName: data.contactInfo.lastName,
      buyerEmail: data.contactInfo.email,
      buyerPhone: data.contactInfo.phone,
      billingZip: data.billingInfo?.zip,
      billingAddress: data.billingInfo?.address,
      promoCode: data.promoCode,
      discountAmount: data.paymentInfo.discount,
      stripePaymentIntentId: data.paymentInfo.stripePaymentIntentId,
      stripeChargeId: data.paymentInfo.stripeChargeId,
      stripePaymentMethodId: data.paymentInfo.stripePaymentMethodId,
      stripeCustomerId: data.paymentInfo.stripeCustomerId,
      paymentStatus: data.paymentInfo.paymentStatus || "succeeded",
    };

    const order = await this.orderRepository.create(orderData);

    // 3. Create tickets
    const ticketDataList: CreateTicketData[] = [];

    for (const selection of data.ticketSelections) {
      // Find attendees for this ticket type
      // Use an exact prefix with a delimiter to avoid matching tiers with shared prefixes
      // e.g. ensure "ticket-1" does not match "ticket-10-0"
      const attendeesForTicket = data.attendeeInfo.filter((attendee) =>
        attendee.ticketId.startsWith(`${selection.ticketId}-`)
      );

      for (let i = 0; i < selection.quantity; i++) {
        const attendee = attendeesForTicket[i] || {
          firstName: data.contactInfo.firstName,
          lastName: data.contactInfo.lastName,
        };

        ticketDataList.push({
          eventId: data.eventId,
          orderId: order.id,
          orderNumber: order.order_number,
          orderSubtotal: data.paymentInfo.subtotal,
          orderDiscount: data.paymentInfo.discount,
          orderProcessingFee: data.paymentInfo.processingFee,
          orderTotal: data.paymentInfo.total,
          tierName: selection.ticketName,
          tierIndex: selection.tierIndex,
          priceAtPurchase: selection.pricePerTicket,
          attendeeFirstName: attendee.firstName,
          attendeeLastName: attendee.lastName,
          buyerFirstName: data.contactInfo.firstName,
          buyerLastName: data.contactInfo.lastName,
          buyerPhone: data.contactInfo.phone,
          billingZip: data.billingInfo?.zip,
          billingAddress: data.billingInfo?.address,
          amountPaid: selection.pricePerTicket,
          currency: "CAD",
          stripePaymentIntentId: data.paymentInfo.stripePaymentIntentId,
          stripeChargeId: data.paymentInfo.stripeChargeId,
          stripePaymentMethodId: data.paymentInfo.stripePaymentMethodId,
          stripeCustomerId: data.paymentInfo.stripeCustomerId,
          paymentStatus: data.paymentInfo.paymentStatus || "succeeded",
        });
      }
    }

    // Create all tickets
    const createdTickets =
      await this.ticketRepository.createBatch(ticketDataList);

    // 4. Generate and update QR codes with actual ticket codes
    const ticketsWithQRCodes = await Promise.all(
      createdTickets.map(async (ticket) => {
        // Generate QR code with ticket code
        const qrCodeData = await QRCode.toDataURL(ticket.ticket_code);

        // Update ticket with QR code and confirm status
        const updatedTicket = await this.ticketRepository.updateQrCodeAndStatus(
          ticket.id,
          qrCodeData,
          "confirmed"
        );

        return updatedTicket;
      })
    );

    // 5. Update order status to confirmed
    await this.orderRepository.updateStatus(order.id, "confirmed");

    // 6. Ticket counts are automatically updated by the database trigger
    // (update_event_ticket_counts_trigger) when tickets are inserted.

    // 7. Prepare event location for email
    const eventLocation =
      event.venue_name && event.venue_city
        ? `${event.venue_name}, ${event.venue_city}`
        : event.venue_name || event.venue_city || "TBA";

    // 8. Send confirmation email
    await emailService.sendTicketConfirmationEmail({
      to: data.contactInfo.email,
      orderNumber: order.order_number,
      eventTitle: event.title,
      eventDate: event.start_date,
      eventLocation,
      tickets: ticketsWithQRCodes.map((ticket) => ({
        ticketCode: ticket.ticket_code,
        attendeeName: `${ticket.attendee_first_name} ${ticket.attendee_last_name}`,
        tierName: ticket.tier_name,
        price: ticket.price_at_purchase,
        qrCodeData: ticket.qr_code_data!,
      })),
      orderTotal: data.paymentInfo.total,
      buyerName: `${data.contactInfo.firstName} ${data.contactInfo.lastName}`,
    });

    return {
      orderId: order.id,
      orderNumber: order.order_number,
      tickets: ticketsWithQRCodes.map((ticket) => ({
        id: ticket.id,
        ticketCode: ticket.ticket_code,
        attendeeName: `${ticket.attendee_first_name} ${ticket.attendee_last_name}`,
      })),
    };
  }
}

export const ticketService = new TicketService();
