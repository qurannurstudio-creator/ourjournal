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
  metadataBase: new URL('https://modernjournal.info'),
  title: {
    default: "Modern Journal - Exclusive Trending Stories",
    template: "%s | Modern Journal"
  },
  description: "Your premium source for the latest viral stories, in-depth analysis, and exclusive deep-dives into trending topics.",
  keywords: ["Viral Stories", "Trending News", "Exclusive Leaks", "Deep Dives", "Psychology", "Modern Journal"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://modernjournal.info',
    siteName: 'Modern Journal',
    title: 'Modern Journal - Exclusive Trending Stories',
    description: 'Your premium source for the latest viral stories and exclusive deep-dives.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Journal - Exclusive Trending Stories',
    description: 'Your premium source for the latest viral stories and exclusive deep-dives.',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
