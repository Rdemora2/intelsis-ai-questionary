import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Business Automation Radar",
  description:
    "Descubra em 60s onde sua empresa perde eficiência — e o que já pode ser automatizado com IA.",
  icons: {
    icon: [
      { url: "/ico/favicon.ico", sizes: "any" },
      { url: "/ico/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/ico/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/ico/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0f1a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
