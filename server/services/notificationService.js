import { Notification, User } from "../models/index.js";
import { emitToUser, emitToRoom } from "../socket/socketServer.js";
import { sendRescueAlertEmail } from "./emailService.js";

/**
 * Creates an in-app notification (websocket delivery prepared for later).
 */
export const createNotification = async ({
  recipientId,
  type,
  title,
  message,
  priority = "medium",
  relatedEntity = null,
  relatedEntityType = "RescueRequest",
  data = {},
}) => {
  if (!recipientId) return null;

  const notification = await Notification.create({
    recipient: recipientId,
    type,
    title,
    message,
    priority,
    relatedEntity,
    relatedEntityType,
    data,
  });

  // Emit real-time notification
  emitToUser(recipientId, "new_notification", notification);

  return notification;
};

/**
 * Notify operational roles about a new rescue (respects preferences).
 */
export const notifyNewRescue = async (rescue, creator) => {
  const operationalUsers = await User.find({
    role: { $in: ["ngo", "volunteer", "admin"] },
    isActive: true,
    "notificationPreferences.rescueAlerts": { $ne: false },
  })
    .select("_id role notificationPreferences")
    .lean();

  const priority =
    rescue.severity === "critical" ? "critical" : rescue.severity === "high" ? "high" : "medium";

  const notifications = operationalUsers
    .filter((u) => u._id.toString() !== creator._id?.toString())
    .map((user) => ({
      recipient: user._id,
      type: rescue.severity === "critical" ? "critical_alert" : "rescue_created",
      title: `New ${rescue.severity} rescue: ${rescue.animalType}`,
      message: `${rescue.address} — ${rescue.condition?.slice(0, 120) || "Emergency reported"}`,
      priority,
      relatedEntity: rescue._id,
      relatedEntityType: "RescueRequest",
      data: { severity: rescue.severity, animalType: rescue.animalType },
    }));

  if (notifications.length === 0) return [];

  const createdNotifications = await Notification.insertMany(notifications, { ordered: false });

  // Broadcast to dashboards
  emitToRoom("ngo_network", "new_rescue_broadcast", rescue);
  emitToRoom("role:volunteer", "new_rescue_broadcast", rescue);

  // Send individualized notifications and emails
  createdNotifications.forEach(notif => {
    emitToUser(notif.recipient, "new_notification", notif);
    
    // Only email if it's a critical alert to prevent spam
    if (notif.priority === "critical") {
      const recipientUser = operationalUsers.find(u => u._id.toString() === notif.recipient.toString());
      if (recipientUser) {
        sendRescueAlertEmail(recipientUser, rescue).catch(err => console.error("Rescue alert email failed:", err));
      }
    }
  });

  return createdNotifications;
};

export const notifyStatusChange = async (rescue, actor, newStatus) => {
  const recipientIds = [
    rescue.createdBy?.toString?.() || rescue.createdBy,
    rescue.assignedNgo?.toString?.() || rescue.assignedNgo,
    rescue.assignedVolunteer?.toString?.() || rescue.assignedVolunteer,
  ].filter(Boolean);

  const uniqueRecipients = [...new Set(recipientIds)].filter(
    (id) => id !== actor._id?.toString()
  );

  const docs = uniqueRecipients.map((recipientId) => ({
    recipient: recipientId,
    type: "rescue_status",
    title: `Rescue status: ${newStatus}`,
    message: `${rescue.animalType} at ${rescue.address} is now ${newStatus.replace("_", " ")}`,
    priority: "medium",
    relatedEntity: rescue._id,
    relatedEntityType: "RescueRequest",
    data: { status: newStatus },
  }));

  if (docs.length === 0) return [];
  const createdNotifications = await Notification.insertMany(docs, { ordered: false });

  createdNotifications.forEach(notif => {
    emitToUser(notif.recipient, "new_notification", notif);
  });

  // Also broadcast the status change for dashboard live-updates
  emitToRoom("ngo_network", "rescue_updated", rescue);
  emitToRoom("role:volunteer", "rescue_updated", rescue);

  return createdNotifications;
};

export const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
  const skip = (page - 1) * limit;
  const query = { recipient: userId };
  if (unreadOnly) query.read = false;

  const [items, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("relatedEntity")
      .lean(),
    Notification.countDocuments(query),
  ]);

  return { items, total, page, limit };
};

export const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true, readAt: new Date() },
    { new: true }
  ).lean();
};

export const markAllAsRead = async (userId) => {
  return Notification.updateMany(
    { recipient: userId, read: false },
    { read: true, readAt: new Date() }
  );
};

export default {
  createNotification,
  notifyNewRescue,
  notifyStatusChange,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
