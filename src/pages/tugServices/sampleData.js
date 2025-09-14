// Sample data set 1 - Tug Service Timeline
export const tugServiceTimeline =  [
  {
      "activityId": 8,
      "activityDate": "2025-08-18",
      "activityTime": "08:40:00.0000000",
      "description": "RECEIVED ORDER FROM MM"
  },
  {
      "activityId": 9,
      "activityDate": "2025-08-18",
      "activityTime": "08:45:00.0000000",
      "description": "PROCEEDED TO ASSIST MT. KAROLOS"
  },
  {
      "activityId": 10,
      "activityDate": "2025-08-18",
      "activityTime": "09:00:00.0000000",
      "description": "ARRIVED AT RV POSITION"
  },
  {
      "activityId": 11,
      "activityDate": "2025-08-18",
      "activityTime": "09:30:00.0000000",
      "description": "TUG LINE MADE FAST"
  },
  {
      "activityId": 12,
      "activityDate": "2025-08-18",
      "activityTime": "12:06:00.0000000",
      "description": "TUG LINE CAST OFF"
  },
  {
      "activityId": 13,
      "activityDate": "2025-08-18",
      "activityTime": "12:30:00.0000000",
      "description": "SERVICE COMPLETED"
  },
  {
      "activityId": 14,
      "activityDate": "2025-08-18",
      "activityTime": "12:35:00.0000000",
      "description": "RETURNED TO BASE, FWE"
  }
]

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
