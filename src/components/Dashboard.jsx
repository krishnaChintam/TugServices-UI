import React, { useState } from "react";
import { FaSearch, FaFilter, FaSort, FaEdit } from "react-icons/fa";
import { Box, TextField, MenuItem, IconButton, InputAdornment } from "@mui/material";
import DataTable from "./common/DataTable";

const Dashboard = () => {
  const [search, setSearch] = useState("");

  const rowData = [
    { 
      vesselName: "MV Ocean Spirit", 
      serviceId: "TS-001", 
      tugAssigned: "Tug Atlas", 
      draftForward: 8.5, 
      draftAft: 9.2, 
      berth: "Berth-05", 
      status: "Completed", 
      serviceDate: "2025-08-10" 
    },
    { 
      vesselName: "MV Blue Horizon", 
      serviceId: "TS-002", 
      tugAssigned: "Tug Titan", 
      draftForward: 7.8, 
      draftAft: 8.1, 
      berth: "Berth-03", 
      status: "Ongoing", 
      serviceDate: "2025-08-12" 
    },
    { 
      vesselName: "MT Sea Pearl", 
      serviceId: "TS-003", 
      tugAssigned: "Tug Neptune", 
      draftForward: 10.1, 
      draftAft: 10.4, 
      berth: "Berth-07", 
      status: "Scheduled", 
      serviceDate: "2025-08-14" 
    },
    { 
      vesselName: "MV Silver Wave", 
      serviceId: "TS-004", 
      tugAssigned: "Tug Hercules", 
      draftForward: 6.4, 
      draftAft: 6.9, 
      berth: "Berth-02", 
      status: "Completed", 
      serviceDate: "2025-08-15" 
    },
    { 
      vesselName: "MT Pacific Queen", 
      serviceId: "TS-005", 
      tugAssigned: "Tug Poseidon", 
      draftForward: 9.3, 
      draftAft: 9.7, 
      berth: "Berth-09", 
      status: "Ongoing", 
      serviceDate: "2025-08-16" 
    }
  ];
  // Quick stats data
  const columns = [
    { headerName: "Vessel Name", field: "vesselName", sortable: true, filter: true, flex: 1 },
    { headerName: "Service ID", field: "serviceId", sortable: true, flex: 1 },
    { headerName: "Tug Assigned", field: "tugAssigned", sortable: true, flex: 1 },
    { headerName: "Draft Forward", field: "draftForward", sortable: true, flex: 1 },
    { headerName: "Draft Aft", field: "draftAft", sortable: true, flex: 1 },
    { headerName: "Berth", field: "berth", flex: 1 },
    { headerName: "Status", field: "status", flex: 1 },
    { headerName: "Service Date", field: "serviceDate", flex: 1 },
    {
      headerName: "Actions",
      field: "actions",
      flex: 1,
      cellRendererFramework: () => (
        <IconButton size="small" color="primary">
          <FaEdit />
        </IconButton>
      ),
    },
  ]
  const rows = [
    { vesselName: 'MV Ocean Spirit', serviceId: 'TS-001', tugAssigned: 'Tug Atlas', draftForward: 8.5, draftAft: 9.2, berth: 'Berth-05', status: 'Completed', serviceDate: '2025-08-10' },
    { vesselName: 'MV Blue Horizon', serviceId: 'TS-002', tugAssigned: 'Tug Titan', draftForward: 7.8, draftAft: 8.1, berth: 'Berth-03', status: 'Ongoing', serviceDate: '2025-08-12' },
    { vesselName: 'MT Sea Pearl', serviceId: 'TS-003', tugAssigned: 'Tug Neptune', draftForward: 10.1, draftAft: 10.4, berth: 'Berth-07', status: 'Scheduled', serviceDate: '2025-08-14' },
    { vesselName: 'MV Silver Wave', serviceId: 'TS-004', tugAssigned: 'Tug Hercules', draftForward: 6.4, draftAft: 6.9, berth: 'Berth-02', status: 'Completed', serviceDate: '2025-08-15' },
    { vesselName: 'MT Pacific Queen', serviceId: 'TS-005', tugAssigned: 'Tug Poseidon', draftForward: 9.3, draftAft: 9.7, berth: 'Berth-09', status: 'Ongoing', serviceDate: '2025-08-16' },
  ];

  const onRowClicked=()=>{

  }
  
  return (
    <Box className="p-6">
    <Box className="flex justify-between items-center mb-4">
        <TextField
          size="small"
          placeholder="Search a product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch className="text-gray-500" />
              </InputAdornment>
            ),
          }}
          className="w-1/3"
        />

        {/* Filter & Sort */}
        <Box className="flex gap-2">
          <TextField select size="small" label="Filter by" className="w-40">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="sold">Sold</MenuItem>
          </TextField>

          <TextField select size="small" label="Sort by" className="w-40">
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="gross">Gross</MenuItem>
            <MenuItem value="expire">Expire Date</MenuItem>
          </TextField>
        </Box>
        </Box>
      <DataTable
        rowData={rows}
        columnDefs={columns}
      />
      </Box>
  );
};

export default Dashboard;
