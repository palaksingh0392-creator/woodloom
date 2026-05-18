import "./globals.css";

import type { Metadata } from "next";

import { Playfair_Display, Manrope } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "WOODLOOM",
  description: "Luxury Scandinavian Furniture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${playfair.variable}
        ${manrope.variable}
      `}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
