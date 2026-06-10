import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "getprospectra- make your portfolio outshine",
  description: "GetProspectra is the best free portfolio generation and AI resume maker. Build a full professional profile using AI, create portfolio websites for free, and make your portfolio outshine.",
  keywords: [
    "portfolio generation for free",
    "portfolio websites for free",
    "resume maker for free",
    "full professional profile builder using Ai",
    "AI portfolio builder",
    "free resume builder",
    "professional portfolio",
    "getprospectra"
  ],
  authors: [{ name: "GetProspectra" }],
  openGraph: {
    title: "getprospectra- make your portfolio outshine",
    description: "GetProspectra is the best free portfolio generation and AI resume maker. Build a full professional profile using AI and create portfolio websites for free.",
    url: "https://getprospectra.com",
    siteName: "GetProspectra",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "getprospectra- make your portfolio outshine",
    description: "GetProspectra is the best free portfolio generation and AI resume maker. Build a full professional profile using AI.",
  },
  robots: {
    index: true,
    follow: true,
  }
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
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
