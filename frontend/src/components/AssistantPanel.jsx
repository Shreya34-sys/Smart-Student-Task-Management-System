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
    <div className={compact ? "flex h-full flex-col" : "h-full"}>
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-cyan-300/20 dark:bg-slate-950/80 dark:shadow-2xl dark:shadow-cyan-950/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.1),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.2),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.15),transparent_50%)]" />
        
        <div className="relative border-b border-slate-100 p-4 dark:border-white/5">
          <div className="flex items-center gap-4">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30">
              <div className="absolute inset-0 rounded-xl bg-white/20 mix-blend-overlay" />
              <BrainCircuit className="relative h-6 w-6 text-white" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">AI Command Center</p>
              <h2 className="truncate text-lg font-black tracking-tight text-slate-900 dark:text-white">Smart Assistant</h2>
            </div>
            <Zap className="ml-auto h-5 w-5 text-amber-500" />
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-4">
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10 min-h-[14rem]">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  message.role === "user"
                    ? "rounded-tr-sm bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-cyan-500/25"
                    : "rounded-tl-sm border border-slate-200/60 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-3 rounded-2xl rounded-tl-sm border border-slate-200/60 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
                  Analyzing context...
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-2">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((item) => (
                <button
                  className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-500/50 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
                  disabled={loading}
                  key={item}
                  onClick={(event) => ask(event, item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>

            <form className="relative flex items-center" onSubmit={ask}>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 blur transition-opacity focus-within:opacity-40 dark:opacity-30" />
              <input
                className="relative w-full rounded-xl border border-slate-200/80 bg-white/90 py-3 pl-4 pr-12 text-sm text-slate-900 shadow-sm outline-none backdrop-blur-xl transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-950/80 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask AI to plan your day or prioritize tasks..."
              />
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-cyan-500 p-2 text-white shadow-md shadow-cyan-500/25 transition hover:scale-105 hover:bg-cyan-400 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50" 
                disabled={loading || !prompt.trim()} 
                type="submit"
                aria-label="Send message"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {advice && (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-cyan-800 dark:text-cyan-100">
              <MessageSquareText className="h-4 w-4" />
              Assistant summary
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{advice.summary}</p>
          </div>

          {advice.focusBlocks?.length ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {advice.focusBlocks.map((block, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-3 dark:border-cyan-300/15 dark:bg-cyan-300/10"
                  initial={{ opacity: 0, y: 10 }}
                  key={`${block.title}-${index}`}
                  transition={{ delay: index * 0.04 }}
                >
                  <p className="text-sm font-black text-slate-800 dark:text-white">{block.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{block.suggestion}</p>
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
                  className={`rounded-lg border border-slate-200 bg-white/60 dark:border-white/10 dark:bg-slate-900/50 bg-gradient-to-br ${card.tone} p-4 backdrop-blur-xl`}
                  initial={{ opacity: 0, y: 10 }}
                  key={card.title}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                    <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-100" />
                    {card.title}
                  </div>
                  <div className="space-y-2">
                    {card.items.map((item, itemIndex) => (
                      <p className="rounded-lg border border-slate-200/50 bg-white/40 px-3 py-2 text-xs leading-relaxed text-slate-700 dark:border-white/10 dark:bg-slate-950/30 dark:text-slate-200" key={`${card.title}-${itemIndex}`}>
                        {item}
                      </p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-50 dark:border-amber-200/20 dark:bg-amber-200/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-100">
              <Quote className="h-4 w-4" />
              Momentum quote
            </div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-50">{advice.quote}</p>
            <p className="mt-2 text-xs text-amber-700/80 dark:text-amber-100/80">{advice.tip}</p>
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
              className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-slate-200 bg-white/95 dark:border-cyan-300/20 dark:bg-slate-950/90 p-3 shadow-2xl shadow-slate-300/50 dark:shadow-cyan-950/60 backdrop-blur-xl"
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-200/70">Floating assistant</p>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">AI Productivity Assistant</h2>
                </div>
                <button
                  aria-label="Close AI productivity assistant"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
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
