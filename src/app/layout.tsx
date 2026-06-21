import type { Metadata } from "next";
import type { ReactNode } from "react";
import ZakatGuidanceBanner from "../components/ZakatGuidanceBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zekat Calculator",
  description: "Kalkulator online i zekatit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="sq">
      <body className="min-h-screen bg-[#f6faf7] text-slate-900">
        <ZakatGuidanceBanner />
        {children}
      </body>
    </html>
  );
}