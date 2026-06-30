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

const SITE_URL = "https://talalmajeed.com";
const SITE_NAME = "Talal Majeed";
const SITE_TITLE = "Talal Majeed — Software Developer";
const SITE_DESCRIPTION =
  "Software & AI engineer working across cloud infrastructure, intelligent agents, and full-stack platforms. Currently shipping production Kubernetes for a banking platform.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Talal Majeed",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Talal Majeed", url: SITE_URL }],
  creator: "Talal Majeed",
  publisher: "Talal Majeed",
  keywords: [
    "Talal Majeed",
    "Software Developer",
    "Software Engineer",
    "AI Engineer",
    "Full-Stack Developer",
    "Cloud Infrastructure",
    "Kubernetes",
    "DevOps",
    "Intelligent Agents",
    "Machine Learning",
    "Web Developer",
    "Portfolio",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Talal Majeed — Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@TalalMajeed",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
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
      suppressHydrationWarning
    >
      <head>
        <script
          // Apply the saved theme before paint to avoid a flash of the wrong palette.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          // Person structured data helps search engines build a knowledge panel.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Talal Majeed",
              url: SITE_URL,
              jobTitle: "Software Developer",
              description: SITE_DESCRIPTION,
              email: "mailto:m.talal.majeed@gmail.com",
              sameAs: [
                "https://github.com/TalalMajeed",
                "https://www.linkedin.com/in/talalmajeed/",
                "https://www.upwork.com/freelancers/muhammadtalalm",
              ],
              knowsAbout: [
                "Software Engineering",
                "Artificial Intelligence",
                "Cloud Infrastructure",
                "Kubernetes",
                "Full-Stack Development",
              ],
            }),
          }}
        />
        <Cursor />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
