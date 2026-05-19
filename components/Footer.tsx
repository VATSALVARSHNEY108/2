"use client";

import React from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { Code, Send, Globe, Mail, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Curriculum", href: "/curriculum" },
      { label: "Playground", href: "/playground" },
      { label: "Notes", href: "/notes" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "/community" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { icon: Code, href: "#", label: "GitHub" },
  { icon: Send, href: "#", label: "Twitter" },
  { icon: Globe, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  const pathname = usePathname();
  const isNotesPage = pathname?.startsWith("/notes");
  const isLabPage = pathname?.startsWith("/curriculum/") && (pathname.split("/").length >= 5);

  if (isNotesPage || isLabPage) return null;

  return (
    <footer className="relative z-10 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo className="w-8 h-8" />
              <span className="text-lg font-black tracking-tighter text-[var(--text-primary)]">CoreCode</span>
            </Link>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-md font-medium">
              The ultimate platform for mastering Data Structures & Algorithms through interactive visualizations.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-11 h-11 rounded-xl bg-[var(--text-primary)]/5 border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)] transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.label}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[var(--text-muted)] text-[13px] font-bold tracking-tight">
            © {new Date().getFullYear()} CoreCode.
          </p>
          <div className="flex items-center gap-8">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className="text-[13px] font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
