import { renderToBuffer } from "@react-pdf/renderer";
import type { TicketPdfPayload, GeneratePdfResult } from "../types/pdf";
import { TicketDocument } from "../pdfs/ticketDocument";

class PdfService {
  async generateTicketsPdf(
    payload: TicketPdfPayload
  ): Promise<GeneratePdfResult> {
    const document = <TicketDocument payload={payload} />;
    const buffer = await renderToBuffer(document);

    const safeEventTitle = payload.eventTitle
      .replaceAll(/[^a-z0-9]+/gi, "-")
      .replaceAll(/(^-+)|(-+$)/g, "")
      .toLowerCase();

    const filename = `${safeEventTitle || "tickets"}-order-${
      payload.orderNumber
    }.pdf`;

    return {
      filename,
      contentType: "application/pdf",
      buffer,
    };
  }
}

export const pdfService = new PdfService();
