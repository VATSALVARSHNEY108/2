import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import BackgroundEffect from "@/components/BackgroundEffect";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "CoreCode — Engineering Visualized",
  description: "A modern edtech platform with dynamic, folder-based learning content.",
  icons: {
    icon: "/corecode-mark.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://unavatar.io" />
        <link rel="preload" href="/bg.jpg" as="image" type="image/jpeg" />
      </head>
      <body className="antialiased font-sans transition-colors duration-300" suppressHydrationWarning>
        <Providers>
          <BackgroundEffect />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
