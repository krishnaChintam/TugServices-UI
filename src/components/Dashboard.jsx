import React, { useState, useEffect } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Button, TextField,Menu, MenuItem } from "@mui/material";
import DataTable from "./common/DataTable";
import { tugService } from "../api/apiServices";
import Loader from "@/components/Loader.jsx";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { toast } from "../components/common/toster.jsx";
import ToastContainer from "../components/common/toster.jsx";
import { TUG_SERVICES } from "../api/apiConfig.js";
import CommonServices from "./common/commonService";
import ListButton from "./common/listButton";

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
      // Helper to safely reformat date (YYYY-MM-DD → DD-MM-YYYY)
      const reformatDate = (date) =>
        date?.split("-").reverse().join("-") ?? null;

      // Helper to safely combine date + time into ISO and Display formats
      const getDateTime = (activity) => {
        const { activityDate: date, activityTime: time } = activity ?? {};
        if (!date || !time) return { iso: null, display: null };
        return {
          iso: `${date}T${time}`,
          display: `${reformatDate(date)}T${time}`,
        };
      };

      // --- Main Logic Refactored ---
      const activities = item?.activities;
      const findActivity = (keyword) =>
        activities?.find((a) =>
          a?.description?.toUpperCase().includes(keyword.toUpperCase())
        );

      const { iso: proceedISO, display: proceedDisplay } = getDateTime(
        findActivity("PROCEEDED TO ASSIST")
      );
      const { iso: castOffISO, display: castOffDisplay } = getDateTime(
        findActivity("TUG LINE CAST OFF")
      );

      item.proceedDateTime = proceedDisplay;
      item.castOffDateTime = castOffDisplay;

      const calculateDuration = (startISO, endISO) => {
        if (!startISO || !endISO) return "00:00";
        const diffMs = new Date(endISO) - new Date(startISO);

        if (diffMs <= 0) return "00:00";

        const diffHrs = diffMs / 3_600_000;
        return diffHrs >= 1
          ? `${diffHrs.toFixed(2)} hr`
          : `${(diffMs / 60_000).toFixed(2)} min`;
      };

      item.totalHours = calculateDuration(proceedISO, castOffISO);
      item.cost = (item?.serviceType === "REFRESH ANCHOR" || item?.serviceType === "REPOSITION") ? 0 : getCalculatedCost(item,userData),
      item.count = (item?.serviceType === "REFRESH ANCHOR" || item?.serviceType === "REPOSITION") ? 0 : 1,
      item.foc = (item?.serviceType === "REFRESH ANCHOR" || item?.serviceType === "REPOSITION") ? 1 : 0
      item.isCanceled = item?.isActive ? 'True' : 'False'
    });
    setData(response);
    setFilteredData(response);
    setLoading(false);
  };

/**
 * Calculates the final cost based on total service hours compared to a package's included hours.
 * It also updates the 'item' object's cost property and returns the calculated cost.
 *
 * @param {object} item - The activity item object to update (expected to have totalHours).
 * @param {object} userData - User package and cost data (packageCost, perHourCost, noOfHours).
 * @returns {number} The calculated final cost.
 */
const getCalculatedCost = (item, userData) => {
  // 1. Safely extract and default required values
  const { totalHours } = item ?? {};
  const { noOfHours = 2, packageCost = 2700, perHourCost = 670 } = userData ?? {};
  let totalServiceHours = 0;

  // 2. Parse the totalHours string to get a numeric value
  if (totalHours) {
    const parts = totalHours.split(' ');
    const value = parseFloat(parts[0]);
    const unit = parts[1];

    if (!isNaN(value)) {
      totalServiceHours = (unit === 'hr') ? value : (value / 60);
    }
  }

  // 3. Calculate the difference (overage)
  const overageHours = totalServiceHours - noOfHours;

  // 4. Determine the final cost and update the item object
  let finalCost;

  if (overageHours <= 0) {
    // No overage
    finalCost = packageCost;
  } else {
    // Calculate full overage hours to charge (rounding up to the next full hour)
    const chargeableOverageHours = Math.ceil(overageHours);

    const additionalCost = chargeableOverageHours * perHourCost;
    finalCost = packageCost + additionalCost;
  }

  // Update the item object and return the final cost
  item.cost = finalCost;
  return finalCost;
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

  /**
 * Generates and returns the final Excel column mapping
 * based on export type and user role.
 *
 * @param {string} excelType - Type of Excel export ('regular' | 'weekly')
 * @param {string} role - Current user role ('admin' | 'user')
 * @returns {object} - Final column mapping for export
 */
const getExcelColums = (excelType = 'regular') => {
  const role = userData?.role;

  // 1. Base column mapping (default for all exports)
  const base = {
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
    pairWith: 'Pair With',
    commandRankAndName: 'CommandRank And Name',
    jobNo: "Job No",
    cost: "Cost",
    count: "Count",
    foc: "FOC",
  };

  // 2. Columns to exclude for restricted users or weekly export
  const exclude = ['jobNo', 'cost', 'count', 'foc'];

  // 3. Additional columns specific to weekly export
  const weeklyAdd = {
    pairWith: "Pair With",
    commandAndRank: "Command/Rank and Name",
  };

  // 4. Start with base mapping
  let cols = { ...base };

  // 5. Remove restricted columns for 'weekly' type or 'user' role
  if (excelType === 'weekly' || role === 'user') {
    cols = Object.fromEntries(
      Object.entries(cols).filter(([key]) => !exclude.includes(key))
    );
  }

  // 6. Add weekly-specific columns at the end for 'weekly' export type
  if (excelType === 'weekly') {
    Object.assign(cols, weeklyAdd);
  }

  // 7. Return final mapping
  return cols;
}

  const exportToExcel = (excelType='regular') => {
    // 1. Define the mapping from data field name to desired Excel header name
    const columnMapping = getExcelColums(excelType);
    // Use the keys of the mapping as the columns to extract from the row data
    const exportColumns = Object.keys(columnMapping);

    // 2. Filter data and apply the new headers
    const mappedData = filteredData?.filter(row => row.isActive === 1)?.map((row) => {
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
    const FileName = excelType === 'regular' ? "TugJobDetails.xlsx" : "WeeklyTugActivitiesReport.xlsx"
    // Assuming saveAs is available (e.g., from file-saver library)
    saveAs(blob, FileName);
  };

  const columns = [
    { 
      headerName: "Date", 
      field: "serviceDate", 
      sortable: true, 
      width: 120, 
      maxWidth: 220 
    },
    { 
      headerName: "Voucher No", 
      field: "refNo", 
      sortable: true,
      tooltipField:"refNo", 
      width: 150, 
      maxWidth: 250 
    },
    {
      headerName: "Location",
      field: "locationName",
      tooltipField: "locationName",
      sortable: true,
      width: 140,
      maxWidth: 300
    },
    {
      headerName: "Mother Vessel",
      field: "motherVessel",
      tooltipField: "motherVessel",
      sortable: true,
      width: 150,
      maxWidth: 250
    },
    {
      headerName: "Daughter Vessel",
      field: "vesselName",
      tooltipField: "vesselName",
      sortable: true,
      width: 160,
      maxWidth: 250
    },
    { headerName: "Tug Name",
      field: "tugName",
      tooltipField: "tugName", 
      sortable: true,
      width: 125, 
      maxWidth: 220 
    },
    {
      headerName: "Type of Service",
      field: "serviceRemarks",
      tooltipField: "serviceRemarks",
      sortable: true,
      width: 180,
      maxWidth: 280 
    },
    { headerName: "Remarks", 
      field: "remarks",
      tooltipField: "remarks", 
      sortable: true, 
      width: 200,
      maxWidth: 300 
    },
    {
      headerName: "Proceed Timing",
      field: "proceedDateTime",
      tooltipField: "proceedDateTime",
      sortable: true,
      width: 180,
      maxWidth: 250 
    },
    {
      headerName: "Cast Of Timing",
      field: "castOffDateTime",
      tooltipField: "castOffDateTime",
      sortable: true,
      width: 180,
      maxWidth: 250 
    },
    {
      headerName: "Total Hours",
      field: "totalHours",
      tooltipField: "totalHours",
      sortable: true,
      width: 130,
      maxWidth: 280 
    },
    {
      headerName: "Pair With",
      field: "pairWith",
      tooltipField: "pairWith",
      sortable: true,
      width: 130,
      maxWidth: 280 
    },
    {
      headerName: "CommandRank And Name",
      field: "commandRankAndName",
      tooltipField: "commandRankAndName",
      sortable: true,
      width: 230,
      maxWidth: 280 
    },
    {
      headerName: "Job No",
      field: "jobNo",
      tooltipField: "jobNo",
      sortable: true,
      width: 100,
      maxWidth: 220
    },
    {
      headerName: "Cost",
      field: "cost",
      tooltipField: "cost",
      sortable: true,
      width: 100,
      maxWidth: 200
    },
    {
      headerName: "Count",
      field: "count",
      tooltipField: "count",
      sortable: true,
      width: 100,
      maxWidth: 150 
    },
    {
      headerName: "FOC",
      field: "foc",
      tooltipField: "foc",
      sortable: true,
      width: 100,
      maxWidth: 120
    },
    {
      headerName: "Status",
      field: "isCanceled",
      sortable: true,
      width: 100,
      maxWidth: 120
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

  const ExportMenuItems = [
    {
      label: "Regular Format",
      // icon: <EditIcon fontSize="small" />,
      onClick: () => exportToExcel("regular"),
    },
    {
      label: "Weekly Format",
      onClick: () => exportToExcel("weekly"),
    }
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
                min: startDate || ""
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
          <div style={{ marginLeft: "auto" }}>
          <ListButton 
          buttonLabel="Export Data" 
          items={ExportMenuItems} 
          buttonColor="indigo"
          className="ml-auto bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 focus:outline-none active:outline-none active:ring-0"
          />
          </div>
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
