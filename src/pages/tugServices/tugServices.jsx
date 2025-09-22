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
} from "@mui/material";
import { useParams } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import { locationService, vesselService } from "../../api/apiServices.js";
import { defaultActivitiesList } from './sampleData.js';
import { toast } from '../../components/common/toster.jsx';
import ToastContainer from '../../components/common/toster.jsx';
import { tugService } from "../../api/apiServices.js";
import Loader from "@/components/Loader.jsx";

export default function TugServices() {
  const [activities, setActivities] = useState(defaultActivitiesList);
  const { id } = useParams();
  // State for dropdown data
  const [locations, setLocations] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [defaultFormData, setDefaultFormData] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false);
  // Use this new function in useEffect
  useEffect(() => {
    fetchOnloadData();
  }, [id]);

  // Single form state holding all payload fields
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

  const patchResponseData =(res)=>{
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
        })
  }

  const fetchSelectedData = async (id) => {
    setLoading(true);
    const response = await tugService.getServiceById(id).then((res) => {
      if (res?.serviceId) {
        setLoading(false);
        patchResponseData(res);
      }
    }, (error) => {
      setLoading(false);
      console.log(error)
    })
  }

  const fetchOnloadData = async () => {
    try {
      setLoading(true);
      // Run master API calls concurrently and wait for both to complete
      const [locationsData, vesselsData] = await Promise.all([
        locationService.getAllLocations(), // Call the service directly
        vesselService.getAllVessels()      // Call the service directly
      ]);
      // Update state with the fetched data
      setLocations(locationsData || []);
      setVessels(vesselsData || []);
      setLoading(false);
      if (id) {
        await fetchSelectedData(id, locationsData, vesselsData);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error in fetchOnloadData:', error);
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
      serviceId: form.serviceId
    };
  };

  const handleSave = async () => {
    const payload = buildPayload();
    if(payload?.serviceId){
    await tugService.updateService(payload?.serviceId,payload).then((res) => {
      toast.success('Updated successfully');
      console.log('Update response:', res?.data);
      patchResponseData(res);
    }, (error) => {
      console.error('Error saving:', err);
      toast.error("Unable to save form");
    });
    }else{
    await tugService.createService(payload).then((res) => {
      const newId = res?.serviceId;
      toast.success('Saved successfully');
      navigate(`/tugservices/${newId}`);
      patchResponseData(res);

      console.log('Save response:', res?.data);
    }, (error) => {
      console.error('Error saving:', err);
      toast.error("Unable to save form");
    });
  }
  };

  // Single method to handle all form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Method to clear form and reset data
  const handleClearOrReset = () => {
    if (form?.serviceId) {
      setForm(defaultFormData);
      return;
    }
    // Clear form data
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
      })
    } else {
      const vesselData = vessels.find((v) => v.vesselId === value);
      setSelectedVessel({
        vesselId: vesselData.vesselId,
        vesselName: vesselData.vesselName,
      });
    }

  };

  return (
    <>
    {/* The Loader will only be visible when the 'loading' state is true */}
    <Loader show={loading} />
      <ToastContainer headerHeight={64} />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="container mx-auto px-4 pt-6">
          <div className="flex flex-row gap-4 items-center">
            <TextField
              size="small"
              label="Ref Num:"
              variant="standard"
              name="refNo"
              value={form.refNo}
              onChange={handleChange}
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
                {/* Left Column */}
                <div className="space-y-3">
                  <div>
                    <FormControl
                      fullWidth
                      size="small"
                      variant="outlined"
                    >
                      <InputLabel id="vessel-label">
                        <div className="flex items-center gap-1">
                          Vessel Name
                        </div>
                      </InputLabel>
                      <Select
                        labelId="vessel-label"
                        label="Vessel Name"
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
                  </div>
                  <TextField size="small" fullWidth label="Length Overall (M)" name="lengthOverall" value={form.lengthOverall} onChange={handleChange} />
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div>
                    <FormControl
                      fullWidth
                      size="small"
                      variant="outlined"
                    >
                      <InputLabel id="location-label">
                        <div className="flex items-center gap-1">
                          Location
                        </div>
                      </InputLabel>
                      <Select
                        labelId="location-label"
                        label="Location"
                        name="locationId"
                        value={selectedLocation?.locationId || ''}
                        onChange={handleSelectChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {/* Map through the locations array to create the dropdown options */}
                        {locations.map((item) => (
                          <MenuItem key={item.locationId} value={item.locationId}>
                            {item.locationName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <TextField size="small" fullWidth label="Draught Fwd (M)" name="draughtForward" value={form.draughtForward} onChange={handleChange} />
                    <TextField size="small" fullWidth label="Draught Aft (M)" name="draughtAft" value={form.draughtAft} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <TextField size="small" fullWidth label="IMO No" name="imoCode" value={form.imoCode} onChange={handleChange} />
                  </div>
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
                    <TableCell>Date Time</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activities.map((row, index) => (
                    <TableRow key={index}>
                      {/* Date field */}
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

                      {/* Time field */}
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
                  // startIcon={<AddIcon />}
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