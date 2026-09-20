import "./globals.css";

import type { Metadata } from "next";

import CommerceSyncProvider from "@/components/providers/commerce-sync-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import HoverLabels from "@/components/ui/hover-labels";

export const metadata: Metadata = {
  title: "Shissoo",
  description: "Luxury Scandinavian Furniture",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>
        <ThemeProvider>
          <CommerceSyncProvider />
          <HoverLabels />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
