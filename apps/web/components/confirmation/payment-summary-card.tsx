"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@atrangi/ui";

interface PaymentSummaryCardProps {
  subtotal: number;
  discount: number;
  processingFee: number;
  total: number;
  promoCode?: string;
}

export function PaymentSummaryCard({
  subtotal,
  discount,
  processingFee,
  total,
  promoCode,
}: Readonly<PaymentSummaryCardProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Discount{" "}
              {promoCode && (
                <Badge variant="secondary" className="ml-2">
                  {promoCode}
                </Badge>
              )}
            </span>
            <span className="text-green-600">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Processing Fee</span>
          <span>${processingFee.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total Paid</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
