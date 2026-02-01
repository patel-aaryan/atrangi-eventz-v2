"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  readonly text?: string;
}

export function LoadingSpinner({ text = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-highlight/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-highlight/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Spinner */}
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
