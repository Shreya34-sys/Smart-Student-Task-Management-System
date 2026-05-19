import { getDailyQuote } from "../services/quoteService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getQuote = asyncHandler(async (_req, res) => {
  const quote = await getDailyQuote();
  res.json({ success: true, quote });
});
