import os
import re

directory = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\strings"

def update_file(filepath):
    filename = os.path.basename(filepath)
    # Check if file needs update (e.g. it's very short)
    size = os.path.getsize(filepath)
    if size > 1000:
        print(f"Skipping {filename} - already implemented.")
        return

    lesson_title = filename.replace('.tsx', '').replace('-', ' ').title()
    
    # We will provide a generic but nice looking layout with MinimalSimulationStudio
    template = f"""\"use client\";
import React from "react";
import {{ Type, Binary, Code2, Sparkles }} from "lucide-react";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function {lesson_title.replace(' ', '').replace('//', '').replace('(', '').replace(')', '')}Lesson() {{
  const highlights = [
    {{ 
      title: "Character Encoding", 
      desc: "Understanding how characters are represented in memory.",
      icon: <Binary size={{18}} className="text-amber-500" />,
      bg: "rgba(245, 158, 11, 0.05)"
    }},
    {{ 
      title: "Immutability", 
      desc: "How string modification behaves in memory.",
      icon: <Type size={{18}} className="text-indigo-500" />,
      bg: "rgba(99, 102, 241, 0.05)"
    }},
    {{ 
      title: "Pattern Matching", 
      desc: "Efficient techniques to search within strings.",
      icon: <Code2 size={{18}} className="text-emerald-500" />,
      bg: "rgba(16, 185, 129, 0.05)"
    }}
  ];

  return (
    <div style={{{{ fontVariantNumeric: "tabular-nums", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}}}>
      <div style={{{{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}}}>
        <span style={{{{ 
          display: "inline-block", 
          background: "rgba(139,92,246,0.1)", 
          color: "#8b5cf6", 
          border: "1px solid rgba(139,92,246,0.2)", 
          padding: "4px 12px", 
          borderRadius: 100, 
          fontSize: 10, 
          fontFamily: "'Syne', sans-serif", 
          fontWeight: 800, 
          letterSpacing: "0.1em", 
          textTransform: "uppercase" 
        }}}}>
          String Manipulation
        </span>
      </div>

      <h2 style={{{{ 
        fontFamily: "'Syne', sans-serif", 
        fontWeight: 800, 
        fontSize: 32, 
        letterSpacing: "-0.04em", 
        marginBottom: 12,
        lineHeight: 1.1
      }}}}>
        {lesson_title}
      </h2>
      
      <p style={{{{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 600, marginBottom: 32 }}}}>
        Interactive exploration of {lesson_title.lower()} and related algorithmic concepts in string manipulation.
      </p>

      <div style={{{{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}}}>
        {{highlights.map((h, i) => (
          <div key={{i}} style={{{{ 
            background: "var(--accent-soft)", 
            border: "1px solid var(--border-subtle)", 
            borderRadius: 16, 
            padding: 24,
            transition: "all 0.3s ease"
          }}}}>
            <div style={{{{ 
              width: 40, 
              height: 40, 
              borderRadius: 12, 
              background: h.bg, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              marginBottom: 16 
            }}}}>
              {{h.icon}}
            </div>
            <h4 style={{{{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8 }}}}>{{h.title}}</h4>
            <p style={{{{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}}}>{{h.desc}}</p>
          </div>
        ))}}
      </div>

      <MinimalSimulationStudio 
        title="{lesson_title}"
        code={{[
          "Initialize variables and pointers",
          "Iterate over the string sequence",
          "Apply specific logic condition",
          "Update state based on character",
          "Handle boundary conditions",
          "Return the computed result"
        ]}}
      />

      <div style={{{{ 
        background: "rgba(139,92,246,0.05)", 
        border: "1px solid rgba(139,92,246,0.1)", 
        borderRadius: 20, 
        padding: 24,
        marginTop: 32
      }}}}>
        <div style={{{{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}}}>
          <Sparkles size={{16}} className="text-indigo-400" />
          <span style={{{{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.05em" }}}}>
            Key Takeaway
          </span>
        </div>
        
        <p style={{{{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.8 }}}}>
          Mastering string algorithms requires understanding both the underlying memory representation 
          and efficient parsing techniques. Always account for character encodings and boundary cases.
        </p>
      </div>
    </div>
  );
}}
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(template)
    print(f"Generated {filename}")

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        update_file(os.path.join(directory, filename))
