import { getUserNotifications, markAsRead, markAllAsRead } from "../services/notificationService.js";
import { Notification } from "../models/index.js";

/**
 * Get notifications for the authenticated user
 */
export const getMyNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const unreadOnly = req.query.unread === "true";

    const result = await getUserNotifications(req.user.id, { page, limit, unreadOnly });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user.id, read: false });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error counting notifications" });
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id, req.user.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error marking notification as read" });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async (req, res) => {
  try {
    await markAllAsRead(req.user.id);
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error marking notifications as read" });
  }
};

export default {
  getMyNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
};
