"use client";

import React, { useState } from "react";

export interface CodeTabsProps {
  cpp: string;
  java: string;
  python: string;
}

export const CodeTabs: React.FC<CodeTabsProps> = ({ cpp, java, python }) => {
  const [activeTab, setActiveTab] = useState<"cpp" | "java" | "python">("cpp");

  const codeMap = {
    cpp,
    java,
    python
  };

  return (
    <div style={{
      background: "#0d1117",
      border: "1px solid #30363d",
      borderRadius: "10px",
      overflow: "hidden",
      fontFamily: "'JetBrains Mono', monospace",
      margin: "0 80px 40px 80px"
    }}>
      {/* Tab Header */}
      <div style={{ display: "flex", background: "#161b22", borderBottom: "1px solid #30363d" }}>
        {(["cpp", "java", "python"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveTab(lang)}
            style={{
              padding: "12px 24px",
              background: activeTab === lang ? "#0d1117" : "transparent",
              color: activeTab === lang ? "#58a6ff" : "#8b949e",
              border: "none",
              borderTop: activeTab === lang ? "2px solid #58a6ff" : "2px solid transparent",
              borderRight: "1px solid #30363d",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
              textTransform: "uppercase",
              outline: "none"
            }}
          >
            {lang === "cpp" ? "C++" : lang === "java" ? "Java" : "Python"}
          </button>
        ))}
      </div>
      
      {/* Code Body */}
      <div style={{ padding: "24px", overflowX: "auto" }}>
        <pre style={{ margin: 0, color: "#e6edf3", fontSize: "0.9rem", lineHeight: 1.5 }}>
          <code>{codeMap[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
};
