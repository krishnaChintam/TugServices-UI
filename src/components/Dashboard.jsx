import React, { useState, useEffect } from "react";
import { FaEdit, FaSearch, FaDownload, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Button,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
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
import ConfirmModal from "@/components/common/ConfirmModal.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const defaultDataValue = "1";
  const currentDate = new Date().toISOString().slice(0, 10);
  const pastDate = new Date(new Date().setMonth(new Date().getMonth() - 3))
    .toISOString()
    .slice(0, 10); // 3 months back
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [startDate, setStartDate] = useState(pastDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState(defaultDataValue);
  const [confirmModelInfo, setConfirmModelText] = useState({
    title: "",
    message: "",
    confirmButtonName: "",
    cancelButtonName: "",
    data: null,
  });

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
          iso: `${date} ${time}`,
          display: `${reformatDate(date)} ${time}`,
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
      (item.cost =
        item?.serviceType === "REFRESH ANCHOR" ||
        item?.serviceType === "REPOSITION"
          ? 0
          : getCalculatedCost(item, userData)),
        (item.count =
          item?.serviceType === "REFRESH ANCHOR" ||
          item?.serviceType === "REPOSITION"
            ? 0
            : 1),
        (item.foc =
          item?.serviceType === "REFRESH ANCHOR" ||
          item?.serviceType === "REPOSITION"
            ? 1
            : 0);
      item.isCanceled = item?.isActive ? "Active" : "Cancelled";
    });
    setOriginalData(response);
    handleStatusChange(defaultDataValue, response);
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
    const {
      noOfHours = 2,
      packageCost = 2700,
      perHourCost = 670,
    } = userData ?? {};
    let totalServiceHours = 0;

    // 2. Parse the totalHours string to get a numeric value
    if (totalHours) {
      const parts = totalHours.split(" ");
      const value = parseFloat(parts[0]);
      const unit = parts[1];

      if (!isNaN(value)) {
        totalServiceHours = unit === "hr" ? value : value / 60;
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

  const handleCancel = async () => {
    let payload = confirmModelInfo?.data;
    payload.isActive = 0;
    payload.serviceDate = CommonServices.serviceFormatDate(payload.serviceDate);
    try {
      if (payload?.serviceId) {
        setLoading(true);
        const res = await tugService.updateService(payload.serviceId, payload);
        if (res?.serviceId && !res?.isActive) {
          toast.success("Transaction cancelled successfully.");
          fetchData();
        }
      }
    } catch (err) {
      console.error("Error saving:", err);
      toast.error("Unable to cancel transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const onModelConfirmation = () => {
    handleCloseModal(); // Close the modal after action
    handleCancel();
  };

  const handleOpenModel = (data) => {
    setConfirmModelText({
      title: "Confirm Cancellation",
      message:
        "Are you sure you want to cancel this item? This action cannot be undone.",
      confirmButtonName: "Proceed to cancel",
      cancelButtonName: "No",
      data: data,
    });
    setOpenModal(true);
  };

  const onRowClicked = (props, actionType) => {
    const data = props?.data;
    if (data?.serviceId) {
      if (actionType === "edit") {
        navigate(`/tugservices/${data?.serviceId}`);
      } else if (actionType === "downloadAll") {
        getUploadedDocs(data?.serviceId);
      } else if (actionType === "cancelTrx") {
        handleOpenModel(data);
      }
    }
  };

  const ActionRenderer = (props) => {
    return (
      <>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onRowClicked(props, "edit")}
        >
          <FaEdit />
        </IconButton>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onRowClicked(props, "downloadAll")}
        >
          <FaDownload />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onRowClicked(props, "cancelTrx")}
        >
          <FaTrash />
        </IconButton>
      </>
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
  const getExcelColums = (excelType = "regular") => {
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
      castOffDateTime: "Cast Off Timing",
      totalHours: "Total Hours",
      pairWith: "Pair With",
      commandRankAndName: "CommandRank And Name",
      jobNo: "Job No",
      cost: "Cost",
      count: "Count",
      foc: "FOC",
    };

    // 2. Columns to exclude for restricted users or weekly export
    const exclude = ["jobNo", "cost", "count", "foc"];

    // 3. Additional columns specific to weekly export
    const weeklyAdd = {
      pairWith: "Pair With",
      commandAndRank: "Command Rank and Name",
    };

    // 4. Start with base mapping
    let cols = { ...base };

    // 5. Remove restricted columns for 'weekly' type or 'user' role
    if (excelType === "weekly" || role === "user") {
      cols = Object.fromEntries(
        Object.entries(cols).filter(([key]) => !exclude.includes(key))
      );
    }

    // 6. Add weekly-specific columns at the end for 'weekly' export type
    if (excelType === "weekly") {
      Object.assign(cols, weeklyAdd);
    }

    // 7. Return final mapping
    return cols;
  };

  const exportToExcel = (excelType = "regular") => {
    // 1. Define the mapping from data field name to desired Excel header name
    const columnMapping = getExcelColums(excelType);
    // Use the keys of the mapping as the columns to extract from the row data
    const exportColumns = Object.keys(columnMapping);

    // 2. Filter data and apply the new headers
    const mappedData = filteredData
      ?.filter((row) => row.isActive === 1)
      ?.map((row) => {
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
    const FileName =
      excelType === "regular"
        ? "TugJobDetails.xlsx"
        : "WeeklyTugActivitiesReport.xlsx";
    // Assuming saveAs is available (e.g., from file-saver library)
    saveAs(blob, FileName);
  };

  /**
   * Filters the list of columns based on the user's role.
   * If the user role is 'user', it excludes columns with field names:
   * 'jobNo', 'cost', 'count', 'foc', and 'isCanceled'.
   *
   * @param {Array<Object>} columns - The array of all column definitions.
   * @param {Object} userData - An object containing the user's role, e.g., { role: 'user' }.
   * @returns {Array<Object>} The filtered array of column definitions.
   */
  const getTableColoums = (columns) => {
    // Define the fields to be hidden for 'user' role
    const restrictedFields = ["jobNo", "cost", "count", "foc"];

    // Check the user's role
    const isUserRole = userData && userData?.role === "user";
    // If the user role is NOT 'user', return all columns
    if (!isUserRole) {
      return columns;
    }

    // If the user role IS 'user', filter out the restricted columns
    const filteredColumns = columns.filter((column) => {
      // The .includes() method checks if the column.field is in the restrictedFields array.
      // The '!' negates the result, meaning we keep the column ONLY if it's NOT restricted.
      return !restrictedFields.includes(column.field);
    });

    return filteredColumns;
  };

  const columns = [
    {
      headerName: "Date",
      field: "serviceDate",
      sortable: true,
      width: 120,
      maxWidth: 220,
    },
    {
      headerName: "Voucher No",
      field: "refNo",
      sortable: true,
      tooltipField: "refNo",
      width: 150,
      maxWidth: 250,
    },
    {
      headerName: "Location",
      field: "locationName",
      tooltipField: "locationName",
      sortable: true,
      width: 140,
      maxWidth: 300,
    },
    {
      headerName: "Mother Vessel",
      field: "motherVessel",
      tooltipField: "motherVessel",
      sortable: true,
      width: 150,
      maxWidth: 250,
    },
    {
      headerName: "Daughter Vessel",
      field: "vesselName",
      tooltipField: "vesselName",
      sortable: true,
      width: 160,
      maxWidth: 250,
    },
    {
      headerName: "Tug Name",
      field: "tugName",
      tooltipField: "tugName",
      sortable: true,
      width: 125,
      maxWidth: 220,
    },
    {
      headerName: "Type of Service",
      field: "serviceRemarks",
      tooltipField: "serviceRemarks",
      sortable: true,
      width: 180,
      maxWidth: 280,
    },
    {
      headerName: "Remarks",
      field: "remarks",
      tooltipField: "remarks",
      sortable: true,
      width: 200,
      maxWidth: 300,
    },
    {
      headerName: "Proceed Timing",
      field: "proceedDateTime",
      tooltipField: "proceedDateTime",
      sortable: true,
      width: 180,
      maxWidth: 250,
    },
    {
      headerName: "Cast Off Timing",
      field: "castOffDateTime",
      tooltipField: "castOffDateTime",
      sortable: true,
      width: 180,
      maxWidth: 250,
    },
    {
      headerName: "Total Hours",
      field: "totalHours",
      tooltipField: "totalHours",
      sortable: true,
      width: 130,
      maxWidth: 280,
    },
    {
      headerName: "Pair With",
      field: "pairWith",
      tooltipField: "pairWith",
      sortable: true,
      width: 130,
      maxWidth: 280,
    },
    {
      headerName: "Command Rank And Name",
      field: "commandRankAndName",
      tooltipField: "commandRankAndName",
      sortable: true,
      width: 230,
      maxWidth: 280,
    },
    {
      headerName: "Job No",
      field: "jobNo",
      tooltipField: "jobNo",
      sortable: true,
      width: 100,
      maxWidth: 220,
    },
    {
      headerName: "Cost",
      field: "cost",
      tooltipField: "cost",
      sortable: true,
      width: 100,
      maxWidth: 200,
    },
    {
      headerName: "Count",
      field: "count",
      tooltipField: "count",
      sortable: true,
      width: 100,
      maxWidth: 150,
    },
    {
      headerName: "FOC",
      field: "foc",
      tooltipField: "foc",
      sortable: true,
      width: 100,
      maxWidth: 120,
    },
    {
      headerName: "Status",
      field: "isCanceled",
      sortable: true,
      width: 100,
      maxWidth: 120,
    },
    {
      headerName: "Actions",
      field: "actions",
      sortable: false,
      filter: false,
      pinned: "right",
      width: 120,
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
    },
  ];

  const handleNavToServiceForm = () => {
    navigate("/tugservices");
  };

  const handleDownload = async (file) => {
    try {
      // Call API — now returns full response
      const response = await tugService.getfilesById(
        file?.documentId,
        TUG_SERVICES.DOWNLOAD_DOC_BY_ID
      );

      // Ensure valid blob
      if (!response || !response.data) {
        throw new Error("Empty file response from server");
      }

      // Extract headers
      const contentType =
        response.headers["content-type"] || "application/octet-stream";
      const contentDisposition = response.headers["content-disposition"];

      let fileName = file?.fileName || "downloaded_file";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) fileName = match[1];
      }

      // Create and trigger download
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("File download failed:", error);
    }
  };

  const getUploadedDocs = async (serviceId) => {
    if (!serviceId) return;
    try {
      const res = await tugService.getServiceById(
        serviceId,
        TUG_SERVICES.GET_UPLOADED_DOC_BY_ID
      );
      if (res?.length) {
        for (const file of res) {
          await handleDownload(file);
        }
      }
    } catch (err) {
      console.error("Error saving:", err);
      toast.error("Unable to save form");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value, data) => {
    setStatusFilter(value); // 1. Update the filter state
    let updatedData = data?.length ? data : originalData; // 2. ***START with the complete, original list***
    if (value !== "" && (value == "1" || value == "0")) {
      // 3. Filter the *original* list based on the selected status
      // Note: Assuming 'selected' is a string like "true" or "false"
      updatedData = updatedData.filter(
        (item) => String(item.isActive) === value
      );
    }
    setFilteredData(updatedData); // 4. Update the displayed/filtered list
  };

  return (
    <>
      <Loader show={loading} />
      <ToastContainer headerHeight={64} />
      <Box className="p-6">
        {/* Filter Bar */}
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          gap={2}
          sx={{
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "12px",
            backgroundColor: "#fff",
          }}
          className="flex-col sm:flex-row sm:flex-wrap"
        >
          {/* Search Input */}
          <TextField
            size="small"
            label="Search (Real-time)"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-[200px]"
          />

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-gray-300"></div>

          {/* Status Filter */}
          <FormControl
            size="small"
            variant="outlined"
            className="w-full sm:w-[180px]"
          >
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              label="Status"
              name="status"
              value={statusFilter}
              onChange={(e) => handleStatusChange(e?.target?.value, null)}
            >
              <MenuItem value="-1">All</MenuItem>
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="0">InActive</MenuItem>
            </Select>
          </FormControl>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-gray-300"></div>

          {/* Start Date */}
          <TextField
            size="small"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            slotProps={{
              htmlInput: { max: currentDate },
            }}
            className="w-full sm:w-[180px]"
          />

          {/* End Date */}
          <TextField
            size="small"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            slotProps={{
              htmlInput: { min: startDate || "" },
            }}
            className="w-full sm:w-[180px]"
          />

          {/* Search Button */}
          <Button
            variant="contained"
            size="medium"
            startIcon={<FaSearch size={14} />}
            onClick={handleDateFilter}
            className="bg-green-600 text-white w-full sm:w-[140px] hover:bg-green-700"
          >
            Search
          </Button>

          {/* Right Side Buttons */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:ml-auto gap-2">
            <Button
              variant="contained"
              size="medium"
              color="primary"
              onClick={handleNavToServiceForm}
              className="w-full sm:w-auto"
            >
              Create New Job
            </Button>

            <ListButton
              buttonLabel="Export Data"
              items={ExportMenuItems}
              buttonColor="indigo"
              className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
            />
          </div>
        </Box>

        {/* AG Grid Table */}
        <DataTable
          rowData={filteredData}
          sortable={true}
          filter={true}
          columnDefs={getTableColoums(columns)}
          quickFilterValue={search}
        />
      </Box>
      {/* Confirmation Modal */}
      <ConfirmModal
        open={openModal}
        onClose={handleCloseModal}
        onConfirm={onModelConfirmation}
        title={confirmModelInfo?.title}
        message={confirmModelInfo?.message}
        confirmButtonName={confirmModelInfo?.confirmButtonName}
        cancelButtonName={confirmModelInfo?.cancelButtonName}
      />
    </>
  );
};

export default Dashboard;
