const CommonServices = {
    // Convert YYYY-MM-DD → DD-MM-YYYY
    formatDate: (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      if (isNaN(date)) return dateStr;
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },

    capitalizeHeader: (header) => {
        return header
          .split(/[\s_]+/) // Split by space or underscore
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
    
  };
  
  export default CommonServices;