import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  CalendarCheck,
  Lightbulb,
  Loader2,
  MessageSquareText,
  Quote,
  Send,
  Sparkles,
  Target,
  X,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";
import { api } from "../api/axios";
import { useToast } from "../context/ToastContext";

const quickPrompts = [
  "Plan my next 3 work blocks",
  "What should I do first today?",
  "Suggest task priorities",
  "Give me a motivation boost"
];

function AssistantContent({ compact = false }) {
  const [prompt, setPrompt] = useState("");
  const [advice, setAdvice] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "I can help plan your day, suggest priorities, and turn your task list into focused next actions."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const cards = useMemo(() => {
    if (!advice) return [];
    return [
      { title: "Smart recommendations", icon: Sparkles, items: advice.recommendations, tone: "from-cyan-300/20 to-teal-300/10" },
      { title: "Priority suggestions", icon: Target, items: advice.prioritySuggestions, tone: "from-rose-300/20 to-fuchsia-300/10" },
      { title: "Daily plan", icon: CalendarCheck, items: advice.dailySuggestions, tone: "from-amber-300/20 to-lime-300/10" },
      { title: "Productivity tips", icon: Lightbulb, items: advice.productivityTips, tone: "from-violet-300/20 to-sky-300/10" }
    ].filter((card) => Array.isArray(card.items) && card.items.length);
  }, [advice]);

  const ask = async (event, quickPrompt) => {
    event?.preventDefault();
    const nextPrompt = (quickPrompt || prompt).trim();
    if (!nextPrompt || loading) return;

    setLoading(true);
    setPrompt("");
    setMessages((current) => [...current, { role: "user", text: nextPrompt }]);

    try {
      const { data } = await api.post("/assistant/ask", { prompt: nextPrompt });
      setAdvice(data.advice);
      setMessages((current) => [...current, { role: "assistant", text: data.advice.reply || data.advice.summary }]);
    } catch (error) {
      const message = error.response?.data?.message || (error.request ? "Backend server is not running. Start the API and try again." : "Assistant unavailable");
      showToast(message, "error");
      setMessages((current) => [...current, { role: "assistant", text: "I could not reach the assistant service. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={compact ? "flex h-full flex-col" : ""}>
      <div className="relative overflow-hidden rounded-lg border border-cyan-300/20 bg-slate-950/80 p-4 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(45,212,191,0.28),transparent_28%),radial-gradient(circle_at_92%_20%,rgba(125,211,252,0.18),transparent_32%)]" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 shadow-lg shadow-cyan-400/20">
            <BrainCircuit className="h-5 w-5 text-cyan-200" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200/80">AI command center</p>
            <h2 className="truncate text-lg font-black text-white">Productivity Assistant</h2>
          </div>
          <Zap className="ml-auto h-5 w-5 text-amber-200" />
        </div>

        <div className="relative mt-4 space-y-3">
          <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/20"
                    : "border border-white/10 bg-white/10 text-slate-100"
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />
                  Thinking through your task list...
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((item) => (
              <button
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-200/60 hover:bg-cyan-300/10"
                disabled={loading}
                key={item}
                onClick={(event) => ask(event, item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          <form className="flex gap-2" onSubmit={ask}>
            <input
              className="input border-cyan-300/20 bg-slate-950/70"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask for tips, priorities, or a daily focus plan"
            />
            <button className="btn-primary px-3 shadow-cyan-400/20" disabled={loading || !prompt.trim()} type="submit">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>

      {advice && (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-cyan-100">
              <MessageSquareText className="h-4 w-4" />
              Assistant summary
            </div>
            <p className="text-sm leading-relaxed text-slate-200">{advice.summary}</p>
          </div>

          {advice.focusBlocks?.length ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {advice.focusBlocks.map((block, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-3"
                  initial={{ opacity: 0, y: 10 }}
                  key={`${block.title}-${index}`}
                  transition={{ delay: index * 0.04 }}
                >
                  <p className="text-sm font-black text-white">{block.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{block.suggestion}</p>
                </motion.div>
              ))}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg border border-white/10 bg-gradient-to-br ${card.tone} p-4 backdrop-blur-xl`}
                  initial={{ opacity: 0, y: 10 }}
                  key={card.title}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-white">
                    <Icon className="h-4 w-4 text-cyan-100" />
                    {card.title}
                  </div>
                  <div className="space-y-2">
                    {card.items.map((item, itemIndex) => (
                      <p className="rounded-lg border border-white/10 bg-slate-950/30 px-3 py-2 text-xs leading-relaxed text-slate-200" key={`${card.title}-${itemIndex}`}>
                        {item}
                      </p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="rounded-lg border border-amber-200/20 bg-amber-200/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-100">
              <Quote className="h-4 w-4" />
              Momentum quote
            </div>
            <p className="text-sm font-semibold text-amber-50">{advice.quote}</p>
            <p className="mt-2 text-xs text-amber-100/80">{advice.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AssistantPanel({ floating = false }) {
  const [open, setOpen] = useState(false);

  if (!floating) {
    return (
      <section className="rounded-lg border border-white/10 bg-white/10 p-1 shadow-soft backdrop-blur-xl">
        <AssistantContent />
      </section>
    );
  }

  return (
    <>
      <motion.button
        aria-label="Open AI productivity assistant"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-200/40 bg-cyan-300 text-slate-950 shadow-2xl shadow-cyan-400/40 transition hover:bg-cyan-200 sm:bottom-7 sm:right-7"
        onClick={() => setOpen(true)}
        type="button"
        whileHover={{ y: -3, scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="absolute inset-0 rounded-lg bg-cyan-300/40 blur-xl" />
        <Bot className="relative h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-cyan-300/20 bg-slate-950/90 p-3 shadow-2xl shadow-cyan-950/60"
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200/70">Floating assistant</p>
                  <h2 className="text-xl font-black text-white">AI Productivity Assistant</h2>
                </div>
                <button
                  aria-label="Close AI productivity assistant"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-slate-200 transition hover:bg-white/15"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <AssistantContent compact />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
