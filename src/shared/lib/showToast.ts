import Toastify from "toastify-js";

export function showToast(
  message: string,
  type: "success" | "delete" | "info" = "success"
) {
  const colors = {
    success: "#4caf50",
    delete: "#f44336",
    info: "#2196f3",
  };

  Toastify({
    text: message,
    duration: 4000,
    gravity: "bottom",
    position: "right",
    className: "custom-toast",
    style: {
      background: colors[type],
      borderRadius: "6px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#fff",
    },
    stopOnFocus: true,
  }).showToast();
}
