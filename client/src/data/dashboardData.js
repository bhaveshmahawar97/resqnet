/**
 * ResQNet Dashboard Ecosystem — Mock Data
 * Covers all roles: User, NGO, Volunteer, Admin
 */

// ─── RESCUE CASES ─────────────────────────────────────────────────────────────
export const RESCUE_CASES = [
  {
    id: "RC-2841",
    animal: "Golden Retriever",
    species: "Dog",
    severity: "critical",
    status: "in_progress",
    location: "Andheri West, Mumbai",
    reportedBy: "Priya Sharma",
    assignedTo: "Mumbai Paws NGO",
    volunteer: "Arjun Mehta",
    reportedAt: "2025-05-16T08:12:00",
    updatedAt: "2025-05-16T09:45:00",
    aiScore: 87,
    notes: "Hit by vehicle. Bleeding from left hindleg. Conscious but distressed.",
    lat: 19.1364, lng: 72.8296,
    photo: null,
    eta: "12 min",
    priority: 1,
  },
  {
    id: "RC-2840",
    animal: "Street Cat",
    species: "Cat",
    severity: "high",
    status: "dispatched",
    location: "Koramangala, Bengaluru",
    reportedBy: "Rohan Das",
    assignedTo: "Street Animal Relief Trust",
    volunteer: "Kavitha Nair",
    reportedAt: "2025-05-16T07:55:00",
    updatedAt: "2025-05-16T08:30:00",
    aiScore: 71,
    notes: "Open wound on neck. Possible dog bite. Hiding under parked car.",
    lat: 12.9279, lng: 77.6271,
    photo: null,
    eta: "8 min",
    priority: 2,
  },
  {
    id: "RC-2839",
    animal: "Indian Pariah",
    species: "Dog",
    severity: "moderate",
    status: "on_site",
    location: "Banjara Hills, Hyderabad",
    reportedBy: "Divya Rao",
    assignedTo: "Haven for Stray Lives",
    volunteer: "Srinivas Kumar",
    reportedAt: "2025-05-16T06:20:00",
    updatedAt: "2025-05-16T08:10:00",
    aiScore: 52,
    notes: "Limping on front right paw. Appears malnourished. Friendly.",
    lat: 17.4156, lng: 78.4347,
    photo: null,
    eta: "On site",
    priority: 3,
  },
  {
    id: "RC-2838",
    animal: "Pigeon",
    species: "Bird",
    severity: "moderate",
    status: "resolved",
    location: "Connaught Place, Delhi",
    reportedBy: "Amit Khanna",
    assignedTo: "Urban Wildlife Aid",
    volunteer: "Pooja Singh",
    reportedAt: "2025-05-15T15:00:00",
    updatedAt: "2025-05-15T17:30:00",
    aiScore: 44,
    notes: "Wing injury. Safely transported to rehab centre.",
    lat: 28.6315, lng: 77.2167,
    photo: null,
    eta: "Resolved",
    priority: 4,
  },
  {
    id: "RC-2837",
    animal: "Indie Dog (Puppy)",
    species: "Dog",
    severity: "high",
    status: "resolved",
    location: "Indiranagar, Bengaluru",
    reportedBy: "Sneha Pillai",
    assignedTo: "Street Animal Relief Trust",
    volunteer: "Arjun Mehta",
    reportedAt: "2025-05-15T11:00:00",
    updatedAt: "2025-05-15T14:20:00",
    aiScore: 65,
    notes: "Severely malnourished puppy, approx 6 weeks old. Now in foster care.",
    lat: 12.9784, lng: 77.6408,
    photo: null,
    eta: "Resolved",
    priority: 2,
  },
];

// ─── NGO DATA ─────────────────────────────────────────────────────────────────
export const NGO_LIST = [
  {
    id: "NGO-001",
    name: "Paws of Hope Foundation",
    city: "Mumbai",
    state: "Maharashtra",
    rating: 4.9,
    verified: true,
    activeRescues: 14,
    volunteers: 38,
    animals: 127,
    specialties: ["Medical", "Rescue", "Rehabilitation"],
    phone: "+91 98200 11230",
    email: "contact@pawsofhope.org",
    joinedAt: "2023-02-15",
    status: "active",
    pendingApproval: false,
  },
  {
    id: "NGO-002",
    name: "Urban Canine Coalition",
    city: "Delhi NCR",
    state: "Delhi",
    rating: 4.9,
    verified: true,
    activeRescues: 11,
    volunteers: 29,
    animals: 94,
    specialties: ["Rescue", "Shelter"],
    phone: "+91 11000 88450",
    email: "ops@urbancanine.in",
    joinedAt: "2023-06-01",
    status: "active",
    pendingApproval: false,
  },
  {
    id: "NGO-003",
    name: "Haven for Stray Lives",
    city: "Hyderabad",
    state: "Telangana",
    rating: 4.9,
    verified: true,
    activeRescues: 9,
    volunteers: 22,
    animals: 76,
    specialties: ["Shelter", "Adoption"],
    phone: "+91 40000 77830",
    email: "havenforstrays@gmail.com",
    joinedAt: "2023-09-11",
    status: "active",
    pendingApproval: false,
  },
  {
    id: "NGO-004",
    name: "Green Paw Initiative",
    city: "Pune",
    state: "Maharashtra",
    rating: 4.6,
    verified: false,
    activeRescues: 3,
    volunteers: 8,
    animals: 21,
    specialties: ["Rescue"],
    phone: "+91 20000 55610",
    email: "greenpaw@rescue.org",
    joinedAt: "2025-05-10",
    status: "pending",
    pendingApproval: true,
  },
  {
    id: "NGO-005",
    name: "Feather & Fur Rescue",
    city: "Chennai",
    state: "Tamil Nadu",
    rating: 4.7,
    verified: false,
    activeRescues: 5,
    volunteers: 12,
    animals: 38,
    specialties: ["Wildlife", "Medical"],
    phone: "+91 44000 33210",
    email: "info@featherfur.org",
    joinedAt: "2025-05-14",
    status: "pending",
    pendingApproval: true,
  },
];

// ─── EMERGENCY ALERTS ─────────────────────────────────────────────────────────
export const EMERGENCY_ALERTS = [
  {
    id: "EA-101",
    type: "critical",
    title: "Critical case unassigned — RC-2841",
    body: "High severity dog rescue in Andheri West. No vet confirmed yet.",
    time: "9 min ago",
    rescueId: "RC-2841",
    acknowledged: false,
  },
  {
    id: "EA-102",
    type: "high",
    title: "2 NGOs pending verification — action required",
    body: "Green Paw Initiative and Feather & Fur Rescue awaiting admin approval.",
    time: "1 hr ago",
    rescueId: null,
    acknowledged: false,
  },
  {
    id: "EA-103",
    type: "warning",
    title: "Scanner load spike detected",
    body: "AI Scanner processed 47 scans today vs 24h avg of 28. All systems nominal.",
    time: "2 hr ago",
    rescueId: null,
    acknowledged: true,
  },
];

// ─── SEVERITY HELPERS ─────────────────────────────────────────────────────────
export const SEVERITY_COLOR = {
  critical: "#DC2626",
  high: "#EA580C",
  moderate: "#D97706",
  low: "#16A34A",
  info: "#2563EB",
  success: "#16A34A",
  warning: "#D97706",
};

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
};

export function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── ADMIN PLATFORM DATA ──────────────────────────────────────────────────────
export const ADMIN_PROFILE = {
  id: "ADM-001",
  name: "Karan Malhotra",
  email: "karan@resqnet.in",
  role: "admin",
};

export const ADMIN_USERS = [
  { id: "USR-1042", name: "Priya Sharma", email: "priya@gmail.com", city: "Mumbai", role: "user", joined: "2024-03-22", status: "active", rescues: 6, scans: 14 },
  { id: "USR-1038", name: "Rohan Das", email: "rohan.das@gmail.com", city: "Bengaluru", role: "user", joined: "2024-01-10", status: "active", rescues: 3, scans: 8 },
  { id: "USR-1031", name: "Amit Khanna", email: "amit.k@outlook.com", city: "Delhi", role: "user", joined: "2023-11-05", status: "active", rescues: 9, scans: 21 },
  { id: "USR-1025", name: "Sneha Pillai", email: "sneha.p@gmail.com", city: "Bengaluru", role: "user", joined: "2023-09-18", status: "suspended", rescues: 2, scans: 5 },
  { id: "USR-1019", name: "Divya Rao", email: "divya.rao@gmail.com", city: "Hyderabad", role: "user", joined: "2023-07-22", status: "active", rescues: 11, scans: 29 },
  { id: "ADM-001", name: "Karan Malhotra", email: "karan@resqnet.in", city: "Mumbai", role: "admin", joined: "2023-01-01", status: "active", rescues: 0, scans: 0 },
];

export const SYSTEM_HEALTH = [
  { label: "AI Scanner", status: "operational", uptime: "99.97%", latency: "142ms" },
  { label: "Rescue Network", status: "operational", uptime: "99.91%", latency: "88ms" },
  { label: "NGO API Gateway", status: "operational", uptime: "99.88%", latency: "204ms" },
  { label: "Notification Bus", status: "degraded", uptime: "97.40%", latency: "410ms" },
  { label: "Map Service", status: "operational", uptime: "99.99%", latency: "61ms" },
  { label: "Report Engine", status: "operational", uptime: "99.80%", latency: "318ms" },
];

export const ADMIN_QUICK_ACTIONS = [
  { id: "add_admin", label: "Add Admin", color: "#2563EB" },
  { id: "verify_ngo", label: "Verify NGO", color: "#16A34A" },
  { id: "broadcast", label: "Broadcast Alert", color: "#DC2626" },
  { id: "report", label: "Generate Report", color: "#7C3AED" },
  { id: "emergency", label: "Emergency Override", color: "#EA580C" },
  { id: "clear_queue", label: "Clear Queue", color: "#6B7280" },
];

export const ADMIN_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "rescues", label: "Rescue Operations" },
  { id: "ai", label: "AI Monitoring" },
  { id: "analytics", label: "Analytics" },
  { id: "alerts", label: "System Alerts" },
  { id: "settings", label: "Settings" },
];
