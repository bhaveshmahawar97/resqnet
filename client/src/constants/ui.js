export const SEVERITY_COLOR = {
  critical: "#DC2626",
  high: "#EA580C",
  moderate: "#D97706",
  medium: "#D97706",
  low: "#16A34A",
  info: "#2563EB",
  success: "#16A34A",
  warning: "#D97706",
};

export function getSeverityStyle(level, T) {
  const key = level?.toLowerCase?.();
  const map = {
    critical: { color: T.danger,  bg: T.dangerPale,  border: T.dangerBorder },
    high:     { color: T.warning, bg: T.warningPale, border: `${T.warning}33` },
    moderate: { color: T.warning, bg: T.warningPale, border: `${T.warning}33` },
    medium:   { color: T.info,    bg: T.infoPale,    border: `${T.info}33` },
    low:      { color: T.success, bg: T.successPale, border: T.successBorder },
    info:     { color: T.info,    bg: T.infoPale,    border: `${T.info}33` },
    success:  { color: T.success, bg: T.successPale, border: T.successBorder },
    warning:  { color: T.warning, bg: T.warningPale, border: `${T.warning}33` },
  };
  return map[key] || { color: T.textSub, bg: T.bgAlt, border: T.border };
}

export const STATUS_LABEL = {
  in_progress: "In Progress",
  dispatched: "Dispatched",
  on_site: "On Site",
  resolved: "Resolved",
  pending: "Pending",
  active: "Active",
  available: "Available",
  busy: "On Mission",
  offline: "Offline",
  accepted: "Accepted",
  rescued: "Rescued",
  completed: "Completed",
  cancelled: "Cancelled",
};
