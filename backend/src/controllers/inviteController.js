import { Invite } from "../models/Invite.js";
import { Team } from "../models/Team.js";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { sendInviteEmail } from "../services/emailService.js";
import { logActivity } from "../services/activityService.js";
import { notifyUser } from "../services/socketService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function isExpired(invite) {
  return invite.expiresAt.getTime() <= Date.now();
}

export const sendInvite = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const projectId = req.body.projectId || req.body.teamId;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("Please enter a valid teammate email", 400);
  }

  const team = await Team.findOne({ _id: projectId, owner: req.user._id });
  if (!team) throw new AppError("Team not found or permission denied", 404);

  const existingUser = await User.findOne({ email });
  if (existingUser && team.members.some((member) => member.user?.toString() === existingUser._id.toString())) {
    throw new AppError("This user is already a team member", 409);
  }

  const existingInvite = await Invite.findOne({ email, projectId: team._id, status: "pending" });
  if (existingInvite && !isExpired(existingInvite)) {
    throw new AppError("An active invite already exists for this email", 409);
  }

  if (existingInvite && isExpired(existingInvite)) {
    existingInvite.status = "expired";
    await existingInvite.save();
  }

  const invite = await Invite.create({
    email,
    projectId: team._id,
    invitedBy: req.user._id
  });

  const acceptUrl = `${env.clientUrl.split(",")[0]}/invite/${invite.token}`;
  await logActivity({ actor: req.user._id, action: "sent_team_invite", entityType: "team", entityId: team._id, metadata: { email } });

  let emailResult;
  try {
    emailResult = await sendInviteEmail({
      to: email,
      senderName: req.user.name,
      teamName: team.name,
      acceptUrl
    });
  } catch (error) {
    console.error(`Invite email failed for ${email}:`, error);
    return res.status(202).json({
      success: true,
      message: "Invite created, but email could not be sent. Share the invite link manually.",
      emailSent: false,
      emailError: error.message,
      acceptUrl,
      invite: { id: invite._id, email: invite.email, status: invite.status, expiresAt: invite.expiresAt }
    });
  }

  if (emailResult?.skipped) {
    return res.status(202).json({
      success: true,
      message: "Invite created, but SMTP email is not configured. Share the invite link manually.",
      emailSent: false,
      acceptUrl,
      invite: { id: invite._id, email: invite.email, status: invite.status, expiresAt: invite.expiresAt }
    });
  }

  res.status(201).json({
    success: true,
    message: "Invite email sent",
    emailSent: true,
    invite: { id: invite._id, email: invite.email, status: invite.status, expiresAt: invite.expiresAt }
  });
});

export const getInvite = asyncHandler(async (req, res) => {
  const invite = await Invite.findOne({ token: req.params.token })
    .populate("projectId", "name description")
    .populate("invitedBy", "name email");

  if (!invite) throw new AppError("Invite not found", 404);
  if (invite.status === "pending" && isExpired(invite)) {
    invite.status = "expired";
    await invite.save();
  }

  res.json({
    success: true,
    invite: {
      email: invite.email,
      project: invite.projectId,
      invitedBy: invite.invitedBy,
      status: invite.status,
      expiresAt: invite.expiresAt
    }
  });
});

export const acceptInvite = asyncHandler(async (req, res) => {
  const token = req.body.token || req.params.token;
  const invite = await Invite.findOne({ token }).populate("projectId");

  if (!invite) throw new AppError("Invite not found", 404);
  if (invite.status !== "pending") throw new AppError(`Invite is ${invite.status}`, 400);
  if (isExpired(invite)) {
    invite.status = "expired";
    await invite.save();
    throw new AppError("Invite has expired", 400);
  }
  if (invite.email !== req.user.email) {
    throw new AppError("This invite was sent to a different email address", 403);
  }

  const team = invite.projectId;
  team.members.addToSet({ user: req.user._id, role: "member" });
  await team.save();
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { teams: team._id } });

  invite.status = "accepted";
  await invite.save();

  notifyUser(team.owner.toString(), { title: "Invite accepted", message: `${req.user.name} joined ${team.name}` });
  await logActivity({ actor: req.user._id, action: "accepted_team_invite", entityType: "team", entityId: team._id });

  res.json({ success: true, message: "Invite accepted", team });
});

export const getTeamInvites = asyncHandler(async (req, res) => {
  const team = await Team.findOne({
    _id: req.params.teamId,
    $or: [{ owner: req.user._id }, { "members.user": req.user._id }]
  });

  if (!team) throw new AppError("Team not found or permission denied", 404);

  const invites = await Invite.find({ projectId: team._id })
    .populate("invitedBy", "name email")
    .sort({ createdAt: -1 })
    .lean();

  // Auto-expire pending invites that are past their expiresAt date
  const now = Date.now();
  const result = invites.map((invite) => {
    if (invite.status === "pending" && new Date(invite.expiresAt).getTime() <= now) {
      return { ...invite, status: "expired" };
    }
    return invite;
  });

  res.json({ success: true, invites: result });
});
