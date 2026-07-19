import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import PwaBootstrap from "../components/PwaBootstrap";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Zekat",
  title: {
    default: "Zekat — Kalkulator i zekatit",
    template: "%s | Zekat",
  },
  description:
    "Kalkulator i plotë online i zekatit, i përshtatur për web dhe telefon.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Zekat",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#075b4b",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="sq">
      <body className="min-h-screen bg-[#f6faf7] text-slate-900">
        <PwaBootstrap />
        {children}
      </body>
    </html>
  );
}
