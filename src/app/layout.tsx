import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Latest Breaking News & Trending Stories`,
    template: `%s | ${SITE_NAME}`
  },
  description: "Your trusted source for the latest news, insightful analysis, exclusive stories, and in-depth reports.",
  keywords: ["Algeria Times", "Breaking News", "Trending Stories", "Global Analysis", "Deep Dives", "Daily News"],
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
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Latest Breaking News & Trending Stories`,
    description: "Your trusted source for the latest news, insightful analysis, and exclusive deep-dives.",
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Latest Breaking News & Trending Stories`,
    description: "Your trusted source for the latest news, insightful analysis, and exclusive deep-dives.",
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
