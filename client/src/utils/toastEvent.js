// Create a custom event bus for toasts so that non-React files like api.js can trigger toasts
export const TOAST_EVENT = "resqnet-toast";

export const showToast = (message, type = "info") => {
  const event = new CustomEvent(TOAST_EVENT, { detail: { message, type } });
  window.dispatchEvent(event);
};

export const showErrorToast = (message) => showToast(message, "error");
export const showSuccessToast = (message) => showToast(message, "success");
export const showWarningToast = (message) => showToast(message, "warning");
