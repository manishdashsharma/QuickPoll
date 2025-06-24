import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QuickPoll - Create Polls in 30 Seconds, Get Real-Time Results",
    template: "%s | QuickPoll",
  },
  description:
    "The fastest way to create, share, and analyze polls. Get instant feedback from your audience with real-time results. Create polls in seconds with our intuitive interface.",
  keywords: [
    "polls",
    "online polls",
    "create polls",
    "real-time polling",
    "survey tool",
    "quick polls",
    "team decisions",
    "feedback",
    "voting",
    "poll maker",
    "instant polls",
    "live results",
  ],
  authors: [{ name: "Manish" }],
  creator: "Manish",
  publisher: "QuickPoll",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://quickpoll.manishdashsharma.site",
    siteName: "QuickPoll",
    title: "QuickPoll - Create Polls in 30 Seconds, Get Real-Time Results",
    description:
      "The fastest way to create, share, and analyze polls. Get instant feedback from your audience with real-time results.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Additional head elements for better SEO */}
          <link
            rel="canonical"
            href="https://quickpoll.manishdashsharma.site"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
