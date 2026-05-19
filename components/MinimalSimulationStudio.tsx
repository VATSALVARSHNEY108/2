"use client";

import React from "react";
import SimulationLab from "./SimulationLab";
import ComplexityPlotter from "./ComplexityPlotter";

interface MinimalSimulationStudioProps {
  type?: "graph" | "complexity";
  title?: string;
  code?: string | string[];
  [key: string]: any;
}

export default function MinimalSimulationStudio({ 
  type = "graph", 
  title,
  code,
  ...props 
}: MinimalSimulationStudioProps) {
  const normalizedCode = Array.isArray(code) 
    ? code 
    : (typeof code === 'string' ? code.split('\n') : undefined);

  return (
    <div className="w-full h-[650px] mt-8 mb-8 overflow-hidden rounded-[2rem] shadow-2xl">
      {type === "complexity" ? (
        <ComplexityPlotter />
      ) : (
        <SimulationLab title={title} initialCode={normalizedCode} />
      )}
    </div>
  );
}
