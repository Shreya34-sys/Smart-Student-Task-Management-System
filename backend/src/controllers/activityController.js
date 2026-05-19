import { Activity } from "../models/Activity.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getActivity = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ actor: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30)
    .populate("actor", "name email");

  res.json({ success: true, activities });
});
