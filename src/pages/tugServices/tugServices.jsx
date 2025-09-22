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
  FormHelperText,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { locationService, vesselService, tugService } from "../../api/apiServices.js";
import { defaultActivitiesList } from './sampleData.js';
import { toast } from '../../components/common/toster.jsx';
import ToastContainer from '../../components/common/toster.jsx';
import Loader from "@/components/Loader.jsx";

export default function TugServices() {
  const [activities, setActivities] = useState(defaultActivitiesList);
  const { id } = useParams();
  const [locations, setLocations] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [defaultFormData, setDefaultFormData] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
  });

  const patchResponseData = (res) => {
    setForm(res);
    setDefaultFormData(res);
    setActivities(res?.activities);
    setSelectedVessel({
      vesselId: res?.vesselId,
      vesselName: res?.vesselName,
    });
    setSelectedLocation({
      locationId: res?.locationId,
      locationName: res?.locationName,
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
      console.error('Error fetching service:', error);
      toast.error("Unable to fetch service details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOnloadData = async () => {
    try {
      setLoading(true);
      const [locationsData, vesselsData] = await Promise.all([
        locationService.getAllLocations(),
        vesselService.getAllVessels(),
      ]);
      setLocations(locationsData || []);
      setVessels(vesselsData || []);
      if (id) {
        await fetchSelectedData(id);
      }
    } catch (error) {
      console.error('Error in fetchOnloadData:', error);
      toast.error("Failed to load master data.");
    } finally {
      setLoading(false);
    }
  };

  const addRow = () => {
    setActivities([...activities, { activityId: null, activityDate: "", activityTime: '', description: '' }]);
  };

  const updateRow = (index, key, value) => {
    setActivities(prev => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
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
    if (!selectedVessel?.vesselId) {
      tempErrors.vesselId = true;
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    const payload = buildPayload();
    setLoading(true);

    try {
      if (payload?.serviceId) {
        const res = await tugService.updateService(payload.serviceId, payload);
        toast.success('Updated successfully');
        patchResponseData(res);
      } else {
        const res = await tugService.createService(payload);
        const newId = res?.serviceId;
        toast.success('Saved successfully', { duration: 2000 });
        navigate(`/tugservices/${newId}`);
        patchResponseData(res);
      }
    } catch (err) {
      console.error('Error saving:', err);
      toast.error("Unable to save form");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
    } else {
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
      });
      setActivities(defaultActivitiesList);
      setSelectedLocation("");
      setSelectedVessel("");
    }
    setErrors({}); // Clear errors on reset
    toast('Cleared and refreshed data!', {
      duration: 2000,
      icon: '⚠️',
      style: {
        background: '#ff9800',
        color: '#fff',
      }
    });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (name === 'locationId') {
      const locationData = locations.find((v) => v.locationId === value);
      setSelectedLocation({
        locationId: locationData?.locationId,
        locationName: locationData?.locationName,
      });
      setForm(prev => ({ ...prev, locationId: value })); // Update form state
    } else {
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
    }
  };

  return (
    <>
      <Loader show={loading} />
      <ToastContainer headerHeight={64} />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="container mx-auto px-4 pt-6">
          <div className="flex flex-row gap-4 items-center">
            <TextField
              size="small"
              label="Ref Num: *"
              variant="standard"
              name="refNo"
              value={form.refNo}
              onChange={handleChange}
              error={errors.refNo}
            />
            <TextField
              size="small"
              label="Date:"
              type="date"
              variant="standard"
              name="serviceDate"
              value={form.serviceDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex-1 container mx-auto px-4 py-6 space-y-6">
          {/* Section 1 - Two Columns */}
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <FormControl
                    fullWidth
                    size="small"
                    variant="outlined"
                    error={errors.vesselId}
                  >
                    <InputLabel id="vessel-label">
                      <div className="flex items-center gap-1">
                        Vessel Name *
                      </div>
                    </InputLabel>
                    <Select
                      labelId="vessel-label"
                      label="Vessel Name *"
                      name="vesselId"
                      value={selectedVessel?.vesselId || ''}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {vessels.map((item) => (
                        <MenuItem key={item.vesselId} value={item.vesselId}>
                          {item.vesselName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField size="small" fullWidth label="Length Overall (M)" name="lengthOverall" value={form.lengthOverall} onChange={handleChange} />
                </div>
                <div className="space-y-3">
                  <FormControl
                    fullWidth
                    size="small"
                    variant="outlined"
                    error={errors.locationId}
                  >
                    <InputLabel id="location-label">
                      <div className="flex items-center gap-1">
                        Location *
                      </div>
                    </InputLabel>
                    <Select
                      labelId="location-label"
                      label="Location *"
                      name="locationId"
                      value={selectedLocation?.locationId || ''}
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
                  <div className="grid grid-cols-2 gap-3">
                    <TextField size="small" fullWidth label="Draught Fwd (M)" name="draughtForward" value={form.draughtForward} onChange={handleChange} />
                    <TextField size="small" fullWidth label="Draught Aft (M)" name="draughtAft" value={form.draughtAft} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-3">
                  <TextField size="small" fullWidth label="IMO No" name="imoCode" value={form.imoCode} onChange={handleChange} />
                  <TextField size="small" fullWidth label="Type of Vessel" name="vesselType" value={form.vesselType} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-6">
                <FormControl fullWidth size="small" variant="outlined" className="col-span-1">
                  <InputLabel id="typeOfService-label">Type of Service</InputLabel>
                  <Select
                    labelId="typeOfService-label"
                    label="Type of Service"
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select Service</MenuItem>
                    <MenuItem value="BERTHING">Berthing</MenuItem>
                    <MenuItem value="UNBERTHING">Unberthing</MenuItem>
                    <MenuItem value="SHIFTING">Shifting</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  fullWidth
                  label="Service Remarks"
                  multiline
                  rows={1}
                  className="col-span-2"
                  name="serviceRemarks"
                  value={form.serviceRemarks}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activities.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ width: 120 }}>
                        <TextField
                          type="date"
                          size="small"
                          variant="outlined"
                          value={row.activityDate || ""}
                          style={{ minWidth: 120 }}
                          onChange={(e) => updateRow(index, "activityDate", e.target.value)}
                        />
                      </TableCell>
                      <TableCell style={{ width: 100 }}>
                        <TextField
                          type="time"
                          size="small"
                          variant="outlined"
                          value={row.activityTime || ""}
                          style={{ minWidth: 100 }}
                          onChange={(e) => updateRow(index, "activityTime", e.target.value)}
                        />
                      </TableCell>

                      {/* Description */}
                      <TableCell style={{ width: "70%" }}>
                        <TextareaAutosize
                          minRows={1}
                          style={{
                            width: "100%",
                            fontSize: "0.875rem",
                            padding: "8.5px 14px",
                            borderRadius: 4,
                            border: "1px solid #c4c4c4",
                            resize: "vertical",
                          }}
                          placeholder="Enter description"
                          value={row.description}
                          onChange={(e) => updateRow(index, "description", e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={addRow}
                >
                  Add New Row
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card>
            <CardContent>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: "#333",
                }}
              >
                Remarks
              </label>
              <TextareaAutosize
                minRows={1}
                style={{
                  width: "100%",
                  fontSize: "0.875rem",
                  padding: "8.5px 14px",
                  borderRadius: 4,
                  border: "1px solid #c4c4c4",
                  resize: "vertical",
                }}
                placeholder="Enter Remarks"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
              />
            </CardContent>
          </Card>
          <div className="mt-4 flex gap-2 justify-center">
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