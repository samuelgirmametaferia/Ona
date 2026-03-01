import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://leadforge.io";

export const metadata: Metadata = {
  title: "LeadForge | Verified B2B Lead Database",
  description:
    "The most accurate B2B lead database for your outreach. Verified contacts. Updated monthly. No scraped junk—built for sales teams and agencies.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "LeadForge | Verified B2B Lead Database",
    description:
      "The most accurate B2B lead database. Verified contacts. Updated monthly. No scraped junk.",
    url: baseUrl,
    siteName: "LeadForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadForge | Verified B2B Lead Database",
    description: "Verified B2B contacts. Updated monthly. No scraped junk.",
  },
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('leadforge-theme');var s=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t==='light'||t==='dark'?t:s);})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
