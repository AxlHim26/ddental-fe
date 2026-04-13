"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
import { SiteAuthProvider } from "@/context/SiteAuthContext";
import { queryClientInstance } from "@/lib/query-client";
import { AuthProvider } from "@/lib/AuthContext";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <SiteAuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </SiteAuthProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
