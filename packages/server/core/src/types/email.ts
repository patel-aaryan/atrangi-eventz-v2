export interface EmailAttachment {
  filename: string;
  data: Buffer | string;
  contentType?: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  attachments?: EmailAttachment[];
}

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export interface TicketConfirmationData {
  to: string;
  orderNumber: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  tickets: Array<{
    ticketCode: string;
    attendeeName: string;
    tierName: string;
    price: number;
    qrCodeData: string;
  }>;
  orderTotal: number;
  buyerName: string;
}
