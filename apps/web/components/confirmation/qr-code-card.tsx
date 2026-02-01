/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@atrangi/ui";
import { Mail, Ticket } from "lucide-react";
import QRCode from "qrcode";

interface QRCodeCardProps {
  contactEmail: string;
  qrCodeValue?: string;
}

export function QRCodeCard({
  contactEmail,
  qrCodeValue,
}: Readonly<QRCodeCardProps>) {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  useEffect(() => {
    if (!qrCodeValue) return;

    QRCode.toDataURL(qrCodeValue)
      .then((dataUrl) => {
        setQrCodeData(dataUrl);
      })
      .catch((error) => {
        console.error("Failed to generate QR code:", error);
        setQrCodeData(null);
      });
  }, [qrCodeValue]);

  return (
    <Card className="flex-1">
      <CardContent className="pt-6 space-y-6 h-full flex flex-col justify-center">
        {/* QR Code */}
        <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-muted/50">
          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mb-3 border-2 border-dashed border-muted-foreground/30 overflow-hidden">
            {qrCodeData && qrCodeValue ? (
              <img
                src={qrCodeData}
                alt={`QR Code for ${qrCodeValue}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <Ticket className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">QR Code</p>
                <p className="text-xs">Scan at venue</p>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Show this QR code at the entrance
          </p>
        </div>

        {/* Email Confirmation */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Confirmation Email Sent</h4>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a detailed confirmation with your tickets to{" "}
                <strong>{contactEmail}</strong>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
