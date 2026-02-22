import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://loadforge.org";

export const metadata: Metadata = {
  title: "Loadforge | Verified B2B Lead Database",
  description:
    "The most accurate database of roofing contractors in Canada. Verified contacts. Updated monthly. No scraped junk—built for agencies.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Loadforge | Verified B2B Lead Database",
    description:
      "The most accurate database of roofing contractors in Canada. Verified monthly. No scraped junk.",
    url: baseUrl,
    siteName: "Loadforge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loadforge | Verified B2B Lead Database",
    description: "Roofing contractors in Canada. Verified monthly. No scraped junk.",
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
            __html: `(function(){var t=localStorage.getItem('loadforge-theme');var s=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t==='light'||t==='dark'?t:s);})();`,
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
