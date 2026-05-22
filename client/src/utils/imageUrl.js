/**
 * Image URL utility for Cloudinary-hosted rescue images
 * Handles both Cloudinary full URLs and local upload fallbacks
 */

/**
 * Get a properly formatted image URL for rendering
 * @param {string|null|undefined} imageUrl - The image URL or path
 * @returns {string|null} - The full image URL or null if no image
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  const url = String(imageUrl).trim();
  if (!url) return null;

  // If it's already a full URL (Cloudinary or HTTP), use it directly
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Fallback for local uploads (shouldn't happen with Cloudinary, but kept for safety)
  const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(
    /\/api\/?$/,
    ""
  );
  return `${API_BASE}${url}`;
};

/**
 * Get the first image URL from a rescue's image array
 * @param {Object} rescue - Rescue object with images array
 * @returns {string|null} - The URL of the first image or null
 */
export const getRescueImageUrl = (rescue) => {
  if (!rescue?.images || !Array.isArray(rescue.images) || rescue.images.length === 0) {
    return null;
  }
  return getImageUrl(rescue.images[0]);
};

export default {
  getImageUrl,
  getRescueImageUrl,
};
