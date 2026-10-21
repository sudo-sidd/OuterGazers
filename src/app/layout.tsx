import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import SmoothScrollProvider from "@/components/animations/SmoothScrollProvider";
import SplashVideo from "@/components/ui/SplashVideo";
import dynamic from "next/dynamic";

const GlobalCursor = dynamic(
  () => import("@/components/animations/CursorEffect"),
  { ssr: false }
);

const GlobalStarfield = dynamic(
  () => import("@/components/animations/StarfieldCanvas"),
  { ssr: false }
);

// Initialize the primary font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://outergazer.in'),
  title: {
    default: "OuterGazers | Engineering Realities",
    template: "%s | OuterGazers"
  },
  description:
    "A vanguard interactive studio engineering the next generation of realities across PC, Android, AR, and Meta Quest VR.",
  keywords: ["AR", "VR", "Meta Quest", "Interactive Studio", "Game Development", "Virtual Reality", "Augmented Reality"],
  authors: [{ name: "OuterGazers Studio" }],
  creator: "OuterGazers Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://outergazer.in",
    title: "OuterGazers | Engineering Realities",
    description: "A vanguard interactive studio engineering the next generation of realities across PC, Android, AR, and Meta Quest VR.",
    siteName: "OuterGazers",
    images: [
      {
        url: "/images/logo_v2.png", // Assuming this is an appropriate OG image, ideally a 1200x630 banner
        width: 800,
        height: 600,
        alt: "OuterGazers Logo",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "OuterGazers | Engineering Realities",
    description: "A vanguard interactive studio engineering the next generation of realities across PC, Android, AR, and Meta Quest VR.",
    images: ["/images/logo_v2.png"],
  },
  icons: {
    icon: "/images/logo_v2.png",
    apple: "/images/logo_v2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className} font-sans bg-[#0a0a0a] text-[#f0f0f0] antialiased overflow-x-hidden selection:bg-[#00b4d8] selection:text-[#0a0a0a]`}>
        <SplashVideo />
        <SmoothScrollProvider>
          {/* 
            The Navbar and Footer are placed here globally.
            NOTE: Inside Navbar.tsx and Footer.tsx, the `usePathname()` 
            hook returns `null` if the user is on /login or /dashboard. 
          */}
          <GlobalStarfield />
          <GlobalCursor />
          <Navbar />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
