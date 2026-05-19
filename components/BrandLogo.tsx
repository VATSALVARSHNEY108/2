"use client";

export default function BrandLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div
      className={`${className} rounded-xl flex items-center justify-center overflow-hidden relative border shadow-lg group-hover:rotate-6 transition-transform duration-300`}
      style={{
        background: "var(--bg-primary)",
        borderColor: "var(--text-primary)",
        color: "var(--text-primary)",
      }}
      aria-label="CoreCode logo"
    >
      <svg
        viewBox="0 0 96 72"
        role="img"
        aria-hidden="true"
        className="w-[78%] h-[78%]"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 10h22l9 18 9-18h22l18 30H67L56 62H40L29 40H8L20 62h20" />
        <path d="M30 10v30M48 10v52M70 10 56 40M20 10l20 52M67 40H29" />
        <path d="M30 40 39 24h18l10 16M40 62l8-22 8 22" />
      </svg>
    </div>
  );
}
