/**
 * Derive dashboard operational UI data from live rescue API records.
 */

export const timeAgo = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export const buildActivityFromRescues = (rescues = []) =>
  rescues
    .flatMap((rescue) => {
      const timeline = Array.isArray(rescue.rescueTimeline) ? rescue.rescueTimeline : [];
      return timeline.map((entry, idx) => ({
        id: `${rescue.id || rescue._id}-${idx}`,
        type: entry.status === "completed" ? "success" : entry.status === "cancelled" ? "error" : "info",
        title: `${rescue.animal || rescue.animalType} — ${String(entry.status).replace(/_/g, " ")}`,
        body: entry.note || rescue.location || rescue.address || "",
        time: timeAgo(entry.createdAt),
      }));
    })
    .sort((a, b) => (a.time > b.time ? -1 : 1))
    .slice(0, 20);

export const buildCriticalAlerts = (criticalRescues = []) =>
  criticalRescues.map((r) => ({
    id: r.id || r._id,
    type: "critical",
    title: `Critical: ${r.animal || r.animalType}`,
    body: `${r.location || r.address} — ${r.condition || r.description || ""}`.slice(0, 140),
    time: timeAgo(r.createdAt),
    acknowledged: r.status !== "pending",
  }));

export const buildNotificationsFromRescues = (rescues = []) =>
  rescues.slice(0, 8).map((r, i) => ({
    id: `n-${r.id || r._id || i}`,
    title: `${r.severity?.toUpperCase() || "UPDATE"}: ${r.animal || r.animalType}`,
    body: `Status: ${String(r.status).replace(/_/g, " ")} · ${r.location || r.address || ""}`,
    time: timeAgo(r.updatedAt || r.createdAt),
    read: r.status === "completed",
    type: r.severity === "critical" ? "critical" : "info",
  }));
