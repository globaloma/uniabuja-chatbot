"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  GraduationCap,
  FileCheck2,
  BookOpen,
  Building2,
  Stamp,
  Send,
  Moon,
  SunMedium,
  Sparkles,
} from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
  time: string;
};

type Topic = {
  label: string;
  question: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const topics: Topic[] = [
  { label: "Admission", question: "What are the admission requirements?", icon: GraduationCap },
  { label: "Post-UTME", question: "How do I register for Post-UTME screening?", icon: FileCheck2 },
  { label: "Courses & Faculties", question: "What faculties and courses are available?", icon: BookOpen },
  { label: "Accommodation", question: "Is hostel accommodation available?", icon: Building2 },
  { label: "Clearance", question: "What is the clearance procedure after admission?", icon: Stamp },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text:
        "Welcome to the University of Abuja virtual assistant! I can help with admission, Post-UTME screening, courses & programmes, accommodation, and clearance procedures. What would you like to know?",
      time: timeNow(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage ?? input;
    if (!messageToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: messageToSend, time: timeNow() }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response || "Sorry, I could not process that request.",
          time: timeNow(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I couldn't reach the server just now. Please check your connection and try again.",
          time: timeNow(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      className={`flex h-dvh w-full flex-col transition-colors duration-300 ${
        darkMode ? "bg-[#0a140f] text-slate-100" : "bg-[#f7f6f1] text-[#16241d]"
      }`}
    >
      {/* Header */}
      <header
        className={`flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 ${
          darkMode ? "border-white/10 bg-[#0d1a13]" : "border-black/5 bg-white"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-[var(--uniabuja-green)]/30 sm:h-12 sm:w-12">
            <Image src="/uniabuja-logo.png" alt="University of Abuja crest" fill sizes="48px" className="object-contain p-1" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
              UniAbuja Assistant
            </h1>
            <p
              className={`flex items-center gap-1.5 truncate text-xs sm:text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--uniabuja-green)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--uniabuja-green)]" />
              </span>
              University of Abuja &middot; Online
            </p>
          </div>
        </div>

        <button
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
            darkMode
              ? "border-white/15 bg-white/5 text-amber-300 hover:bg-white/10"
              : "border-black/10 bg-black/[0.03] text-slate-600 hover:bg-black/5"
          }`}
        >
          {darkMode ? <SunMedium size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar (desktop only) */}
        <aside
          className={`hidden w-72 shrink-0 flex-col overflow-y-auto border-r p-5 lg:flex ${
            darkMode ? "border-white/10 bg-[#0d1a13]" : "border-black/5 bg-white/60"
          }`}
        >
          <p
            className={`mb-3 text-xs font-semibold uppercase tracking-wider ${
              darkMode ? "text-emerald-400" : "text-[var(--uniabuja-green)]"
            }`}
          >
            Quick topics
          </p>
          <div className="flex flex-col gap-2">
            {topics.map(({ label, question, icon: Icon }) => (
              <button
                key={label}
                onClick={() => sendMessage(question)}
                className={`group flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left text-sm font-medium transition ${
                  darkMode
                    ? "border-white/10 bg-white/[0.03] hover:border-emerald-500/40 hover:bg-white/[0.06]"
                    : "border-black/5 bg-white hover:border-[var(--uniabuja-green)]/30 hover:bg-emerald-50/60 shadow-sm"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-[var(--uniabuja-green)]"
                  }`}
                >
                  <Icon size={17} />
                </span>
                {label}
              </button>
            ))}
          </div>

          <div
            className={`mt-6 rounded-2xl border p-4 text-xs leading-relaxed ${
              darkMode
                ? "border-amber-400/20 bg-amber-400/[0.06] text-slate-300"
                : "border-[var(--uniabuja-gold)]/30 bg-amber-50 text-slate-600"
            }`}
          >
            <p className={`mb-1 flex items-center gap-1.5 font-semibold ${darkMode ? "text-amber-300" : "text-amber-700"}`}>
              <Sparkles size={13} /> Scope of this assistant
            </p>
            I currently answer questions on <strong>admission</strong>, <strong>Post-UTME</strong>,{" "}
            <strong>courses &amp; programmes</strong>, <strong>accommodation</strong>, and{" "}
            <strong>clearance</strong>. For anything else, please contact the university&apos;s
            administrative office directly.
          </div>
        </aside>

        {/* Main chat column */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`animate-message-in flex items-end gap-2 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-black/5">
                      <Image src="/uniabuja-logo.png" alt="" fill sizes="28px" className="object-contain p-0.5" />
                    </div>
                  )}
                  <div className={`flex max-w-[80%] flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                        msg.sender === "user"
                          ? "rounded-br-sm bg-[var(--uniabuja-green)] text-white"
                          : darkMode
                          ? "rounded-bl-sm border border-white/10 bg-[#132218] text-slate-100"
                          : "rounded-bl-sm border border-black/5 bg-white text-slate-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className={`mt-1 px-1 text-[11px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex animate-fade-in items-end gap-2">
                  <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-black/5">
                    <Image src="/uniabuja-logo.png" alt="" fill sizes="28px" className="object-contain p-0.5" />
                  </div>
                  <div
                    className={`flex items-center gap-1.5 rounded-2xl rounded-bl-sm border px-4 py-3 ${
                      darkMode ? "border-white/10 bg-[#132218]" : "border-black/5 bg-white"
                    }`}
                  >
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--uniabuja-green)]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--uniabuja-green)] [animation-delay:0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--uniabuja-green)] [animation-delay:0.3s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Mobile quick topics */}
          <div
            className={`shrink-0 overflow-x-auto border-t px-4 py-2.5 lg:hidden ${
              darkMode ? "border-white/10 bg-[#0d1a13]" : "border-black/5 bg-white/70"
            }`}
          >
            <div className="flex w-max gap-2">
              {topics.map(({ label, question, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(question)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    darkMode
                      ? "border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]"
                      : "border-black/5 bg-white text-slate-700 shadow-sm hover:bg-emerald-50"
                  }`}
                >
                  <Icon size={13} className={darkMode ? "text-emerald-400" : "text-[var(--uniabuja-green)]"} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Input bar */}
          <div
            className={`shrink-0 border-t px-4 py-3 sm:px-6 sm:py-4 ${
              darkMode ? "border-white/10 bg-[#0d1a13]" : "border-black/5 bg-white"
            }`}
          >
            <div className="mx-auto flex max-w-2xl items-center gap-2 sm:gap-3">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about admission, Post-UTME, courses, accommodation, clearance..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`flex-1 rounded-full border px-4 py-3 text-[15px] outline-none transition ${
                  darkMode
                    ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:border-emerald-500/50"
                    : "border-black/10 bg-[#f7f6f1] text-slate-900 placeholder:text-slate-400 focus:border-[var(--uniabuja-green)]"
                }`}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--uniabuja-green)] text-white shadow-md transition hover:bg-[var(--uniabuja-green-dark)] disabled:opacity-40 sm:h-12 sm:w-12"
              >
                <Send size={18} />
              </button>
            </div>
            <p className={`mx-auto mt-2 max-w-2xl text-center text-[11px] sm:text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              Answers cover admission, Post-UTME, courses &amp; programmes, accommodation, and clearance only. For
              other enquiries, please contact the university&apos;s administrative office.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
