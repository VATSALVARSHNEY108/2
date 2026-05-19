"use client";

import dynamic from "next/dynamic";

const BackgroundEffect = dynamic(() => import("@/components/BackgroundEffect"), { ssr: false });
const AIBot = dynamic(() => import("@/components/AIBot"), { ssr: false });

export default function ClientSideEffects() {
  return (
    <>
      <BackgroundEffect />
      <AIBot />
    </>
  );
}
