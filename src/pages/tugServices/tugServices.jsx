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
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";

import { FaExclamationCircle } from "react-icons/fa";
import { locationService, vesselService } from "../../api/apiServices.js";
import axiosInstance from "../../api/axiosConfig.js";
import {tugServiceTimeline} from './sampleData.js';
import { toast } from '../../components/common/toster.jsx';
import ToastContainer from '../../components/common/toster.jsx';

export default function TugServices() {
  const [rows, setRows] = useState(tugServiceTimeline);
  
  // State for dropdown data
  const [locations, setLocations] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState({ locations: false, vessels: false });
  const [error, setError] = useState({ locations: null, vessels: null });
  
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
  });



  // Fetch locations data
  const fetchLocations = async () => {
    setLoading(prev => ({ ...prev, locations: true }));
    setError(prev => ({ ...prev, locations: null }));
    try {
      const data = await locationService.getAllLocations();
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError(prev => ({ ...prev, locations: error.message }));
      toast.error(`Failed to load locations: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  };

  // Fetch vessels data
  const fetchVessels = async () => {
    setLoading(prev => ({ ...prev, vessels: true }));
    setError(prev => ({ ...prev, vessels: null }));
    try {
      const data = await vesselService.getAllVessels();
      setVessels(data || []);
    } catch (error) {
      console.error('Error fetching vessels:', error);
      setError(prev => ({ ...prev, vessels: error.message }));
      toast.error(`Failed to load vessels: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, vessels: false }));
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLocations();
    fetchVessels();
  }, []);

  const addRow = () => {
    setRows([...rows, { dateTime: "", description: "" }]);
  };

  const updateRow = (index, key, value) => {
    setRows(prev => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  };

  const buildPayload = () => {
    const selectedLocationObj = locations.find(l => (l.id || l.locationId) === form.locationId);
    const selectedVesselObj = vessels.find(v => (v.id || v.vesselId) === form.vesselId);

    const activities = rows
      .filter(r => (r.dateTime && r.description))
      .map(r => {
        const [datePart, timePart] = (r.dateTime || "").split("T");
        return {
          activityDate: datePart || form.serviceDate,
          activityTime: (timePart || "").slice(0,5),
          description: r.description || ""
        };
      });

    return {
      refNo: form.refNo,
      serviceDate: form.serviceDate,
      locationId: form.locationId || null,
      locationName: (selectedLocationObj?.name || selectedLocationObj?.locationName || selectedLocationObj?.title || ""),
      vesselId: form.vesselId || null,
      vesselName: (selectedVesselObj?.name || selectedVesselObj?.vesselName || selectedVesselObj?.title || ""),
      imoCode: form.imoCode,
      vesselType: form.vesselType,
      lengthOverall: form.lengthOverall,
      draughtForward: form.draughtForward,
      draughtAft: form.draughtAft,
      serviceType: form.serviceType,
      serviceRemarks: form.serviceRemarks,
      remarks: form.remarks,
      isActive: form.isActive,
      activities: activities
    };
  };

  const handleSave = async () => {
    const payload = buildPayload();
    try {
      const response = await axiosInstance.post('/api/save', payload);
      toast.success('Saved!');
      console.log('Save response:', response?.data);
    } catch (err) {
      console.error('Error saving:', err);
      toast.error(`Save failed: ${err.response?.data?.message || err.message}`);
    }
  };

  // Single method to handle all form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Method to clear form and reset data
  const handleClear = () => {
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
    setRows(tugServiceTimeline);
    // Refetch data
    fetchLocations();
    fetchVessels();
    toast('Cleared and refreshed data!', { 
      duration: 2000,
      icon: '⚠️',
      style: {
        background: '#ff9800',
        color: '#fff',
      }
    });
  };

  return (
    <>
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
              InputProps={{ disableUnderline: true }}
            />
            <TextField
              size="small"
              label="Date:"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="standard"
              name="serviceDate"
              value={form.serviceDate}
              onChange={handleChange}
              InputProps={{ disableUnderline: true }}
            />
          </div>
        </div>
        <div className="flex-1 container mx-auto px-4 py-6 space-y-6">
          {/* Error Notification */}
          {(error.vessels || error.locations) && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-md">
              <div className="flex items-center">
                <FaExclamationCircle className="text-red-400 mr-2" style={{ fontSize: 20 }} />
                <p className="text-sm text-red-700">
                  Some data could not be loaded. Please check the fields marked with error icons.
                </p>
              </div>
            </div>
          )}
          
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
                      error={!!error.vessels}
                    >
                      <InputLabel id="vessel-label">
                        <div className="flex items-center gap-1">
                          Vessel Name
                          {error.vessels && (
                            <Tooltip title={error.vessels} arrow>
                              <FaExclamationCircle className="text-red-500" style={{ fontSize: 16 }} />
                            </Tooltip>
                          )}
                        </div>
                      </InputLabel>
                      <Select
                        labelId="vessel-label"
                        label="Vessel Name"
                        name="vesselId"
                        value={form.vesselId}
                        onChange={handleChange}
                        disabled={loading.vessels}
                      >
                        {loading.vessels ? (
                          <MenuItem value="" disabled>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                            Loading vessels...
                          </MenuItem>
                        ) : (
                          <>
                            <MenuItem value="">Select Vessel</MenuItem>
                            {vessels.map((vessel) => (
                              <MenuItem key={vessel.id || vessel.vesselId} value={vessel.id || vessel.vesselId}>
                                {vessel.name || vessel.vesselName || vessel.title}
                              </MenuItem>
                            ))}
                          </>
                        )}
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
                      error={!!error.locations}
                    >
                      <InputLabel id="location-label">
                        <div className="flex items-center gap-1">
                          Location
                          {error.locations && (
                            <Tooltip title={error.locations} arrow>
                              <FaExclamationCircle className="text-red-500" style={{ fontSize: 16 }} />
                            </Tooltip>
                          )}
                        </div>
                      </InputLabel>
                      <Select
                        labelId="location-label"
                        label="Location"
                        name="locationId"
                        value={form.locationId}
                        onChange={handleChange}
                        disabled={loading.locations}
                      >
                        {loading.locations ? (
                          <MenuItem value="" disabled>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                            Loading locations...
                          </MenuItem>
                        ) : (
                          <>
                            <MenuItem value="">Select Location</MenuItem>
                            {locations.map((location) => (
                              <MenuItem key={location.id || location.locationId} value={location.id || location.locationId}>
                                {location.name || location.locationName || location.title}
                              </MenuItem>
                            ))}
                          </>
                        )}
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
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ width: 120 }}>
                        <TextField
                          type="datetime-local"
                          size="small"
                          variant="outlined"
                          value={row.dateTime || ""}
                          style={{ minWidth: 120 }}
                          onChange={(e) => updateRow(index, 'dateTime', e.target.value)}
                        />
                      </TableCell>
                      <TableCell style={{ width: "80%" }}>
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
                          onChange={(e) => updateRow(index, 'description', e.target.value)}
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
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSave}
            >
              Save
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