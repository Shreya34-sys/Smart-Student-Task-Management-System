import { Notification } from "../models/Notification.js";
import { notifyUser } from "./socketService.js";

export async function createNotification({ user, title, message, type = "system", metadata = {} }) {
  const notification = await Notification.create({ user, title, message, type, metadata });
  notifyUser(user.toString(), { title, message, type, metadata });
  return notification;
}
