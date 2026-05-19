"use client";

import { ThemeProvider } from "next-themes";
import React, { ReactNode } from "react";
import dynamic from "next/dynamic";

import { LazyMotion, domAnimation } from "framer-motion";

const AIBot = dynamic(() => import("@/components/AIBot"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LazyMotion features={domAnimation}>
        {children}
        <Footer />
        <AIBot />
      </LazyMotion>
    </ThemeProvider>
  );
}
