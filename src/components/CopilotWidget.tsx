import { useState, useRef, useEffect } from "react";
import { Brain, Send, ChevronRight, Loader, X, MessageSquareText } from "../components/icons";
import { copilotResponses } from "../data/dummy";
import { api, appMode } from "../lib/api";
import { useLocale } from "../context/LocaleContext";

interface Props { onNavigate: (page: string, param?: string) => void; }

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: string[];
  confidence?: number;
}

const suggestedQuestions = [
  { q: "Why is Vikram Singh important?", key: "connections" },
  { q: "Recent changes?", key: "changed" },
  { q: "Similar patterns?", key: "pattern" },
];

function formatResponse(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <div key={i} className="font-semibold text-[var(--color-text-primary)] mt-2 mb-1">{line.slice(2, -2)}</div>;
    }
    if (line.startsWith("- ")) {
      return <div key={i} className="flex items-start gap-2 text-[12px] text-[var(--color-text-secondary)] pl-2">
        <span className="w-1.5 h-1.5 bg-[var(--color-primary)] flex-shrink-0 mt-1.5" /><span>{line.slice(2)}</span>
      </div>;
    }
    if (line.startsWith("*") && line.endsWith("*")) {
      return <div key={i} className="text-[11px] text-[var(--color-text-muted)] italic mt-1">{line.slice(1, -1)}</div>;
    }
    if (line.trim() === "") return <div key={i} className="h-1.5" />;
    return <div key={i} className="text-[13px] text-[var(--color-text-secondary)]">{line}</div>;
  });
}

export default function CopilotWidget({ onNavigate }: Props) {
  const { locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: copilotResponses.default,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const getResponse = (q: string): { content: string; citations: string[]; confidence: number } => {
    const lower = q.toLowerCase();
    if (lower.includes("vikram") || lower.includes("important") || lower.includes("why")) return { content:"**Evidence-backed lead:**\nVikram Singh is a bridge entity because the field note links him to Vehicle V001 and fictional cross-case record CASE-X007. This prioritizes review; it does not establish guilt.", citations:["EV-2026-0007"], confidence:.86 };
    if (lower.includes("connected") || lower.includes("connection")) return { content:"**Connection analysis:**\nRaj Mehta is connected to Arjun Verma by a call record and to Vehicle V001 by the synthetic CCTV evidence.", citations:["EV-2026-0002","EV-2026-0004","EV-2026-0006"], confidence:.92 };
    if (lower.includes("changed") || lower.includes("new") || lower.includes("update")) return { content:"**Latest supported change:**\nThe investigation note added a cross-case lead connecting Vikram Singh, Vehicle V001 and CASE-X007.", citations:["EV-2026-0007"], confidence:.86 };
    return { content:"I could not match that question to a supported deterministic query. Ask why Vikram Singh is important or which evidence connects Raj Mehta to Vehicle V001.", citations:[], confidence:.35 };
  };

  const sendMessage = async (q?: string) => {
    const text = q || input.trim();
    if (!text) return;
    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const result = appMode === "full" ? await api.copilot("CASE-2026-017", text, locale) : getResponse(text);
      const assistantMsg: Message = {
        role: "assistant",
        content: result.answer || result.content,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        citations: result.citations || [],
        confidence: result.confidence,
      };
      setMessages(m => [...m, assistantMsg]);
    } catch (cause) {
      setMessages(m => [...m, { role:"assistant", content:cause instanceof Error ? cause.message : "Unable to answer.", timestamp:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}), citations:[], confidence:0 }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Copilot" : "Open Copilot"}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-sm border transition-colors flex items-center justify-center ${
          isOpen
            ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border-strong)]"
            : "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
        }`}
      >
        {isOpen ? <X size={22} /> : <MessageSquareText size={22} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--color-alert-critical)] border-2 border-[var(--color-base-bg)]" />
        )}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 inset-x-4 sm:inset-x-auto sm:right-6 z-50 sm:w-[380px] h-[70vh] sm:h-[550px] max-h-[80vh] flex flex-col gov-panel overflow-hidden transition-all duration-200 origin-bottom-right ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm">
              <Brain size={18} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h1 className="text-[var(--color-text-primary)] font-bold text-[14px]">Decypher Copilot</h1>
              <p className="text-[var(--color-text-muted)] text-[10px]">AI assistant for CASE-2026-017</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[var(--color-surface-2)] border-b border-[var(--color-border-subtle)] px-4 py-2 flex-shrink-0">
          <p className="text-[10px] text-center leading-tight" style={{ color: "var(--color-alert-critical)" }}>
            AI responses are analytical insights based on investigation data. Requires verification.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="p-1 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm mr-2 mt-1 flex-shrink-0 h-6 w-6 flex items-center justify-center">
                  <Brain size={12} className="text-[var(--color-primary)]" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-sm p-3 ${
                msg.role === "user"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface)] border border-[var(--color-border-strong)]"
              }`}>
                <div className="leading-relaxed">{formatResponse(msg.content)}</div>
                <div className={`text-[9px] mt-1.5 ${msg.role === "user" ? "text-white/70 text-right" : "text-[var(--color-text-muted)]"}`}>
                  {msg.timestamp}
                </div>

                {msg.role === "assistant" && msg.confidence !== undefined && (
                  <div className="mt-2 text-[10px] font-mono text-[var(--color-text-muted)]">Confidence: {Math.round(msg.confidence * 100)}%</div>
                )}

                {msg.role === "assistant" && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2"><div className="text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Supporting evidence</div><div className="flex flex-wrap gap-1">{msg.citations.map(id=><button key={id} onClick={()=>{onNavigate("evidence-detail",id);setIsOpen(false)}} className="text-[10px] font-mono border border-[var(--color-primary)] text-[var(--color-primary)] px-2 py-1">{id}</button>)}</div></div>
                )}

                {msg.role === "assistant" && i > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {[
                      { label: "Graph", page: "graph" },
                      { label: "Evidence", page: "evidence" },
                    ].map(link => (
                      <button
                        key={link.page}
                        className="text-[10px] text-[var(--color-text-primary)] bg-[var(--color-base-bg)] border border-[var(--color-border-strong)] hover:border-[var(--color-primary)] px-2 py-1 rounded-sm flex items-center gap-1 transition-colors"
                        onClick={() => {
                          onNavigate(link.page);
                          setIsOpen(false);
                        }}
                      >
                        {link.label} <ChevronRight size={9} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-1 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm mr-2 mt-1 flex-shrink-0 h-6 w-6 flex items-center justify-center">
                <Brain size={12} className="text-[var(--color-primary)]" />
              </div>
              <div className="bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-sm p-3 flex items-center gap-2">
                <Loader size={12} className="text-[var(--color-primary)] animate-spin" />
                <span className="text-[11px] text-[var(--color-text-secondary)]">Analyzing data...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions */}
        <div className="border-t border-[var(--color-border-subtle)] px-4 py-2 bg-[var(--color-base-bg)] flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {suggestedQuestions.map(sq => (
              <button
                key={sq.key}
                className="text-[10px] text-[var(--color-text-secondary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] px-2.5 py-1.5 rounded-sm whitespace-nowrap transition-colors flex-shrink-0"
                onClick={() => sendMessage(sq.q)}
              >
                {sq.q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-[var(--color-border-subtle)] p-3 bg-[var(--color-surface)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-[var(--color-base-bg)] border border-[var(--color-border-strong)] focus-within:border-[var(--color-primary)] rounded-sm px-3 py-2 transition-colors">
              <input
                type="text"
                placeholder="Ask about this case..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                className="flex-1 bg-transparent text-[12px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none"
              />
            </div>
            <button
              className="p-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-sm transition-colors flex-shrink-0 disabled:opacity-50"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
