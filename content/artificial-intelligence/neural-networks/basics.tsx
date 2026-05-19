"use client";
import { Brain, Cpu, Zap, Lightbulb } from "lucide-react";

export default function AIIntroduction() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "var(--text-primary)" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div className="item-pill" style={{ marginBottom: 16, display: "inline-block", background: "var(--bg-secondary)" }}>
          Ã°Å¸Â§Â  AI / MACHINE LEARNING
        </div>
        <h1 className="headline-main" style={{ fontSize: "clamp(32px, 5vw, 48px)", marginBottom: 16 }}>
          Introduction to Neural Networks
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.7 }}>
          Neural networks are a set of algorithms, modeled loosely after the human brain, 
          that are designed to recognize patterns. They interpret sensory data through a 
          kind of machine perception, labeling or clustering raw input.
        </p>
      </div>

      {/* Core Concepts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
        {[
          { title: "Neurons", desc: "The basic unit of a neural network that receives input and produces output.", icon: <Cpu size={20} /> },
          { title: "Layers", desc: "Structured groups of neurons: Input, Hidden, and Output layers.", icon: <Brain size={20} /> },
          { title: "Weights", desc: "Parameters that determine the strength of influence between neurons.", icon: <Zap size={20} /> },
        ].map(item => (
          <div key={item.title} style={{ padding: 32, background: "var(--bg-secondary)", borderRadius: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              {item.icon}
            </div>
            <h3 className="headline-main" style={{ fontSize: 20, marginBottom: 8 }}>{item.title}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Pro Tip */}
      <div style={{ padding: 32, borderRadius: 24, border: "1px solid var(--accent-vibrant)", background: "rgba(251, 191, 36, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Lightbulb color="var(--accent-vibrant)" />
          <h3 className="headline-main" style={{ fontSize: 18 }}>Interactive Lab Coming Soon</h3>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
          We are building a real-time neural network visualizer where you can adjust weights and see how the decision boundary changes. Stay tuned!
        </p>
      </div>
    </div>
  );
}
