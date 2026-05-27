import type { Metadata } from "next";
import Script from "next/script"; // 1. استيراد مكون Script
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Background Remover | AI-Powered Tool",
  description: "Remove image backgrounds instantly and locally in your browser using AI. Fast, secure, and free.",
  keywords: ["background remover", "remove background", "AI photo editor", "local image tool", "transparent background"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        {children}
        <Analytics />
        
        {/* 2. إضافة كود إعلان Adsterra */}
        <Script
          src="https://pl29563027.effectivecpmnetwork.com/6b/f9/c3/6bf9c3171cdda546f82cf09e8da8087f.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}