import React from "react";

interface Props {
  name: string;
  email: string;
  message: string;
}

export function ContactFormEmail({
  name,
  email,
  message,
}: Readonly<Props>) {
  return (
    <div
      style={{ fontFamily: "Arial, sans-serif", padding: 20, maxWidth: 600 }}
    >
      <div
        style={{
          background: "linear-gradient(to right, #7c3aed, #ec4899)",
          padding: 20,
          borderRadius: "8px 8px 0 0",
        }}
      >
        <h1 style={{ margin: 0, color: "white", fontSize: 24 }}>
          📬 New Contact Form Submission
        </h1>
      </div>

      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: 30,
          border: "1px solid #e5e7eb",
          borderTop: "none",
        }}
      >
        <p style={{ fontSize: 16, marginBottom: 30 }}>
          You have received a new message from the Atrangi Eventz website
          contact form.
        </p>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontWeight: "bold",
              color: "#6b7280",
              marginBottom: 5,
              fontSize: 14,
            }}
          >
            From:
          </div>
          <div
            style={{
              background: "white",
              padding: 12,
              borderRadius: 6,
              border: "1px solid #e5e7eb",
            }}
          >
            {name}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontWeight: "bold",
              color: "#6b7280",
              marginBottom: 5,
              fontSize: 14,
            }}
          >
            Email:
          </div>
          <div
            style={{
              background: "white",
              padding: 12,
              borderRadius: 6,
              border: "1px solid #e5e7eb",
            }}
          >
            <a
              href={`mailto:${email}`}
              style={{ color: "#7c3aed", textDecoration: "none" }}
            >
              {email}
            </a>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontWeight: "bold",
              color: "#6b7280",
              marginBottom: 5,
              fontSize: 14,
            }}
          >
            Message:
          </div>
          <div
            style={{
              background: "white",
              padding: 12,
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              minHeight: 100,
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#f3f4f6",
          padding: 15,
          borderRadius: "0 0 8px 8px",
          textAlign: "center",
          fontSize: 14,
          color: "#6b7280",
        }}
      >
        <p style={{ margin: 0 }}>
          Sent from Atrangi Eventz Website Contact Form
        </p>
        <p style={{ margin: "8px 0 0 0", fontSize: 12 }}>
          Reply directly to this email to respond to {name}
        </p>
      </div>
    </div>
  );
}
