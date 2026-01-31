import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transitia — Milano",
  description:
    "Condividere casa a Milano durante una transizione familiare. Riservato, semplice, senza annunci.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
