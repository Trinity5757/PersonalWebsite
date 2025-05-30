import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from 'next-auth/react';

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Olympiah - Elevating Sports",
  description: "Join Olympiah and revolutionize the way athletes connect and grow.",
  keywords: ["sports", "networking", "athletes", "community", "Olympiah"],
  authors: [{ name: "Olympiah Team", url: "https://olympiah.org" }],
  metadataBase: new URL("https://olympiah.org"), // Ensure absolute URLs
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Olympiah - Elevating Sports",
    description: "Join Olympiah and revolutionize the way athletes connect and grow.",
    url: "https://olympiah.org",
    siteName: "Olympiah",
    images: [
      {
        url: "https://olympiah-tes-file-upload.s3.us-west-1.amazonaws.com/olympiah.svg",
        width: 1200,
        height: 630,
        alt: "Olympiah Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Olympiah - Elevating Sports",
    description: "Join Olympiah and revolutionize the way athletes connect and grow.",
    site: "@Olympiah",
    creator: "@Olympiah",
    images: ["https://olympiah-tes-file-upload.s3.us-west-1.amazonaws.com/olympiah.svg"],
  },
  robots: "index, follow", // Tells search engines to index and follow links
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}