import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
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

        {/* 1. كود الـ Popunder الجديد */}
        <Script
          src="https://downconvenientmagnetic.com/6bf9c3171cdda546f82cf09e8da8087f.js"
          strategy="afterInteractive"
        />

        {/* 2. كود الـ Native Banner الجديد */}
        <Script
          async
          data-cfasync="false"
          src="https://downconvenientmagnetic.com/6af2b6818f392ef46f8642bca45bee94/invoke.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}