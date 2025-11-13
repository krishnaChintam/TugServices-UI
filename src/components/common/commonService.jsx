const CommonServices = {
  // Convert YYYY-MM-DD → DD-MM-YYYY
  formatDate: (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // DD-MM-YYYY
  },

  serviceFormatDate: (dateStr) => {
    if (!dateStr) return "";
    // If format is DD-MM-YYYY, split manually
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`; // YYYY-MM-DD
    }
    return dateStr; // fallback
  },

  capitalizeHeader: (header) => {
    return header
      .split(/[\s_]+/) // Split by space or underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },
};

export default CommonServices;
