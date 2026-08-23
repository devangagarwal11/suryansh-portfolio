import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c0c0c',
};
import { Geist, Geist_Mono, DM_Serif_Display, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";
import { siteConfig } from "@/lib/constants";
import { CustomCursor } from "@/components/ui/CustomCursor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: 'Suryansh Srivastava | AI Visual Creator & Motion Artist',
    template: '%s | Suryansh Srivastava'
  },
  description: 'Creative portfolio of Suryansh Srivastava. Specializing in high-end AI Video Synthesis, Cinematic Motion Arts, and Premium Brand Storytelling. Transforming complex ideas into cinematic digital masterpieces.',
  keywords: [
    'Suryansh Srivastava', 
    'AI Visual Creator', 
    'Motion Artist India', 
    'AI Video Synthesis Portfolio', 
    'Cinematic Motion Graphics', 
    'Runway ML Expert', 
    'Luma AI Video', 
    'High-end Video Editor', 
    'Premium Graphic Design'
  ],
  authors: [{ name: 'Suryansh Srivastava', url: 'https://suryanshsrivastavaa.vercel.app' }],
  creator: 'Suryansh Srivastava',
  metadataBase: new URL('https://suryanshsrivastavaa.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Suryansh Srivastava | AI Visual Creator & Motion Artist',
    description: 'Transforming visions into cinematic digital experiences. Explore the premium portfolio of Suryansh Srivastava.',
    url: 'https://suryanshsrivastavaa.vercel.app',
    siteName: 'Suryansh Srivastava',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Suryansh Srivastava — AI Visual Creator & Motion Artist',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suryansh Srivastava | AI Visual Creator & Motion Artist',
    description: 'High-end AI Video Synthesis & Cinematic Motion Arts.',
    images: ['/og-image.png'],
    creator: '@Suryansh_S',
  },
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
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
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
      className={`dark ${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <SmoothScrollProvider>
            <InteractiveBackground />
            <div className="grain-overlay" />
            <CustomCursor />
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
