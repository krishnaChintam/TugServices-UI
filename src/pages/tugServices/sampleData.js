// Sample data set 1 - Tug Service Timeline
export const tugServiceTimeline = [
    {
      dateTime: "2025-08-21T08:55",
      description: "Receive Order From MM",
    },
    {
      dateTime: "2025-08-21T09:30",
      description: "Proceed to assist MT Karolos",
    },
    {
      dateTime: "2025-08-21T08:40",
      description: "Arrive at RV position",
    },
    {
      dateTime: "2025-08-21T08:45",
      description: "Tug line made fast",
    },
    {
      dateTime: "2025-08-21T10:15",
      description: "Tug line cast off",
    },
    {
      dateTime: "2025-08-21T11:15",
      description: "Service complete",
    },
    {
      dateTime: "2025-08-21T11:45",
      description: "Back to base tied up at MT ITO Amoy, FWE",
    },
  ];

// Sample data set 2 - Vessel Information
export const vesselData = [
    {
      vesselName: "MT Karolos",
      vesselType: "Tanker",
      imo: "1234567",
      status: "Active"
    },
    {
      vesselName: "MT ITO Amoy",
      vesselType: "Tanker", 
      imo: "2345678",
      status: "Active"
    }
  ];

// Sample data set 3 - Tug Information
export const tugData = [
    {
      tugName: "Tug Alpha",
      tugType: "Harbor Tug",
      power: "2000 HP",
      status: "Available"
    },
    {
      tugName: "Tug Beta", 
      tugType: "Ocean Tug",
      power: "4000 HP",
      status: "In Service"
    }
  ];

// Sample data set 4 - Service Types
export const serviceTypes = [
    {
      id: 1,
      name: "Harbor Assistance",
      duration: "2-4 hours",
      cost: 500
    },
    {
      id: 2,
      name: "Ocean Towing",
      duration: "8-12 hours", 
      cost: 1500
    },
    {
      id: 3,
      name: "Emergency Response",
      duration: "1-3 hours",
      cost: 2000
    }
  ];

// Default export (keeping the original data as default for backward compatibility)
export default tugServiceTimeline;
