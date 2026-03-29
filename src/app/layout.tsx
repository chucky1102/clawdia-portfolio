/**
 * [INPUT]:  @/styles/globals.css (theme system), Google Fonts CDN (SUSE, VT323, Workbench, Noto Sans SC)
 * [OUTPUT]: Root <html> + <body> shell with global styles and font preload
 * [POS]:    App shell — wraps every page, loads global CSS + fonts. No viewport lock here.
 * [PROTOCOL]: Update this header on any layout change, then check CLAUDE.md
 */

import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "FRI Interface v2026.2.1",
  description: "Intelligent Assistant — Portfolio Shell for Friday",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=SUSE:wght@100;200;300;400;500;600;700&family=VT323&family=Workbench&family=Noto+Sans+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-suse">{children}</body>
    </html>
  );
}
