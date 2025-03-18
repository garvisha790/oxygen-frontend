// Format date and time
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Get color based on status
export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "offline":
      return "#666";
    case "error":
    case "critical":
      return "#f44336";
    case "warning":
      return "#ff9800";
    case "normal":
    case "good":
      return "#4caf50";
    default:
      return "#4caf50";
  }
};

// Format sensor values with units
export const formatSensorValue = (value, type) => {
  switch (type.toLowerCase()) {
    case "temperature":
      return `${value}°C`;
    case "humidity":
      return `${value}%`;
    case "pressure":
      return `${value} hPa`;
    case "oxygen":
      return `${value}%`;
    default:
      return value;
  }
};

// Calculate status summary from devices array
export const calculateStatusSummary = (devices) => {
  const summary = {
    offline: 0,
    error: 0,
    warning: 0,
    normal: 0,
  };

  devices.forEach((device) => {
    const status = device.status.toLowerCase();
    if (summary[status] !== undefined) {
      summary[status]++;
    } else if (status === "critical") {
      summary.error++;
    } else if (status === "good") {
      summary.normal++;
    }
  });

  return summary;
};

// Get stored user from localStorage
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Store user data in localStorage
export const storeUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Remove stored user from localStorage
export const removeStoredUser = () => {
  localStorage.removeItem("user");
};
