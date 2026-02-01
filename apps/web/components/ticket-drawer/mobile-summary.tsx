import { Separator } from "@atrangi/ui";

interface MobileSummaryProps {
  total: number;
}

export function MobileSummary({ total }: Readonly<MobileSummaryProps>) {
  return (
    <div className="lg:hidden space-y-6">
      <Separator />

      <div className="space-y-3">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

