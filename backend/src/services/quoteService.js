import axios from "axios";
import { env } from "../config/env.js";
import { getCache, setCache } from "./cacheService.js";

export async function getDailyQuote() {
  const cacheKey = "external:daily-quote";
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(env.quoteApiUrl, { timeout: 5000 });
    const quote = {
      text: data.content || data.quote || "Small steps every day become visible progress.",
      author: data.author || "Cognifyz"
    };
    await setCache(cacheKey, quote, 60 * 60);
    return quote;
  } catch {
    return {
      text: "Stay focused. Finish one meaningful task at a time.",
      author: "Smart Tasks"
    };
  }
}
