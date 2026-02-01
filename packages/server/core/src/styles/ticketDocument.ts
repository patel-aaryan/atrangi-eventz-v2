import { StyleSheet } from "@react-pdf/renderer";

export const ticketDocumentStyles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: "#020617",
    fontFamily: "Helvetica",
  },
  ticketCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#f97316",
    backgroundColor: "#020617",
    padding: 20,
    flexDirection: "column",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#f9fafb",
  },
  orderBadge: {
    fontSize: 10,
    color: "#f97316",
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metaBlock: {
    flexDirection: "column",
  },
  metaLabel: {
    fontSize: 9,
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 11,
    color: "#e5e7eb",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
    marginVertical: 12,
  },
  bodyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 16,
  },
  leftColumn: {
    flex: 1.4,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  rightColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketTier: {
    fontSize: 14,
    fontWeight: 600,
    color: "#f97316",
    marginBottom: 4,
  },
  attendeeName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#f9fafb",
    marginBottom: 8,
  },
  ticketCode: {
    fontSize: 11,
    color: "#e5e7eb",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 10,
    color: "#9ca3af",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 700,
    color: "#f9fafb",
  },
  qrWrapper: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
  },
  qrImage: {
    width: 160,
    height: 160,
  },
  qrCaption: {
    fontSize: 9,
    color: "#9ca3af",
    marginTop: 6,
    textAlign: "center",
  },
  footerNote: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 12,
    textAlign: "center",
  },
});
