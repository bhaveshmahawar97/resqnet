export const USER_ROLES = ["user", "ngo", "volunteer", "admin"];

export const RESCUE_STATUSES = [
  "pending",
  "accepted",
  "in_progress",
  "rescued",
  "completed",
  "cancelled",
];

export const DISPATCH_STATUSES = [
  "unassigned",
  "assigned",
  "accepted",
  "in_progress",
  "rescued",
  "completed",
  "cancelled",
];

export const SEVERITY_LEVELS = ["low", "medium", "high", "critical"];

export const DISPATCH_EVENT_TYPES = [
  "rescue_created",
  "status_change",
  "assignment_change",
  "mission_accepted",
  "mission_completed",
  "mission_cancelled",
  "priority_change",
  "note_added",
];

export const NOTIFICATION_TYPES = [
  "rescue_created",
  "rescue_assigned",
  "rescue_status",
  "mission_alert",
  "critical_alert",
  "system",
];

export const NOTIFICATION_PRIORITIES = ["low", "medium", "high", "critical"];

export const AI_SCAN_STATUSES = ["pending", "processing", "completed", "failed"];

export const ADOPTION_STATUSES = ["draft", "listed", "pending_review", "adopted", "withdrawn"];

export const ADOPTION_APPLICATION_STATUSES = ["pending", "approved", "rejected", "withdrawn"];

export const REPORT_STATUSES = ["draft", "generated", "archived"];

export const ANALYTICS_PERIODS = ["daily", "weekly", "monthly", "custom"];
