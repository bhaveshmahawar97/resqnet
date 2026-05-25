import { getUserNotifications, markAsRead, markAllAsRead } from "../services/notificationService.js";
import { Notification } from "../models/index.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const unreadOnly = req.query.unread === "true";

  const result = await getUserNotifications(req.user.id, { page, limit, unreadOnly });
  return sendSuccess(res, { data: result });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ recipient: req.user.id, read: false });
  return sendSuccess(res, { data: { count } });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await markAsRead(req.params.id, req.user.id);
  if (!notification) {
    return sendError(res, { status: 404, message: "Notification not found" });
  }
  return sendSuccess(res, { data: notification });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await markAllAsRead(req.user.id);
  return sendSuccess(res, { message: "All notifications marked as read" });
});

export default {
  getMyNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
};
