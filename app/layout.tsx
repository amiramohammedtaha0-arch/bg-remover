import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        {/* تم تغيير الاستراتيجية إلى beforeInteractive ليتم تحميل السكربت فوراً */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2131755999804092"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        {children}
        <Analytics />
      </body>
    </html>
  );
}