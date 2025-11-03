import React, { useState, useEffect } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Button, TextField } from "@mui/material";
import DataTable from "./common/DataTable";
import { tugService } from "../api/apiServices";
import Loader from "@/components/Loader.jsx";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { toast } from "../components/common/toster.jsx";
import ToastContainer from "../components/common/toster.jsx";
import { TUG_SERVICES } from "../api/apiConfig.js";
import CommonServices from "./common/commonService";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().slice(0, 10);
  const pastDate = new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().slice(0, 10); // 3 months back
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [startDate, setStartDate] = useState(pastDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const url =
      userData?.role === "Admin"
        ? `${TUG_SERVICES.GET_ALL_SERVICES}?fromDate=${startDate}&toDate=${endDate}` 
        : `${TUG_SERVICES?.GET_SERVICE_BY_USERNAME}/${userData?.username}?fromDate=${startDate}&toDate=${endDate}`;

    let response = await tugService.getAllServices(url);

    response?.forEach((item) => {
      item.serviceDate = CommonServices.formatDate(item.serviceDate);

      // Assuming 'item' has an 'activities' array, where each activity object has:

      // Helper function to reformat YYYY-MM-DD to DD-MM-YYYY
      const reformatDate = (dateString) => {
        if (!dateString) return null;
        // activityDate is assumed to be YYYY-MM-DD
        const parts = dateString.split("-");
        if (parts.length === 3) {
          // Reassemble as DD-MM-YYYY
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateString; // Fallback if split fails
      };

      // --- Find the 'Proceed' Activity ---
      const proceedActivity = item?.activities.find(
        (data) =>
          data?.description &&
          data.description.toUpperCase().includes("PROCEEDED TO ASSIST")
      );

      // --- Find the 'Cast Off' Activity ---
      const castOffActivity = item?.activities.find(
        (data) => data?.description === "TUG LINE CAST OFF"
      );

      // 1. Store the user-requested formatted string (MM-DD-YYYYT...) in item properties
      item.proceedDateTime =
        proceedActivity &&
        proceedActivity.activityDate &&
        proceedActivity.activityTime
          ? `${reformatDate(proceedActivity.activityDate)}T${
              proceedActivity.activityTime
            }`
          : null;

      item.castOffDateTime =
        castOffActivity &&
        castOffActivity.activityDate &&
        castOffActivity.activityTime
          ? `${reformatDate(castOffActivity.activityDate)}T${
              castOffActivity.activityTime
            }`
          : null;

      // 2. Create reliable ISO 8601 strings (YYYY-MM-DDT...) for calculation
      const proceedDateTimeISO =
        proceedActivity &&
        proceedActivity.activityDate &&
        proceedActivity.activityTime
          ? `${proceedActivity.activityDate}T${proceedActivity.activityTime}`
          : null;

      const castOffDateTimeISO =
        castOffActivity &&
        castOffActivity.activityDate &&
        castOffActivity.activityTime
          ? `${castOffActivity.activityDate}T${castOffActivity.activityTime}`
          : null;

      // 3. Perform calculation using the reliable ISO strings
      if (proceedDateTimeISO && castOffDateTimeISO) {
        // Create Date objects using the reliable YYYY-MM-DDT... format.
        const start = new Date(proceedDateTimeISO);
        const end = new Date(castOffDateTimeISO);

        // Check if both dates were parsed successfully
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const diffMs = end.getTime() - start.getTime();

          // Ensure end time is after start time (a positive difference)
          if (diffMs > 0) {
            const diffHrs = diffMs / (1000 * 60 * 60);
            const diffMins = diffMs / (1000 * 60);

            // Format the output
            item.totalHours =
              diffHrs >= 1
                ? `${diffHrs.toFixed(2)} hr`
                : `${diffMins.toFixed(2)} min`;
          } else {
            // If difference is zero or negative, set to 00:00 (invalid sequence)
            item.totalHours = "00:00";
          }
        } else {
          // If Date parsing failed (should be less likely now), set to 00:00
          item.totalHours = "00:00";
        }
      } else {
        // If one of the required activities was not found
        item.totalHours = "00:00";
      }
    });
    setData(response);
    setFilteredData(response);
    setLoading(false);
  };

  const onRowClicked = (props) => {
    const data = props?.data;
    if (data?.serviceId) {
      navigate(`/tugservices/${data?.serviceId}`);
    }
  };

  const ActionRenderer = (props) => {
    return (
      <IconButton
        size="small"
        color="primary"
        onClick={() => onRowClicked(props)}
      >
        <FaEdit />
      </IconButton>
    );
  };

  // Date Range Search with validation
  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      toast.warn("Please select both Start Date and End Date");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.warn("End Date cannot be earlier than Start Date");
      return;
    }
    fetchData();
  };

  const exportToExcel = () => {
    // 1. Define the mapping from data field name to desired Excel header name
    const columnMapping = {
      serviceDate: "Date",
      refNo: "Voucher No",
      locationName: "Location",
      motherVessel: "Mother Vessel",
      vesselName: "Daughter Vessel",
      tugName: "Tug Name",
      serviceRemarks: "Type of Service",
      remarks: "Remarks",
      proceedDateTime: "Proceed Timing",
      castOffDateTime: "Cast Of Timing",
      totalHours: "Total Hours",
    };
    // Use the keys of the mapping as the columns to extract from the row data
    const exportColumns = Object.keys(columnMapping);

    // 2. Filter data and apply the new headers
    const mappedData = filteredData.map((row) => {
      const newRow = {};
      exportColumns.forEach((colKey) => {
        // Use the mapped header name as the key in the new object
        const excelHeader = columnMapping[colKey];
        // Assign the value from the original row data
        newRow[excelHeader] = row[colKey];
      });
      return newRow;
    });

    // Existing XLSX library code remains the same
    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    // Assuming saveAs is available (e.g., from file-saver library)
    saveAs(blob, "TugJobDetails.xlsx");
  };

  const columns = [
    { headerName: "Date", field: "serviceDate", sortable: true, minWidth: 120, maxWidth: 180 },
    { headerName: "Voucher No", field: "refNo", sortable: true, minWidth: 120, maxWidth: 250 },
    {
      headerName: "Location",
      field: "locationName",
      sortable: true,
      minWidth: 120,
      maxWidth: 250
    },
    {
      headerName: "Mother Vessel",
      field: "motherVessel",
      sortable: true,
      minWidth: 140,
      maxWidth: 250
    },
    {
      headerName: "Daughter Vessel",
      field: "vesselName",
      sortable: true,
      minWidth: 160,
      maxWidth: 250
    },
    { headerName: "Tug Name", field: "tugName", sortable: true,minWidth: 120, maxWidth: 120 },
    {
      headerName: "Type of Service",
      field: "serviceRemarks",
      sortable: true,
      minWidth: 180,
    },
    { headerName: "Remarks", field: "remarks", sortable: true, minWidth: 200 },
    {
      headerName: "Proceed Timing",
      field: "proceedDateTime",
      sortable: true,
      minWidth: 150,
    },
    {
      headerName: "Cast Of Timing",
      field: "castOffDateTime",
      sortable: true,
      minWidth: 150,
    },
    {
      headerName: "Total Hours",
      field: "totalHours",
      sortable: true,
      minWidth: 130,
    },
    {
      headerName: "Actions",
      field: "actions",
      sortable: false,
      filter: false,
      pinned: "right",
      width: 100,
      cellRenderer: ActionRenderer,
    },
  ];

  return (
    <>
      <Loader show={loading} />
      <ToastContainer headerHeight={64} />
      <Box className="p-6">
        {/* Filter Bar */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          marginBottom={1}
          sx={{
            border: "1px solid #d1d5db", // light gray border (Tailwind's gray-300)
            borderRadius: "8px",
            padding: "8px 12px",
            backgroundColor: "#fff", // optional: keeps a clean card-like look
          }}
        >
          {/* Global Search (AG Grid quick filter with embedded search button) */}
          <TextField
            size="small"
            label="Search (Real-time)"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="h-6 w-px bg-gray-300"></div>
          {/* Date range filters */}
          <TextField
            size="small"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            slotProps={{
              htmlInput: {
                max: currentDate, // use htmlInput instead of input
              },
            }}
          />
          <TextField
            size="small"
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            slotProps={{
              htmlInput: {
                min: startDate || "",
                // max: currentDate,
              },
            }}
          />

          {/* Search button for date range */}
          <Button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-blue-800 focus:outline-none active:outline-none active:ring-0"
            variant="contained"
            size="small"
            startIcon={<FaSearch size={14} />}
            onClick={handleDateFilter}
          >
            Search
          </Button>

          {/* Export button (align right) */}
          <Button
            variant="contained"
            size="small"
            onClick={exportToExcel}
            style={{ marginLeft: "auto" }}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 focus:outline-none active:outline-none active:ring-0"
          >
            Export Data
          </Button>
        </Box>

        {/* AG Grid Table */}
        <DataTable
          rowData={filteredData}
          sortable={true}
          filter={true}
          columnDefs={columns}
          quickFilterValue={search}
        />
      </Box>
    </>
  );
};

export default Dashboard;
