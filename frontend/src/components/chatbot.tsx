"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

const suggestedQuestions = [
  "How can I get admission?",
  "How much is school fees?",
  "When is school resuming?",
  "How do I register courses?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Welcome to the University of Abuja Chatbot. How may I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input;

    if (!messageToSend.trim()) return;

    const userMessage: Message = { sender: "user", text: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response || "Sorry, I could not process that request.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I could not connect to the server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        darkMode
          ? "bg-[#07111f] text-white"
          : "bg-gradient-to-br from-[#f8fcf7] via-white to-[#eef8ee] text-slate-900"
      }`}
    >
      <div className="min-h-screen flex items-center justify-center px-4 py-8 md:px-6">
        <div
          className={`w-full max-w-5xl rounded-[28px] shadow-[0_20px_60px_rgba(16,24,40,0.12)] border overflow-hidden ${
            darkMode
              ? "bg-[#0d1b2a] border-slate-700"
              : "bg-white/95 border-green-100"
          }`}
        >
          {/* Header */}
          <div className="bg-[#08152f] text-white px-6 py-6 md:px-8 md:py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-[2rem] font-semibold tracking-[-0.03em] leading-tight">
                University of Abuja Chatbot
              </h1>
              <p className="text-sm md:text-base text-slate-200 mt-2 leading-7 font-normal">
                AI-powered assistant for admissions, fees, courses, exams, and more
              </p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="self-start md:self-auto bg-white/10 hover:bg-white/15 border border-white/15 px-5 py-2.5 rounded-xl text-sm font-medium tracking-[-0.01em] transition"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          <div className="bg-[#2faa17] h-2 w-full" />

          <div className="grid md:grid-cols-[300px_1fr] min-h-[680px]">
            {/* Sidebar */}
            <aside
              className={`p-6 md:p-7 border-r ${
                darkMode
                  ? "bg-[#0b1626] border-slate-700"
                  : "bg-[#f7fff5] border-green-100"
              }`}
            >
              <div className="mb-8">
                <div className="w-24 h-18 rounded-3xl bg-[#2faa17] flex items-center justify-center text-white text-2xl font-semibold tracking-[-0.03em] shadow-lg">
                  UofA
                </div>

                <h2 className="mt-6 text-[2rem] leading-tight font-semibold tracking-[-0.035em]">
                  Virtual Assistant
                </h2>

                <p
                  className={`text-[17px] leading-8 mt-3 font-normal ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  Ask questions about the University of Abuja and get instant answers.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] mb-4 text-[#2faa17]">
                  Quick Questions
                </h3>

                <div className="space-y-4">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(question)}
                      className={`w-full text-left px-5 py-4 rounded-2xl border transition text-[15px] leading-6 font-medium tracking-[-0.01em] ${
                        darkMode
                          ? "bg-[#132238] border-slate-600 hover:bg-[#1a2d47] text-slate-100"
                          : "bg-white border-green-200 hover:bg-green-50 text-slate-800"
                      }`}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`mt-8 rounded-3xl p-5 ${
                  darkMode ? "bg-[#132238]" : "bg-green-50"
                }`}
              >
                <p className="text-sm font-semibold tracking-[-0.01em] text-[#2faa17] mb-2">
                  Supported Topics
                </p>
                <p
                  className={`text-[15px] leading-8 font-normal ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Admission, school fees, registration, accommodation, library,
                  departments, results, exams, contact, and more.
                </p>
              </div>
            </aside>

            {/* Main chat */}
            <section className="flex flex-col">
              <div
                className={`flex-1 p-5 md:p-7 overflow-y-auto ${
                  darkMode ? "bg-[#0d1b2a]" : "bg-[#fcfffb]"
                }`}
                style={{ maxHeight: "560px" }}
              >
                <div className="space-y-6">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] px-5 py-4 rounded-[22px] text-[16px] md:text-[17px] leading-8 tracking-[-0.015em] shadow-sm ${
                          msg.sender === "user"
                            ? "bg-[#2faa17] text-white rounded-br-md font-medium"
                            : darkMode
                            ? "bg-[#132238] text-slate-100 rounded-bl-md border border-slate-700 font-normal"
                            : "bg-white text-slate-800 rounded-bl-md border border-green-100 font-normal"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div
                        className={`px-5 py-4 rounded-[22px] rounded-bl-md shadow-sm ${
                          darkMode
                            ? "bg-[#132238] border border-slate-700"
                            : "bg-white border border-green-100"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#2faa17] animate-bounce"></span>
                          <span className="h-2.5 w-2.5 rounded-full bg-[#2faa17] animate-bounce [animation-delay:0.15s]"></span>
                          <span className="h-2.5 w-2.5 rounded-full bg-[#2faa17] animate-bounce [animation-delay:0.3s]"></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div
                className={`border-t p-4 md:p-5 ${
                  darkMode
                    ? "bg-[#0b1626] border-slate-700"
                    : "bg-white border-green-100"
                }`}
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask about admission, school fees, exams..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`flex-1 rounded-2xl px-5 py-4 border outline-none text-[16px] leading-6 tracking-[-0.01em] transition ${
                      darkMode
                        ? "bg-[#132238] border-slate-600 text-white placeholder:text-slate-400 focus:border-[#2faa17]"
                        : "bg-white border-green-200 text-slate-900 placeholder:text-slate-400 focus:border-[#2faa17]"
                    }`}
                  />

                  <button
                    onClick={() => sendMessage()}
                    disabled={loading}
                    className="bg-[#2faa17] hover:bg-[#279814] disabled:opacity-70 text-white px-7 py-4 rounded-2xl text-[16px] font-semibold tracking-[-0.01em] transition shadow-md"
                  >
                    Send
                  </button>
                </div>

                <p
                  className={`text-[13px] leading-6 mt-3 font-normal ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  This chatbot provides general university information and may not replace official notices.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}