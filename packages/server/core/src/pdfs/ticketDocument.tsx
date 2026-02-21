import React from "react";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import type { TicketPdfPayload } from "../types/pdf";
import { ticketDocumentStyles as styles } from "../styles/ticketDocument";
import { formatEventDate } from "@atrangi/core/utils/date";

interface TicketDocumentProps {
  payload: TicketPdfPayload;
}

export function TicketDocument({ payload }: Readonly<TicketDocumentProps>) {
  const formattedDate = formatEventDate(payload.eventDate);

  return (
    <Document>
      {payload.tickets.map((ticket) => (
        <React.Fragment key={ticket.ticketCode}>
          <Page size="LETTER" style={styles.page}>
            <View style={styles.ticketCard}>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.eventTitle}>{payload.eventTitle}</Text>
                  <Text style={styles.orderBadge}>
                    Order {payload.orderNumber.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaBlock}>
                  <Text style={styles.metaLabel}>Date & Time</Text>
                  <Text style={styles.metaValue}>{formattedDate}</Text>
                </View>
                <View style={styles.metaBlock}>
                  <Text style={styles.metaLabel}>Location</Text>
                  <Text style={styles.metaValue}>{payload.eventLocation}</Text>
                </View>
                <View style={styles.metaBlock}>
                  <Text style={styles.metaLabel}>Booked By</Text>
                  <Text style={styles.metaValue}>{payload.buyerName}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.bodyRow}>
                <View style={styles.leftColumn}>
                  <View>
                    <Text style={styles.ticketTier}>{ticket.tierName}</Text>
                    <Text style={styles.attendeeName}>
                      {ticket.attendeeName}
                    </Text>
                    <Text style={styles.ticketCode}>
                      Ticket #{ticket.ticketCode}
                    </Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Admit One</Text>
                    <Text style={styles.priceValue}>
                      ${ticket.price.toFixed(2)} CAD
                    </Text>
                  </View>
                </View>

                <View style={styles.rightColumn}>
                  <View style={styles.qrWrapper}>
                    <Image
                      style={styles.qrImage}
                      src={ticket.qrCodeData}
                      cache={false}
                    />
                    <Text style={styles.qrCaption}>
                      Present this QR code at the entrance
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.footerNote}>
                Please arrive 15 minutes early. Bring a valid photo ID that
                matches the attendee name. Tickets are non-transferable unless
                otherwise stated.
              </Text>
            </View>
          </Page>
        </React.Fragment>
      ))}
    </Document>
  );
}
