import React from "react";

interface Ticket {
  ticketCode: string;
  attendeeName: string;
  tierName: string;
  price: number;
  qrCodeData: string;
}

interface Props {
  orderNumber: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  tickets: Ticket[];
  orderTotal: number;
  buyerName: string;
  appUrl?: string;
}

export function TicketConfirmationEmail({
  orderNumber,
  eventTitle,
  eventDate,
  eventLocation,
  tickets,
  orderTotal,
  buyerName,
  appUrl = "http://localhost:3000",
}: Readonly<Props>) {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      style={{ fontFamily: "Arial, sans-serif", padding: 20, maxWidth: 600 }}
    >
      <h1 style={{ color: "#ff5722", marginBottom: 20 }}>
        🎉 Your Tickets Are Confirmed!
      </h1>

      <p>Hi {buyerName},</p>

      <p>
        Thank you for your purchase! Your order <strong>{orderNumber}</strong>{" "}
        has been confirmed.
      </p>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: 20,
          borderRadius: 8,
          margin: "20px 0",
        }}
      >
        <h2 style={{ marginTop: 0 }}>{eventTitle}</h2>
        <p>
          <strong>Date:</strong> {formattedDate}
        </p>
        <p>
          <strong>Location:</strong> {eventLocation}
        </p>
      </div>

      <h2 style={{ marginTop: 30 }}>Your Tickets ({tickets.length})</h2>

      {tickets.map((ticket, index) => (
        <div
          key={ticket.ticketCode}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            Ticket {index + 1}: {ticket.tierName}
          </h3>
          <p>
            <strong>Attendee:</strong> {ticket.attendeeName}
          </p>
          <p>
            <strong>Ticket Code:</strong> {ticket.ticketCode}
          </p>
          <p>
            <strong>Price:</strong> ${ticket.price.toFixed(2)} CAD
          </p>
          <div style={{ marginTop: 15, textAlign: "center" }}>
            <img
              src={ticket.qrCodeData}
              alt={`QR Code for ${ticket.ticketCode}`}
              style={{ maxWidth: 200, height: "auto" }}
            />
            <p style={{ fontSize: 12, color: "#666", marginTop: 10 }}>
              Show this QR code at the venue entrance
            </p>
          </div>
        </div>
      ))}

      <div
        style={{
          backgroundColor: "#fff3e0",
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <p style={{ margin: 0, fontSize: 18 }}>
          <strong>Total Paid: ${orderTotal.toFixed(2)} CAD</strong>
        </p>
      </div>

      <div
        style={{ marginTop: 30, paddingTop: 20, borderTop: "1px solid #ddd" }}
      >
        <p style={{ fontSize: 14, color: "#666" }}>
          <strong>Important:</strong>
        </p>
        <ul style={{ fontSize: 14, color: "#666" }}>
          <li>Please arrive at least 15 minutes before the event starts</li>
          <li>Bring a valid ID that matches the attendee name</li>
          <li>Show the QR code on your phone or print this email</li>
          <li>If you have any questions, reply to this email</li>
        </ul>
      </div>

      <div style={{ marginTop: 30, textAlign: "center" }}>
        <a
          href={`${appUrl}/confirmation?orderId=${orderNumber}`}
          style={{
            backgroundColor: "#ff5722",
            color: "white",
            padding: "12px 24px",
            textDecoration: "none",
            borderRadius: 6,
            display: "inline-block",
          }}
        >
          View Order Details
        </a>
      </div>

      <p style={{ color: "#888", fontSize: 12, marginTop: 30 }}>
        Questions? Reply to this email or contact us at
        support@atrangieventz.com
      </p>
    </div>
  );
}
