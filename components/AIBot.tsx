"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, User, MessageSquare } from "lucide-react";

export default function AIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Backend connection failed");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: "bot", text: "Error connecting to assistant." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1005]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[380px] h-[550px] rounded-2xl shadow-2xl overflow-hidden flex flex-col border bg-[var(--bg-primary)] border-[var(--border-color)]"
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-primary)]">
                  <Sparkles size={16} />
                </div>
                <h3 className="font-bold text-[var(--text-primary)]">Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-[var(--text-primary)]/5 text-[var(--text-secondary)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border border-[var(--border-color)] ${msg.role === "user" ? "bg-[var(--bg-secondary)]" : ""}`}>
                    {msg.role === "user" ? <User size={14} /> : <Sparkles size={14} className="text-[var(--text-primary)]" />}
                  </div>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed border ${
                    msg.role === "user" 
                      ? "bg-[var(--bg-secondary)] border-[var(--border-color)]" 
                      : "bg-[var(--bg-primary)] border-[var(--border-color)]"
                  } text-[var(--text-primary)]`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <form onSubmit={handleSend} className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3 pl-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-[var(--text-primary)]/10 transition-all text-[var(--text-primary)]"
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10 disabled:opacity-30"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 bg-[var(--text-primary)] text-[var(--bg-primary)]"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
