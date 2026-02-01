export interface TicketForPdf {
  ticketCode: string;
  attendeeName: string;
  tierName: string;
  price: number;
  qrCodeData: string;
}

export interface TicketPdfPayload {
  orderNumber: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  buyerName: string;
  tickets: TicketForPdf[];
}

export interface GeneratePdfResult {
  filename: string;
  contentType: string;
  buffer: Buffer;
}
