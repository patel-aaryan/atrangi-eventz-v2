import { mg } from "@atrangi/infra/mailgun";
import { render } from "@react-email/render";
import { TicketConfirmationEmail, ContactFormEmail } from "@atrangi/core/emails";
import { pdfService } from "@atrangi/core/services/pdf";
import type { EmailOptions } from "@atrangi/core/types";

class EmailService {
  private readonly domain: string;
  private readonly defaultFrom: string;

  constructor() {
    this.domain = process.env.MAILGUN_DOMAIN || "";
    this.defaultFrom =
      process.env.MAILGUN_FROM_EMAIL || `noreply@${this.domain}`;

    if (!this.domain) console.warn("MAILGUN_DOMAIN is not set in env");
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const messageData = {
        from: options.from || this.defaultFrom,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        ...(options.text && { text: options.text }),
        ...(options.html && { html: options.html }),
        ...(options.attachments &&
          options.attachments.length > 0 && {
          attachment: options.attachments.map((attachment) => ({
            filename: attachment.filename,
            data: attachment.data,
            contentType: attachment.contentType,
          })),
        }),
      };

      const response = await mg.messages.create(
        this.domain,
        messageData as Parameters<typeof mg.messages.create>[1]
      );
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  async sendTicketConfirmationEmail(data: {
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
  }): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const pdf = await pdfService.generateTicketsPdf({
      orderNumber: data.orderNumber,
      eventTitle: data.eventTitle,
      eventDate: data.eventDate,
      eventLocation: data.eventLocation,
      buyerName: data.buyerName,
      tickets: data.tickets,
    });

    const html = await render(
      <TicketConfirmationEmail
        orderNumber={data.orderNumber}
        eventTitle={data.eventTitle}
        eventDate={data.eventDate}
        eventLocation={data.eventLocation}
        tickets={data.tickets}
        orderTotal={data.orderTotal}
        buyerName={data.buyerName}
        appUrl={appUrl}
      />
    );

    const ticketsList = data.tickets
      .map(
        (t, i) =>
          `${i + 1}. ${t.tierName} - ${t.attendeeName} (${t.ticketCode})`
      )
      .join("\n");

    const text = `Your tickets for ${data.eventTitle} have been confirmed!\n\nOrder Number: ${data.orderNumber}\n\nTickets:\n${ticketsList}\n\nTotal: $${data.orderTotal.toFixed(2)} CAD\n\nView your tickets: ${appUrl}/confirmation?orderId=${data.orderNumber}`;

    await this.sendEmail({
      to: data.to,
      subject: `🎟️ Your Tickets for ${data.eventTitle} - Order ${data.orderNumber}`,
      html,
      text,
      attachments: [
        {
          filename: pdf.filename,
          data: pdf.buffer,
          contentType: pdf.contentType,
        },
      ],
    });
  }

  async sendContactFormEmail(data: {
    name: string;
    email: string;
    message: string;
  }): Promise<void> {
    const recipientEmail =
      process.env.NEXT_PUBLIC_EMAIL;

    if (!recipientEmail) {
      console.error("NEXT_PUBLIC_EMAIL is not set in env");
      return;
    }

    const html = await render(
      <ContactFormEmail
        name={data.name}
        email={data.email}
        message={data.message}
      />
    );

    const text = `New Contact Form Submission\n\nFrom: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}\n\n---\nSent from Atrangi Eventz Website Contact Form`;

    await this.sendEmail({
      to: recipientEmail,
      subject: `📬 Contact Form: Message from ${data.name}`,
      html,
      text,
      from: this.defaultFrom,
    });
  }
}

export const emailService = new EmailService();
