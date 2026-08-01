import type { Metadata } from "next";
import { Suspense } from "react";
import { Fredoka, Nunito } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import Analytics from "./components/Analytics";
import "./globals.css";

const display = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tinker: kids build real games by describing them",
  description:
    "Your child says what they want to make. It gets built, and they learn how it works by changing it. Join the waitlist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <VercelAnalytics />
      </body>
    </html>
  );
}
