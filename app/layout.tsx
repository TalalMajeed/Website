import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Cursor } from "@/components/layout/cursor";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Inter({
  variable: "--font-sans-site",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-site",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talal Majeed — Software Developer",
  description:
    "Software & AI engineer working across cloud infrastructure, intelligent agents, and full-stack platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body>
        <Cursor />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
