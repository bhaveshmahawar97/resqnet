import { createNotification } from "./notificationService.js";

/**
 * Handle notification for NGO receiving an assignment.
 */
export const notifyNgoAssignment = async (rescue, ngoId) => {
  return createNotification({
    recipientId: ngoId,
    type: "ngo_assignment_received",
    title: `New Mission Assignment`,
    message: `You have been assigned to rescue ${rescue.animalType} at ${rescue.address}.`,
    priority: "high",
    relatedEntity: rescue._id,
    relatedEntityType: "RescueRequest",
    data: { status: rescue.status, severity: rescue.severity },
  });
};

/**
 * Handle notification for volunteer being assigned.
 */
export const notifyVolunteerAssignment = async (rescue, volunteerId) => {
  return createNotification({
    recipientId: volunteerId,
    type: "volunteer_assigned",
    title: `New Volunteer Mission`,
    message: `You have been assigned to rescue a ${rescue.animalType} at ${rescue.address}.`,
    priority: "high",
    relatedEntity: rescue._id,
    relatedEntityType: "RescueRequest",
    data: { severity: rescue.severity },
  });
};

/**
 * Notify the creator that the NGO accepted the mission.
 */
export const notifyRescueAcceptedByNgo = async (rescue) => {
  if (!rescue.createdBy) return;
  return createNotification({
    recipientId: rescue.createdBy,
    type: "rescue_accepted",
    title: `NGO Accepted Mission`,
    message: `An NGO has accepted your rescue request for the ${rescue.animalType}.`,
    priority: "medium",
    relatedEntity: rescue._id,
    relatedEntityType: "RescueRequest",
    data: { ngoId: rescue.assignedNgo },
  });
};

/**
 * Notify when a rescue is completed.
 */
export const notifyRescueCompleted = async (rescue) => {
  const recipients = [
    rescue.createdBy?.toString?.() || rescue.createdBy,
    rescue.assignedNgo?.toString?.() || rescue.assignedNgo,
    rescue.assignedVolunteer?.toString?.() || rescue.assignedVolunteer,
  ].filter(Boolean);

  const uniqueRecipients = [...new Set(recipients)];

  const docs = uniqueRecipients.map((recipientId) => ({
    recipientId,
    type: "rescue_completed",
    title: `Rescue Completed`,
    message: `The mission for ${rescue.animalType} at ${rescue.address} has been successfully completed.`,
    priority: "low",
    relatedEntity: rescue._id,
    relatedEntityType: "RescueRequest",
  }));

  return Promise.all(docs.map((doc) => createNotification(doc)));
};

export default {
  notifyNgoAssignment,
  notifyVolunteerAssignment,
  notifyRescueAcceptedByNgo,
  notifyRescueCompleted,
};
