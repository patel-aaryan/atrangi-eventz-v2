import { ReactNode } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { ReduxProvider } from "@/providers/redux-provider";
import { TicketProvider } from "@/contexts/ticket-context";

interface AppProvidersProps {
  readonly children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <TicketProvider>{children}</TicketProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
