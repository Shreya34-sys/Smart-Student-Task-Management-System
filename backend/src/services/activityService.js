import { Activity } from "../models/Activity.js";

export async function logActivity({ actor, action, entityType = "system", entityId, metadata = {} }) {
  if (!actor) return null;
  return Activity.create({ actor, action, entityType, entityId, metadata });
}
