"use client";

import { Card, CardContent, Button } from "@atrangi/ui";
import { Download, Share2 } from "lucide-react";

interface OrderHeaderProps {
  orderId: string;
  onDownload: () => void;
  onShare: () => void;
}

export function OrderHeader({
  orderId,
  onDownload,
  onShare,
}: Readonly<OrderHeaderProps>) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="text-2xl font-bold">{orderId}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onDownload}
              className="flex-1 bg-linear-to-r from-primary to-highlight hover:opacity-90"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={onShare} className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
