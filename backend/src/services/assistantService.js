import axios from "axios";
import { env } from "../config/env.js";

function normalizeAdvice(advice, tasks, prompt) {
  const fallback = heuristicPlan(tasks, prompt);
  return {
    reply: advice?.reply || advice?.summary || fallback.reply,
    summary: advice?.summary || fallback.summary,
    focusBlocks: normalizeList(advice?.focusBlocks, fallback.focusBlocks),
    productivityTips: normalizeList(advice?.productivityTips, fallback.productivityTips),
    recommendations: normalizeList(advice?.recommendations, fallback.recommendations),
    prioritySuggestions: normalizeList(advice?.prioritySuggestions, fallback.prioritySuggestions),
    dailySuggestions: normalizeList(advice?.dailySuggestions, fallback.dailySuggestions),
    quote: advice?.quote || fallback.quote,
    tip: advice?.tip || fallback.tip
  };
}

function normalizeList(value, fallback) {
  return Array.isArray(value) && value.length ? value.slice(0, 5) : fallback;
}

function formatDate(date) {
  if (!date) return "No deadline";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function heuristicPlan(tasks, prompt = "") {
  const openTasks = tasks
    .filter((task) => task.status !== "completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const urgentTasks = openTasks.filter((task) => new Date(task.dueDate) <= today || task.priority === "high");
  const firstTasks = (urgentTasks.length ? urgentTasks : openTasks).slice(0, 3);
  const urgent = firstTasks.map((task) => task.title).join(", ");

  if (!openTasks.length) {
    return {
      reply: prompt
        ? `I can help you turn "${prompt}" into a focused plan. Add tasks with due dates for sharper recommendations.`
        : "Add a few tasks with priorities and due dates, then I can build a precise daily plan.",
      summary: prompt
        ? `I do not see open tasks yet, so here is a simple plan for: "${prompt}".`
        : "I do not see open tasks yet. Add a few tasks and I can build a sharper study plan.",
      focusBlocks: [
        {
          title: "Brain dump",
          suggestion: "Write every assignment, exam, and reminder you can think of for five minutes."
        },
        {
          title: "Pick the top three",
          suggestion: "Choose the three tasks with the nearest deadline or highest impact."
        },
        {
          title: "Start one focus block",
          suggestion: "Work on the most urgent item for 35-45 minutes, then update its status."
        }
      ],
      productivityTips: [
        "Capture every task first, then prioritize instead of planning from memory.",
        "Use one 45 minute deep-work block before checking messages.",
        "End each work session by choosing the next visible action."
      ],
      recommendations: [
        "Create tasks for assignments, meetings, revision, and admin work.",
        "Add due dates and priorities so recommendations can adapt to urgency."
      ],
      prioritySuggestions: [
        "Mark deadline-driven tasks as high priority.",
        "Keep low priority for tasks that can safely move to tomorrow."
      ],
      dailySuggestions: [
        "Start with a five minute task capture.",
        "Pick three outcomes for the day.",
        "Reserve one recovery block for review or cleanup."
      ],
      quote: "Small progress, repeated daily, becomes momentum.",
      tip: "The assistant becomes more specific after you create tasks with due dates and priorities."
    };
  }

  return {
    reply: prompt
      ? `Here is a focused response for "${prompt}". Start with ${urgent}.`
      : `Your best next move is ${firstTasks[0].title}. Then work through ${firstTasks.slice(1).map((task) => task.title).join(", ") || "one lighter follow-up task"}.`,
    summary: `You have ${openTasks.length} open task${openTasks.length === 1 ? "" : "s"}. Start with ${urgent}.`,
    focusBlocks: openTasks.slice(0, 3).map((task, index) => ({
      title: task.title,
      suggestion: index === 0
        ? `Work on this first in a 45 minute focus block. Priority: ${task.priority}.`
        : `Schedule this after your highest priority item. Due: ${formatDate(task.dueDate)}.`
    })),
    productivityTips: [
      "Batch similar tasks together so context switching does not drain your focus.",
      "Use the first 10 minutes to remove blockers before starting deep work.",
      "Update task status immediately after each block to keep the dashboard honest."
    ],
    recommendations: firstTasks.map((task) => `${task.title}: ${task.priority === "high" ? "protect a deep-work slot" : "schedule a contained work block"} before ${formatDate(task.dueDate)}.`),
    prioritySuggestions: firstTasks.map((task) => `${task.title} should be ${new Date(task.dueDate) <= today ? "high" : task.priority} priority because it is ${new Date(task.dueDate) <= today ? "due soon" : `currently marked ${task.priority}`}.`),
    dailySuggestions: [
      `Start with ${firstTasks[0].title}.`,
      "Take a short break after the first completed focus block.",
      openTasks.length > 3 ? "Move one nonessential task out of today to protect quality." : "Close the day by reviewing what is left."
    ],
    quote: "Focus is built by choosing what gets your best energy first.",
    tip: "Keep today's plan to three meaningful outcomes and mark status changes as soon as you finish a block."
  };
}

export async function getProductivityAdvice(tasks, prompt = "") {
  if (!env.openAiApiKey) return heuristicPlan(tasks, prompt);

  try {
    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a concise AI productivity assistant for a full-stack task manager. Return JSON only with keys: reply, summary, focusBlocks, productivityTips, recommendations, prioritySuggestions, dailySuggestions, quote, tip. Keep every item practical and short."
          },
          {
            role: "user",
            content: JSON.stringify({
              prompt,
              tasks: tasks.map((task) => ({
                title: task.title,
                description: task.description,
                subject: task.subject,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate
              }))
            })
          }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: { Authorization: `Bearer ${env.openAiApiKey}` },
        timeout: 10000
      }
    );

    return normalizeAdvice(JSON.parse(data.choices[0].message.content), tasks, prompt);
  } catch {
    return heuristicPlan(tasks, prompt);
  }
}
