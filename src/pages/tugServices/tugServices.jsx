import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextareaAutosize,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import {
  locationService,
  vesselService,
  tugService,
  typeOfService,
} from "../../api/apiServices.js";
import { defaultActivitiesList } from "./sampleData.js";
import { toast } from "../../components/common/toster.jsx";
import ToastContainer from "../../components/common/toster.jsx";
import Loader from "@/components/Loader.jsx";

export default function TugServices() {
  const [activities, setActivities] = useState(defaultActivitiesList);
  const { id } = useParams();
  const [locations, setLocations] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [motherVessels, setMotherVessels] = useState([]);
  const [typeOfServicesList, setTypeOfServicesList] = useState([]);
  const [defaultFormData, setDefaultFormData] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState("");
  const [selectedMotherVessel, setSelectedMotherVessel] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTypeOfService, setSelectedTypeOfService] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const userData = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchOnloadData();
  }, [id]);

  const [form, setForm] = useState({
    refNo: "",
    serviceDate: new Date().toISOString().slice(0, 10),
    locationId: "",
    vesselId: "",
    imoCode: "",
    vesselType: "",
    lengthOverall: "",
    draughtForward: "",
    draughtAft: "",
    serviceType: "",
    serviceRemarks: "",
    remarks: "",
    isActive: 1,
    serviceId: null,
    editedBy: "",
    editedDate: null,
    createdBy: "",
    createdDate: null,
    motherVessel: null,
    tugName: ''
  });

  const patchResponseData = (res) => {
    setForm(res);
    setDefaultFormData(res);
    setActivities(res?.activities);
    setSelectedVessel({
      vesselId: res?.vesselId,
      vesselName: res?.vesselName,
    });
    setSelectedMotherVessel({
      motherVessel: res?.motherVessel,
    });
    setSelectedLocation({
      locationId: res?.locationId,
      locationName: res?.locationName,
    });
    setSelectedTypeOfService({
      serviceType: res?.serviceType,
    });
    setErrors({}); // Clear errors on successful data load
  };

  const fetchSelectedData = async (id) => {
    setLoading(true);
    try {
      const res = await tugService.getServiceById(id);
      if (res?.serviceId) {
        patchResponseData(res);
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Unable to fetch service details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOnloadData = async () => {
    try {
      setLoading(true);
      const [locationsData, vesselsData, typeOfServicesData] =
        await Promise.all([
          locationService.getAllLocations(),
          vesselService.getAllVessels(),
          typeOfService.getAllTypeOfServices(),
        ]);
      setLocations(locationsData || []);
      const vessels = [];
      const motherVessels = [];
    
      vesselsData.forEach((item) => {
        if (Number(item.isMotherVessel) === 0) {
          vessels.push(item);
        } else {
          motherVessels.push(item);
        }
      });
    
      setVessels(vessels);
      setMotherVessels(motherVessels);
      setTypeOfServicesList(typeOfServicesData || []);
      if (id) {
        await fetchSelectedData(id);
      }
    } catch (error) {
      console.error("Error in fetchOnloadData:", error);
      toast.error("Failed to load master data.");
    } finally {
      setLoading(false);
    }
  };

  const addRow = () => {
    // Returns true if at least one activity has an empty or null date/time, otherwise false
    const hasInvalid = activities.some(
      (item) => !item?.activityDate || !item?.activityTime
    );
    if (hasInvalid) {
      toast("Can't proceed: Incomplete activity details found.", {
        duration: 4000,
        icon: "⚠️",
        style: {
          background: "#ff9800",
          color: "#fff",
        },
      });
      return;
    }
    setActivities([
      ...activities,
      { activityId: null, activityDate: "", activityTime: "", description: "" },
    ]);
  };

  const updateRow = (index, key, value) => {
    if (key === "activityTime") {
      value = `${value}:00`;
    }
    setActivities((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [key]: value } : r))
    );
  };

  const buildPayload = () => {
    return {
      refNo: form.refNo,
      serviceDate: form.serviceDate,
      locationId: selectedLocation?.locationId || null,
      locationName: selectedLocation?.locationName || "",
      vesselId: selectedVessel?.vesselId || null,
      vesselName: selectedVessel?.vesselName || "",
      imoCode: form.imoCode,
      vesselType: form.vesselType,
      lengthOverall: form.lengthOverall,
      draughtForward: form.draughtForward,
      draughtAft: form.draughtAft,
      serviceType: form.serviceType,
      serviceRemarks: form.serviceRemarks,
      remarks: form.remarks,
      isActive: form.isActive,
      activities: activities,
      serviceId: form.serviceId,
      editedBy: form?.serviceId ? userData?.username : "",
      editedDate: form?.serviceId ? new Date().toISOString() : null,
      createdBy: form?.serviceId ? form?.createdBy : userData?.username,
      createdDate: form?.serviceId ? form?.createdDate : new Date().toISOString(),
      motherVessel: form.motherVessel,
      tugName: form?.serviceId ? form?.tugName : userData?.tugName
    };
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!form.refNo) {
      tempErrors.refNo = true;
      isValid = false;
    }
    if (!selectedLocation?.locationId) {
      tempErrors.locationId = true;
      isValid = false;
    }
    if (!selectedVessel?.vesselName) {
      tempErrors.vesselName = true;
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSave = async () => {
    const payload = buildPayload();
    if (!validateForm()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
    setLoading(true);

    try {
      if (payload?.serviceId) {
        const res = await tugService.updateService(payload.serviceId, payload);
        toast.success("Updated successfully");
        patchResponseData(res);
      } else {
        const res = await tugService.createService(payload);
        const newId = res?.serviceId;
        toast.success("Saved successfully", { duration: 2000 });
        navigate(`/tugservices/${newId}`);
        patchResponseData(res);
      }
    } catch (err) {
      console.error("Error saving:", err);
      toast.error("Unable to save form");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "refNo" && value) {
      setErrors({ ...errors, refNo: false });
    }
  };

  const handleClearOrNewForm = () => {
    navigate("/tugservices/");
    setForm({
      refNo: "",
      serviceDate: new Date().toISOString().slice(0, 10),
      locationId: "",
      vesselId: "",
      imoCode: "",
      vesselType: "",
      lengthOverall: "",
      draughtForward: "",
      draughtAft: "",
      serviceType: "",
      serviceRemarks: "",
      remarks: "",
      isActive: 1,
      editedBy: "",
      editedDate: null,
      createdBy: userData?.username,
      createdDate: new Date().toISOString(),
      serviceId: null,
      locationName: "",
      vesselName: "",
      motherVessel: null,
      tugName: ""
    });
    setActivities(defaultActivitiesList);
    setSelectedLocation("");
    setSelectedVessel("");
    setSelectedMotherVessel("");
    setSelectedTypeOfService("");
    toast.success("Form cleared. Ready for new entry!");
  };

  const handleClearOrReset = () => {
    if (form?.serviceId) {
      setForm(defaultFormData);
      setActivities(defaultFormData?.activities || defaultActivitiesList);
      setSelectedLocation({
        locationId: defaultFormData?.locationId,
        locationName: defaultFormData?.locationName,
      });
      setSelectedVessel({
        vesselId: defaultFormData?.vesselId,
        vesselName: defaultFormData?.vesselName,
      });
      setSelectedMotherVessel({
        motherVessel: defaultFormData?.motherVessel,
      });
      setSelectedTypeOfService({
        serviceType: defaultFormData?.serviceType,
      });
      toast.success("Changes reverted. Initial data restored successfully!");
      setErrors({}); // Clear errors on reset
    } else {
      handleClearOrNewForm();
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (name === "locationId") {
      const locationData = locations.find((v) => v.locationId === value);
      setSelectedLocation({
        locationId: locationData?.locationId,
        locationName: locationData?.locationName,
      });
      setForm((prev) => ({ ...prev, locationId: value })); // Update form state
      setErrors({ ...errors, locationId: false });
    } else if (name === "vesselId") {
      const vesselData = vessels.find((v) => v.vesselId === value);
      setSelectedVessel({
        vesselId: vesselData.vesselId,
        vesselName: vesselData.vesselName,
      });
      setForm({
        ...form,
        vesselId: vesselData?.vesselId, // Update form state
        imoCode: vesselData?.imoCode,
        vesselType: vesselData?.vesselType,
        draughtAft: vesselData?.arrDraft,
        lengthOverall: vesselData?.loa,
        draughtForward: vesselData?.dwt,
      });
    } else if (name === "motherVessel") {
      const motherVesselData = motherVessels.find((v) => v.vesselName === value);
      setSelectedMotherVessel({
        motherVessel: motherVesselData?.vesselName,
      });
      setForm({
        ...form,
        motherVessel: motherVesselData?.vesselName,
      });
    } else {
      const typeOfServiceData = typeOfServicesList.find(
        (v) => v.serviceTypeName === value
      );
      setSelectedTypeOfService({
        serviceType: typeOfServiceData?.serviceTypeName,
      });
      setForm((prev) => ({
        ...prev,
        serviceType: value,
        serviceRemarks: typeOfServiceData?.serviceTypeName,
      })); // Update form state
    }
  };

  const handleAutocompleteChange = (event, newValue) => {
    // If a new value is typed and doesn't exist in the list
    if (typeof newValue === "string") {
      const newVessel = {
        vesselId: null, // A simple way to generate a unique ID
        vesselName: newValue,
      };
      setVessels((prevVessels) => [...prevVessels, newVessel]);
      setSelectedVessel(newVessel);
      setErrors({ ...errors, vesselName: false });
    } else {
      setSelectedVessel(newValue);
      setErrors({ ...errors, vesselName: false });
    }
  };

  const renderOption = (props, option, { inputValue }) => {
    // Add the "Add [input value]" option if no match is found
    const isNew = !vessels.find((v) => v.vesselName === inputValue);
    if (isNew && option.vesselName === inputValue) {
      return <li {...props}>Add "{inputValue}"</li>;
    }
    return <li {...props}>{option.vesselName}</li>;
  };

  const deleteRow = (index) => {
    const updated = activities.filter((_, i) => i !== index);
    setActivities(updated);
  };

  return (
    <>
      <Loader show={loading} />
      <ToastContainer headerHeight={64} />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 w-full p-4">
          {/* Section 1 - Two Columns */}
          <Card>
            <CardContent>
              {/* 1st Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    size="small"
                    label="Ref Num: *"
                    name="refNo"
                    value={form.refNo}
                    onChange={handleChange}
                    error={errors.refNo}
                  />
                  <TextField
                    size="small"
                    label="Date:"
                    type="date"
                    name="serviceDate"
                    value={form.serviceDate}
                    onChange={handleChange}
                  />
                </div>
                {/* Vessel Name */}
                <Autocomplete
                  fullWidth
                  size="small"
                  value={selectedVessel}
                  onChange={handleAutocompleteChange}
                  options={vessels}
                  getOptionLabel={(option) => option.vesselName || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vessel Name *"
                      variant="outlined"
                      error={errors.vesselName}
                    />
                  )}
                  freeSolo
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  renderOption={renderOption}
                  filterOptions={(options, params) => {
                    const filtered = options.filter((option) =>
                      option.vesselName
                        .toLowerCase()
                        .includes(params.inputValue.toLowerCase())
                    );
                    if (params.inputValue !== "" && !filtered.length) {
                      filtered.push({
                        vesselId: null,
                        vesselName: params.inputValue,
                      });
                    }
                    return filtered;
                  }}
                />

                <div className="grid grid-cols-1 gap-3">
                  <FormControl
                    fullWidth
                    size="small"
                    variant="outlined"
                    error={errors.motherVessel}
                  >
                    <InputLabel id="motherVessel-label">
                      Mother Vessel
                    </InputLabel>
                    <Select
                      labelId="motherVessel-label"
                      label="Mother Vessel"
                      name="motherVessel"
                      value={selectedMotherVessel?.motherVessel || ""}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {motherVessels.map((item) => (
                        <MenuItem key={item.vesselName} value={item.vesselName}>
                          {item.vesselName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              {/* 2nd Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* IMO No */}
                  <TextField
                    size="small"
                    fullWidth
                    label="IMO No"
                    name="imoCode"
                    value={form.imoCode}
                    onChange={handleChange}
                  />

                  <TextField
                    size="small"
                    fullWidth
                    label="Type of Vessel"
                    name="vesselType"
                    value={form.vesselType}
                    onChange={handleChange}
                  />
                </div>
                {/* Location */}
                <div className="grid grid-cols-1 gap-3">
                  <FormControl
                    fullWidth
                    size="small"
                    variant="outlined"
                    error={errors.locationId}
                  >
                    <InputLabel id="location-label">Location *</InputLabel>
                    <Select
                      labelId="location-label"
                      label="Location *"
                      name="locationId"
                      value={selectedLocation?.locationId || ""}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {locations.map((item) => (
                        <MenuItem key={item.locationId} value={item.locationId}>
                          {item.locationName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    size="small"
                    fullWidth
                    label="Draught Fwd (M)"
                    name="draughtForward"
                    value={form.draughtForward}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="Draught Aft (M)"
                    name="draughtAft"
                    value={form.draughtAft}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* 3rd Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    size="small"
                    fullWidth
                    label="Length Overall (M)"
                    name="lengthOverall"
                    value={form.lengthOverall}
                    onChange={handleChange}
                  />
                  <FormControl
                    fullWidth
                    size="small"
                    variant="outlined"
                    error={errors.serviceTypeId}
                  >
                    <InputLabel id="typeOfService-label">
                      Type of Service *
                    </InputLabel>
                    <Select
                      labelId="typeOfService-label"
                      label="Type of Service *"
                      name="serviceTypeId"
                      value={selectedTypeOfService?.serviceType || ""}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {typeOfServicesList?.map((item) => (
                        <MenuItem
                          key={item.serviceTypeId}
                          value={item.serviceTypeName}
                        >
                          {item.serviceTypeName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <TextField
                  size="small"
                  fullWidth
                  label="Service Remarks"
                  multiline
                  rows={1}
                  name="serviceRemarks"
                  value={form.serviceRemarks}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 gap-3">
                  <TextField
                    size="small"
                    fullWidth
                    label="Remarks"
                    multiline
                    rows={1}
                    name="remarks"
                    value={form.remarks}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>

            {/* Section 3 */}
            <CardContent
              style={{
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                height: 300,
              }}
            >
              {/* Scrollable Table */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: 50 }}>S.No</TableCell>
                      <TableCell style={{ width: 120 }}>Date</TableCell>
                      <TableCell style={{ width: 100 }}>Time</TableCell>
                      <TableCell style={{ width: "65%" }}>
                        Description
                      </TableCell>
                      <TableCell style={{ width: 60, textAlign: "center" }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {activities.map((row, index) => (
                      <TableRow key={index} style={{ height: 48 }}>
                        <TableCell>
                          <span>{index + 1}</span>
                        </TableCell>
                        {/* Date */}
                        <TableCell>
                          <TextField
                            type="date"
                            size="small"
                            variant="outlined"
                            value={row.activityDate || ""}
                            onChange={(e) =>
                              updateRow(index, "activityDate", e.target.value)
                            }
                            style={{ minWidth: 120 }}
                          />
                        </TableCell>

                        {/* Time */}
                        <TableCell>
                          <TextField
                            type="time"
                            size="small"
                            variant="outlined"
                            value={row.activityTime || ""}
                            onChange={(e) =>
                              updateRow(index, "activityTime", e.target.value)
                            }
                            style={{ minWidth: 100 }}
                          />
                        </TableCell>

                        {/* Description */}
                        <TableCell>
                          <TextareaAutosize
                            minRows={1}
                            style={{
                              width: "100%",
                              fontSize: "0.875rem",
                              padding: "6px 10px",
                              borderRadius: 4,
                              border: "1px solid #c4c4c4",
                              resize: "vertical",
                            }}
                            placeholder="Enter description"
                            value={row.description}
                            onChange={(e) =>
                              updateRow(index, "description", e.target.value)
                            }
                          />
                        </TableCell>

                        {/* Delete Button */}
                        <TableCell align="center">
                          <Button
                            variant="transperent"
                            color="error"
                            size="small"
                            onClick={() => deleteRow(index)}
                          >
                            <FaTrash />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div style={{ paddingTop: "8px", borderTop: "1px solid #eee" }}>
                <div class="flex justify-between items-center">
                  <Button variant="outlined" size="small" onClick={addRow}>
                    Add New Row
                  </Button>
                  <div>
                    Total: {activities?.length.toString().padStart(2, "0")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 flex gap-2 justify-center">
            {form?.serviceId && (
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={handleClearOrNewForm}
              >
                Create New Form
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={handleClearOrReset}
            >
              {form?.serviceId ? "Reset" : "Clear"}
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSave}
            >
              {form?.serviceId ? "Update" : "Save"}
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => window.print()}
            >
              Print
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
