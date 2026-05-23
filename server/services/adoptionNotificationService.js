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
  const isApproved = status === "approved";
  return createNotification({
    recipientId: adoptionApplication.applicant,
    type: isApproved ? "adoption_approved" : "adoption_rejected",
    title: `Adoption Application ${status}`,
    message: `Your application for ${animalName || "the animal"} has been ${status}.`,
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
