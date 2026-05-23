import { createNotification } from "./notificationService.js";

/**
 * Notify NGO about a new adoption application.
 */
export const notifyAdoptionSubmitted = async (adoptionApplication, adoptionListing) => {
  const ngoId = adoptionApplication.ngo || adoptionListing.listedBy;
  if (!ngoId) return;
  return createNotification({
    recipientId: ngoId,
    type: "adoption_submitted",
    title: `New Adoption Application`,
    message: `You have received a new adoption application for ${adoptionListing.animalName || adoptionListing.animalType}.`,
    priority: "medium",
    relatedEntity: adoptionApplication._id,
    relatedEntityType: "AdoptionApplication",
  });
};

/**
 * Notify User about application status change (approved/rejected).
 */
export const notifyAdoptionStatusChange = async (adoptionApplication, status, animalName) => {
  let type = "adoption_status";
  let title = `Adoption Application ${status}`;
  
  if (status === "approved") {
    type = "adoption_approved";
    title = "Adoption Application Approved";
  } else if (status === "rejected") {
    type = "adoption_rejected";
    title = "Adoption Application Rejected";
  } else if (status === "interview_scheduled") {
    type = "adoption_interview";
    title = "Adoption Interview Scheduled";
  } else if (status === "completed") {
    type = "adoption_completed";
    title = "Adoption Completed!";
  }

  return createNotification({
    recipientId: adoptionApplication.applicant,
    type,
    title,
    message: `Your application for ${animalName || "the animal"} has been ${status.replace("_", " ")}.`,
    priority: "medium",
    relatedEntity: adoptionApplication._id,
    relatedEntityType: "AdoptionApplication",
    data: { status },
  });
};

export default {
  notifyAdoptionSubmitted,
  notifyAdoptionStatusChange,
};
