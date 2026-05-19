import { Team } from "../models/Team.js";
import { User } from "../models/User.js";
import { logActivity } from "../services/activityService.js";
import { notifyUser } from "../services/socketService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({
    $or: [{ owner: req.user._id }, { "members.user": req.user._id }]
  }).populate("members.user", "name email role");

  res.json({ success: true, teams });
});

export const createTeam = asyncHandler(async (req, res) => {
  const team = await Team.create({
    name: req.body.name,
    description: req.body.description,
    owner: req.user._id,
    members: [{ user: req.user._id, role: "lead" }]
  });
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { teams: team._id } });
  await logActivity({ actor: req.user._id, action: "created_team", entityType: "team", entityId: team._id });
  res.status(201).json({ success: true, team });
});

export const inviteMember = asyncHandler(async (req, res) => {
  const team = await Team.findOne({ _id: req.params.id, owner: req.user._id });
  if (!team) throw new AppError("Team not found or permission denied", 404);

  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new AppError("User with that email was not found", 404);

  team.members.addToSet({ user: user._id, role: "member" });
  await team.save();
  await User.findByIdAndUpdate(user._id, { $addToSet: { teams: team._id } });
  notifyUser(user._id.toString(), { title: "Team invite", message: `You were added to ${team.name}` });
  await logActivity({ actor: req.user._id, action: "invited_team_member", entityType: "team", entityId: team._id, metadata: { email: user.email } });

  res.json({ success: true, team });
});
