import { Card, CardContent, CardHeader, Skeleton } from "@atrangi/ui";

export function CheckoutLoadingSkeleton() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-highlight/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator Skeleton */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-20 hidden sm:block" />
                {i < 3 && <Skeleton className="h-0.5 w-12" />}
              </div>
            ))}
          </div>
        </div>

        {/* Header Skeleton */}
        <div className="text-center mb-6">
          <Skeleton className="h-12 w-80 mx-auto mb-3" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Timer Skeleton */}
        <div className="flex justify-center mb-6">
          <Skeleton className="h-10 w-48 rounded-full" />
        </div>

        {/* Two Column Layout Skeleton */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Attendee Details Card */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="px-6 pb-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-5 rounded-full" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Contact Information Card */}
          <Card className="h-[600px]">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
      </div>
    </section>
  );
}
