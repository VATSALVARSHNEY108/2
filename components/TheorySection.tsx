"use client";

import React from "react";

export interface TheorySectionProps {
  title: string;
  definition: string;
  timeComplexity: string;
  spaceComplexity: string;
  keyPoints: (string | { title: string; description: string })[];
  breadcrumbs?: string;
}

export const TheorySection: React.FC<TheorySectionProps> = ({
  title,
  definition,
  timeComplexity,
  spaceComplexity,
  keyPoints,
  breadcrumbs = "DATA STRUCTURES • ALGORITHMS",
}) => {
  return (
    <div style={{
      background: "#0B0F19",
      color: "#c9d1d9",
      fontFamily: "'Inter', sans-serif",
      padding: "60px 80px 40px",
      display: "flex",
      flexDirection: "column",
      gap: "30px",
    }}>
      {/* Header Section */}
      <div>
        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#58a6ff", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>
          {breadcrumbs}
        </div>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, marginBottom: "16px", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          {title}
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#8b949e", maxWidth: "800px", margin: 0 }}>
          {definition}
        </p>
      </div>

      {/* Complexity Badges */}
      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ background: "rgba(22,27,34,0.5)", padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(88,166,255,0.2)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ fontSize: "0.65rem", color: "#58a6ff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Time</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#58a6ff" }}>{timeComplexity}</div>
        </div>
        <div style={{ background: "rgba(22,27,34,0.5)", padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(88,166,255,0.2)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ fontSize: "0.65rem", color: "#58a6ff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Space</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#58a6ff" }}>{spaceComplexity}</div>
        </div>
      </div>

      <div style={{ height: "1px", background: "#1C2333", margin: "10px 0" }} />

      {/* Key Points Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
        {keyPoints.map((point, i) => {
          const pointTitle = typeof point === "string" ? `Key Principle ${i + 1}` : point.title;
          const pointDesc = typeof point === "string" ? point : point.description;
          
          return (
            <div key={i} style={{ background: "rgba(22,27,34,0.5)", padding: "24px", borderRadius: "16px", border: "1px solid rgba(88,166,255,0.1)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#e6edf3" }}>{pointTitle}</div>
              <div style={{ fontSize: "0.85rem", color: "#8b949e", lineHeight: 1.6 }}>{pointDesc}</div>
            </div>
          );
        })}
      </div>
      
      <div style={{ height: "1px", background: "#1C2333", marginTop: "10px" }} />
    </div>
  );
};
