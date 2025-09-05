import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
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
  IconButton,
  InputLabel,
  FormControl,
} from "@mui/material";
const sampleRows = [
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
export default function TugServices() {
  const [rows, setRows] = useState(sampleRows);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });


  const handleToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const addRow = () => {
    setRows([...rows, { dateTime: "", description: "" }]);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="container mx-auto px-4 pt-6">
          <div className="flex flex-row gap-4 items-center">
            <TextField
              size="small"
              label="Ref Num:"
              variant="standard"
              value="REF-00123" // Set your reference number here
              InputProps={{ readOnly: true, disableUnderline: true }}
            />
            <TextField
              size="small"
              label="Date:"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="standard"
              value={new Date().toISOString().slice(0, 10)}
              InputProps={{ readOnly: true, disableUnderline: true }}
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

                    <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel id="vessel-label">Vessel Name</InputLabel>
                      <Select
                        labelId="vessel-label"
                        label="Vessel Name"
                        defaultValue=""
                      >
                        <MenuItem value="">Select Vessel</MenuItem>
                        <MenuItem value="1">Vessel 1</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <TextField size="small" fullWidth label="Length Overall (M)" />
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div>
                    <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel id="location-label">Location</InputLabel>
                      <Select
                        labelId="location-label"
                        label="Location"
                        defaultValue=""
                      >
                        <MenuItem value="">Select Location</MenuItem>
                        <MenuItem value="1">Location 1</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <TextField size="small" fullWidth label="Draught (M)" />
                </div>

                <div className="space-y-3">
                  <div>
                    <TextField size="small" fullWidth label="IMO No" />
                  </div>
                  <TextField size="small" fullWidth label="Type of Vessel" />
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
                    defaultValue=""
                  >
                    <MenuItem value="">Select Service</MenuItem>
                    <MenuItem value="1">Service 1</MenuItem>
                    <MenuItem value="2">Service 2</MenuItem>
                    <MenuItem value="3">Service 3</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  fullWidth
                  label="Service Remarks"
                  multiline
                  rows={1}
                  className="col-span-2"
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
                        // Add onChange if you want it editable
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
                          readOnly // Remove this if you want it editable
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
                value={""}
                readOnly // Remove this if you want it editable
              />
            </CardContent>
          </Card>

          <div className="mt-4 flex gap-2 justify-center">
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => {
                handleToast("Cleared!", "warning");
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => {
                handleToast("Saved!", "success");
              }}
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