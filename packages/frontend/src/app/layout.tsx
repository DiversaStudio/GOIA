import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOIA - AI Governance SaaS",
  description: "Global AI Oversight Initiative - Compliance, Privacy, Fairness, and Observability Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
