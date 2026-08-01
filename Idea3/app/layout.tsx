import type { Metadata } from "next";
import { Suspense } from "react";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import Analytics from "./components/Analytics";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Thumb: build real apps on the phone you already have",
  description:
    "No laptop, no setup. Describe what you want, on your phone, and it gets built right there. Join the waitlist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <SiteNav />
        {children}
        <SiteFooter />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
