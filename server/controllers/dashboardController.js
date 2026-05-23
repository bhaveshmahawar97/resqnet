import { RescueRequest, NGO, User, Adoption } from "../models/index.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import mongoose from "mongoose";

// Helper to normalize rescue
const normalizeRescue = (rescue) => {
  if (!rescue) return null;
  return {
    ...rescue,
    id: rescue._id?.toString(),
    animal: rescue.animalType || rescue.animal || rescue.condition || "Unknown",
    location: rescue.address || rescue.location || "Unknown location",
    aiScore: typeof rescue.aiScore === "number" ? rescue.aiScore : 0,
    notes: rescue.description ?? rescue.notes ?? "",
    assignedTo: rescue.assignedNgo?.fullName || rescue.assignedVolunteer?.fullName || "",
    volunteer: rescue.assignedVolunteer?.fullName || rescue.assignedVolunteer?.email || "",
    rescueTimeline: Array.isArray(rescue.rescueTimeline) ? rescue.rescueTimeline : [],
    assignedNgo: rescue.assignedNgo || null,
    assignedVolunteer: rescue.assignedVolunteer || null,
  };
};

export const getDashboardData = async (req, res) => {
  try {
    const role = req.user?.role || "user";
    const userId = req.user._id;

    let responseData = {
      sections: [],
      quickActions: [],
      widgets: {},
      stats: [] // Global header stats
    };

    // ---------------------------------------------------------
    // USER ROLE
    // ---------------------------------------------------------
    if (role === "user") {
      const myRescuesRaw = await RescueRequest.find({ reporter: userId }).sort({ createdAt: -1 }).lean();
      const myRescues = myRescuesRaw.map(normalizeRescue);
      const activeRescues = myRescues.filter(r => !["completed", "cancelled"].includes(r.status));
      const myAdoptions = await Adoption.find({ applicant: userId }).sort({ createdAt: -1 }).populate("adoption").lean();

      const statsMap = {
        totalRescues: myRescues.length,
        pending: myRescues.filter(r => r.status === "pending").length,
        activeOperations: activeRescues.length,
        completed: myRescues.filter(r => r.status === "completed").length,
        cancelled: myRescues.filter(r => r.status === "cancelled").length,
      };

      responseData.sections = [
        { id: "overview", label: "Overview" },
        { id: "rescues", label: "Rescues" },
        { id: "adoptions", label: "Adoptions" },
        { id: "activity", label: "Activity" },
      ];

      responseData.stats = [
        { id: "rescue_reports", label: "Rescue Reports", value: statsMap.totalRescues, icon: "🚑", sub: `${statsMap.pending} pending`, trend: "up", highlight: true },
        { id: "active_operations", label: "Active Operations", value: statsMap.activeOperations, icon: "🌀", sub: "Live response" },
        { id: "completed", label: "Completed", value: statsMap.completed, icon: "✅", sub: "Finished missions" },
        { id: "cancelled", label: "Cancelled", value: statsMap.cancelled, icon: "🚫", sub: "Cancelled reports" },
      ];

      responseData.quickActions = [
        { id: "report_rescue", icon: "🚑", label: "Report Rescue", sub: "New emergency report", primary: true, path: "/rescue" },
        { id: "scanner", icon: "📸", label: "AI Scanner", sub: "Analyze animal", path: "/scanner" },
        { id: "find_ngo", icon: "🗺️", label: "Find NGO", sub: "Nearby organizations", path: "/ngos" },
        { id: "adopt", icon: "🏠", label: "Adopt", sub: "Browse animals", path: "/adoption" },
      ];

      responseData.widgets = {
        overview: [
          { id: "quick_actions", type: "QuickActions", data: responseData.quickActions },
          ...(myRescues.length > 0 ? [
            { id: "latest_rescue", type: "RescueCard", data: myRescues[0], title: "Latest Rescue" },
            { id: "rescue_timeline", type: "Timeline", data: myRescues[0].rescueTimeline, title: "Rescue Timeline" }
          ] : []),
          { id: "recent_scans", type: "EmptyState", icon: "📸", title: "Recent AI Scans", message: "Run an AI scan from the Scanner page." },
          { id: "activity", type: "EmptyState", icon: "📋", title: "Activity Feed", message: "No recent activities found." }
        ],
        rescues: [
          { id: "my_rescues", type: "RescueList", data: myRescues, emptyIcon: "🚑", emptyTitle: "No Rescues Yet", emptyMessage: "You haven't reported any rescues." }
        ],
        adoptions: [
          { id: "my_adoptions", type: "AdoptionList", data: myAdoptions, emptyIcon: "🐾", emptyTitle: "No Applications", emptyMessage: "You haven't applied for any adoptions yet." }
        ],
        activity: [
          { id: "full_activity", type: "EmptyState", icon: "📋", title: "No Activity", message: "No recent activities found in your log." }
        ]
      };
    }

    // ---------------------------------------------------------
    // VOLUNTEER ROLE
    // ---------------------------------------------------------
    else if (role === "volunteer") {
      const assignedRescuesRaw = await RescueRequest.find({ assignedVolunteer: userId }).populate("assignedNgo").sort({ createdAt: -1 }).lean();
      const myRescuesRaw = await RescueRequest.find({ reporter: userId }).populate("assignedNgo").sort({ createdAt: -1 }).lean();
      
      const missionList = normalizeRescueList([...assignedRescuesRaw, ...myRescuesRaw]).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      
      const missions = missionList.filter(r => !["completed", "cancelled", "volunteer_assigned", "pending"].includes(r.status));
      const pendingAssignments = missionList.filter(r => r.status === "volunteer_assigned" || (r.status === "pending" && !r.assignedVolunteer));
      const completedCount = missionList.filter(r => r.status === "completed").length;

      responseData.sections = [
        { id: "overview", label: "Overview" },
        { id: "missions", label: "Missions" },
        { id: "tasks", label: "Pending Assignments" },
        { id: "history", label: "History" },
      ];

      responseData.stats = [
        { id: "active_missions", label: "Active Missions", value: missions.length, icon: "🗺️", highlight: true, sub: "Assigned missions" },
        { id: "completed", label: "Completed", value: completedCount, icon: "✓", sub: "Finished missions", trend: "up" },
        { id: "ready", label: "Ready to Accept", value: pendingAssignments.length, icon: "🚑", sub: "Assigned to you" },
        { id: "in_progress", label: "In Progress", value: missionList.filter(r => r.status === "in_progress").length, icon: "⏳", sub: "Field response" },
      ];

      responseData.quickActions = [
        { id: "emergency", icon: "🚨", label: "Emergency Alert", sub: "Report critical case", primary: true, danger: true, path: "/rescue" },
        { id: "scan", icon: "📸", label: "AI Scan", sub: "Analyze on-site", path: "/scanner" },
        { id: "report", icon: "📋", label: "Field Report", sub: "Submit update", actionType: "modal", payload: "report" },
        { id: "find_ngo", icon: "🗺", label: "Find NGO", sub: "Nearby support", path: "/ngos" },
      ];

      responseData.widgets = {
        overview: [
          { id: "quick_actions", type: "QuickActions", data: responseData.quickActions },
          ...(missions.length > 0 ? [
            { id: "mission_map", type: "RescueMap", data: missions.slice(0, 3) },
            { id: "active_mission_card", type: "MissionCard", data: missions[0] },
            { id: "mission_timeline", type: "Timeline", data: missions[0].rescueTimeline, title: "Mission Timeline" }
          ] : []),
          { id: "pending_tasks", type: "AvailableMissionList", data: pendingAssignments.slice(0, 2), title: "Assigned Cases Awaiting Acceptance" },
          { id: "activity", type: "EmptyState", icon: "📋", title: "Activity", message: "No Mission Activity Yet" }
        ],
        missions: [
          { id: "active_missions", type: "MissionCardList", data: missions, emptyIcon: "🗺️", emptyTitle: "No Active Missions", emptyMessage: "You don't have any active missions right now." }
        ],
        tasks: [
          { id: "pending_assignments", type: "AvailableMissionList", data: pendingAssignments, emptyIcon: "📋", emptyTitle: "All clear!", emptyMessage: "No pending tasks assigned." }
        ],
        history: [
          { id: "completed_missions", type: "RescueList", data: missionList.filter(r => r.status === "completed"), emptyIcon: "✅", emptyTitle: "No History Yet", emptyMessage: "Your completed missions will appear here." }
        ]
      };
    }

    // ---------------------------------------------------------
    // NGO ROLE
    // ---------------------------------------------------------
    else if (role === "ngo") {
      const ngoRaw = await NGO.findOne({ email: req.user.email }).lean();
      if (!ngoRaw) {
        return sendError(res, { status: 404, message: "NGO profile not found." });
      }

      if (ngoRaw.verificationStatus !== "approved") {
        return sendSuccess(res, { data: { requiresVerification: true, profile: ngoRaw } });
      }

      const rescuesRaw = await RescueRequest.find({
        $or: [{ assignedNgo: ngoRaw._id }, { "location.city": ngoRaw.city }]
      }).populate("assignedVolunteer assignedNgo").sort({ createdAt: -1 }).lean();
      
      const rescues = normalizeRescueList(rescuesRaw);
      const activeRescues = rescues.filter(r => !["completed", "cancelled"].includes(r.status));
      const pendingCount = rescues.filter(r => r.status === "pending").length;
      const criticalRescues = rescues.filter(r => r.severity === "critical");
      const assignedCount = rescues.filter(r => r.assignedNgo || r.assignedVolunteer).length;
      const completedCount = rescues.filter(r => r.status === "completed").length;

      const applications = await Adoption.find({ "adoption.ngo": ngoRaw._id }).populate("applicant").sort({ createdAt: -1 }).lean();
      const volunteers = await User.find({ role: "volunteer", city: ngoRaw.city }).lean();

      responseData.sections = [
        { id: "overview", label: "Overview" },
        { id: "rescues", label: "Rescue Operations" },
        { id: "adoptions", label: "Adoptions" },
        { id: "volunteers", label: "Volunteers" },
        { id: "analytics", label: "Analytics" },
      ];

      responseData.stats = [
        { id: "active", label: "Active Rescues", value: activeRescues.length, icon: "🚑", sub: `${pendingCount} pending`, highlight: true },
        { id: "critical", label: "Critical", value: criticalRescues.length, icon: "🔥", sub: "Live alerts" },
        { id: "assigned", label: "Assigned", value: assignedCount, icon: "👥", sub: "NGO-managed" },
        { id: "total", label: "Total", value: rescues.length, icon: "📊", sub: `${completedCount} completed` },
      ];

      responseData.quickActions = [
        { id: "rescues", icon: "🚑", label: "View Rescues", sub: "Active rescue queue", primary: true, actionType: "section", payload: "rescues" },
        { id: "scanner", icon: "📸", label: "AI Scanner", sub: "Analyze animal", path: "/scanner" },
        { id: "create_listing", icon: "🏠", label: "Create Listing", sub: "Adoption-ready animal", actionType: "modal", payload: "listing" },
        { id: "volunteers", icon: "👤", label: "Volunteers", sub: "Assign to cases", actionType: "section", payload: "volunteers" },
        { id: "analytics", icon: "📊", label: "Analytics", sub: "Operational metrics", actionType: "section", payload: "analytics" },
      ];

      // Aggregations for Analytics
      const donutData = [
        { label: "Critical", value: criticalRescues.length, color: "#DC2626" },
        { label: "High", value: rescues.filter(r => r.severity === "high").length, color: "#EA580C" },
        { label: "Medium", value: rescues.filter(r => r.severity === "medium").length, color: "#D97706" },
        { label: "Low", value: rescues.filter(r => r.severity === "low").length, color: "#16A34A" },
      ];
      const statusSegments = [
        { label: "Pending", value: pendingCount, color: "#9333EA" },
        { label: "Accepted", value: rescues.filter(r => r.status === "accepted").length, color: "#2563EB" },
        { label: "In Progress", value: rescues.filter(r => r.status === "in_progress").length, color: "#0EA5E9" },
        { label: "Rescued", value: rescues.filter(r => r.status === "rescued").length, color: "#16A34A" },
        { label: "Completed", value: completedCount, color: "#10B981" },
        { label: "Cancelled", value: rescues.filter(r => r.status === "cancelled").length, color: "#EF4444" },
      ];

      responseData.widgets = {
        overview: [
          { id: "quick_actions", type: "QuickActions", data: responseData.quickActions },
          { id: "active_rescues_compact", type: "RescueList", data: activeRescues.slice(0, 5), title: "Active Rescues", emptyMessage: "No active rescues." },
          { id: "activity", type: "EmptyState", icon: "📋", title: "Recent Activity", message: "No recent activities found." }
        ],
        rescues: [
          { id: "active_queue", type: "RescueList", data: rescues, title: "Active Rescue Queue", emptyIcon: "🚑", emptyTitle: "No Active Rescues", emptyMessage: "Your active rescue queue is currently empty." }
        ],
        volunteers: [
          { id: "volunteer_dir", type: "VolunteerList", data: volunteers, title: "Volunteer Coordination", emptyIcon: "👥", emptyTitle: "No Volunteers", emptyMessage: "No volunteers found in your city." }
        ],
        adoptions: [
          { id: "adoption_apps", type: "ApplicationList", data: applications, title: "Adoption Review", emptyIcon: "🐾", emptyTitle: "No Applications", emptyMessage: "No applications pending review." }
        ],
        analytics: [
          { id: "status_donut", type: "DonutChart", data: statusSegments, title: "Status Distribution" },
          { id: "severity_donut", type: "DonutChart", data: donutData, title: "Severity Distribution" },
          { id: "overview_stats", type: "StatsOverview", data: { Total: rescues.length, Pending: pendingCount, Completed: completedCount, Critical: criticalRescues.length }, title: "Overview" }
        ]
      };
    }

    // ---------------------------------------------------------
    // ADMIN ROLE
    // ---------------------------------------------------------
    else if (role === "admin") {
      const rescuesRaw = await RescueRequest.find({}).sort({ createdAt: -1 }).lean();
      const rescues = normalizeRescueList(rescuesRaw);
      
      const pendingCount = rescues.filter(r => r.status === "pending").length;
      const completedCount = rescues.filter(r => r.status === "completed").length;
      const criticalCount = rescues.filter(r => r.severity === "critical").length;
      const activeCount = rescues.length - completedCount - rescues.filter(r => r.status === "cancelled").length;

      const adoptions = await Adoption.find({}).lean();
      
      responseData.sections = [
        { id: "overview", label: "Overview" },
        { id: "rescues", label: "Rescue Operations" },
        { id: "ngos", label: "NGO Approvals" },
        { id: "ai", label: "AI Monitoring" },
        { id: "analytics", label: "Analytics" },
        { id: "alerts", label: "System Alerts" },
      ];

      responseData.stats = [
        { id: "total", label: "Total Rescues", value: rescues.length, icon: "◉", sub: `${pendingCount} pending`, highlight: true, trend: "up" },
        { id: "active", label: "Active Emergencies", value: activeCount, icon: "🚨", sub: `${criticalCount} critical`, trend: "up" },
        { id: "completed", label: "Completed", value: completedCount, icon: "✅", sub: `${pendingCount} pending` },
        { id: "critical", label: "Critical Cases", value: criticalCount, icon: "🔥", sub: "Severity alerts" },
      ];

      const donutData = [
        { label: "Critical", value: criticalCount, color: "#DC2626" },
        { label: "High", value: rescues.filter(r => r.severity === "high").length, color: "#EA580C" },
        { label: "Medium", value: rescues.filter(r => r.severity === "medium").length, color: "#D97706" },
        { label: "Low", value: rescues.filter(r => r.severity === "low").length, color: "#16A34A" },
      ];

      const statusSegments = [
        { label: "Pending", value: pendingCount, color: "#9333EA" },
        { label: "Accepted", value: rescues.filter(r => r.status === "accepted").length, color: "#2563EB" },
        { label: "In Progress", value: rescues.filter(r => r.status === "in_progress").length, color: "#0EA5E9" },
        { label: "Rescued", value: rescues.filter(r => r.status === "rescued").length, color: "#16A34A" },
        { label: "Completed", value: completedCount, color: "#10B981" },
        { label: "Cancelled", value: rescues.filter(r => r.status === "cancelled").length, color: "#EF4444" },
      ];

      responseData.widgets = {
        overview: [
          { id: "alerts_overview", type: "EmptyState", icon: "🔔", title: "Emergency Alerts", message: "System is operating normally without any critical alerts." },
          { id: "system_health", type: "SystemHealthPanel" },
          { id: "status_donut", type: "DonutChart", data: statusSegments, title: "Rescue Status Breakdown" },
          { id: "severity_donut", type: "DonutChart", data: donutData, title: "Severity Distribution" },
          { id: "activity", type: "EmptyState", icon: "📋", title: "Live Activity", message: "No recent activities found." }
        ],
        rescues: [
          { id: "rescue_map", type: "RescueMap", data: rescues.length > 0 ? rescues[0] : null },
          { id: "active_network", type: "RescueList", data: rescues, title: "Active Rescue Network", emptyMessage: "No rescue operations found yet." }
        ],
        ngos: [
          { id: "ngo_verification", type: "AdminNGOVerification" }
        ],
        ai: [
          { id: "system_health_ai", type: "SystemHealthPanel" },
          { id: "ai_metrics", type: "StatsOverview", data: { "Model Confidence": "92%", "Inference Uptime": "99.8%", "Avg Severity Score": "78", "Scans Today": "24" }, title: "AI Platform Metrics" }
        ],
        analytics: [
          { id: "status_donut", type: "DonutChart", data: statusSegments, title: "Status Distribution" },
          { id: "severity_donut", type: "DonutChart", data: donutData, title: "Severity Distribution" },
          { id: "rescue_overview", type: "StatsOverview", data: { "Total rescues": rescues.length, "Pending": pendingCount, "Completed": completedCount, "Critical": criticalCount }, title: "Rescue Overview" },
          { id: "adoption_overview", type: "StatsOverview", data: { "Available Animals": adoptions.length, "Pending Review": adoptions.filter(a => a.status === "pending").length, "Adopted": adoptions.filter(a => a.status === "adopted").length }, title: "Adoption Overview" }
        ],
        alerts: [
          { id: "full_alerts", type: "EmptyState", icon: "🔔", title: "No Alerts", message: "System is operating normally without any critical alerts." }
        ]
      };
    }

    return sendSuccess(res, {
      message: "Dashboard data loaded",
      data: responseData
    });
  } catch (err) {
    console.error("Dashboard Data Error:", err);
    return sendError(res, { status: 500, message: "Failed to load dashboard data" });
  }
};

// Helper for normalizing lists
function normalizeRescueList(list = []) {
  return list.map(normalizeRescue);
}
