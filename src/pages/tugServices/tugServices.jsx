// import React from "react";
// import {
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   Typography,
//   Paper,
// } from "@mui/material";

// export default function TugServices() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
//       {/* HEADER */}
//       <header className="flex items-center justify-between px-6 py-3 bg-white shadow">
//         <img
//           src="/logo192.png"
//           alt="Company Logo"
//           className="h-10 cursor-pointer"
//           onClick={() => window.location.href = "/"}
//         />
//         <Button variant="outlined" color="error">
//           Logout
//         </Button>
//       </header>

//       {/* BODY */}
//       <main className="flex-1 p-6 space-y-8 max-w-6xl mx-auto w-full">
//         {/* Section 1: Vessel Info */}
//         <Paper className="p-6">
//           <Typography variant="h6" className="mb-4 font-semibold">
//             Vessel Information
//           </Typography>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Left Column */}
//             <div className="space-y-4">
//               <TextField label="Vessel Name" select fullWidth size="small">
//                 <MenuItem value="">Select...</MenuItem>
//                 <MenuItem value="1">Vessel One</MenuItem>
//               </TextField>
//               <TextField label="Length Overall (M)" fullWidth size="small" />
//               <TextField label="Draught (M)" fullWidth size="small" />
//             </div>

//             {/* Right Column */}
//             <div className="space-y-4">
//               <TextField label="Location" select fullWidth size="small">
//                 <MenuItem value="">Select...</MenuItem>
//                 <MenuItem value="SG">Singapore</MenuItem>
//               </TextField>
//               <TextField label="IMO No" fullWidth size="small" />
//               <TextField label="Type of Vessel" fullWidth size="small" />
//             </div>
//           </div>
//         </Paper>

//         {/* Section 2: Service */}
//         <Paper className="p-6 space-y-4">
//           <Typography variant="h6" className="font-semibold">
//             Service Information
//           </Typography>
//           <TextField label="Type of Service" select fullWidth size="small">
//             <MenuItem value="">Select...</MenuItem>
//           </TextField>
//           <TextField
//             label="Service Remarks"
//             fullWidth
//             multiline
//             rows={3}
//             size="small"
//           />
//         </Paper>

//         {/* Section 3: Data Table */}
//         <Paper className="p-6 space-y-4">
//           <Typography variant="h6" className="font-semibold">
//             Service Records
//           </Typography>
//           <table className="min-w-full border text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2 border">Date</th>
//                 <th className="px-4 py-2 border">Time</th>
//                 <th className="px-4 py-2 border">Description</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Example row */}
//               <tr>
//                 <td className="border px-4 py-2">2025-08-17</td>
//                 <td className="border px-4 py-2">10:30</td>
//                 <td className="border px-4 py-2">Sample description</td>
//               </tr>
//             </tbody>
//           </table>
//           <Button variant="outlined" size="small">
//             Add New Row
//           </Button>
//         </Paper>

//         {/* Section 4: Remarks */}
//         <Paper className="p-6">
//           <Typography variant="h6" className="mb-4 font-semibold">
//             Remarks
//           </Typography>
//           <TextField
//             label="Remarks"
//             fullWidth
//             multiline
//             rows={5}
//             size="small"
//           />
//         </Paper>
//       </main>

//       {/* FOOTER */}
//       <footer className="flex justify-center gap-4 py-4 border-t bg-white">
//         <Button variant="contained" color="primary">
//           Save
//         </Button>
//         <Button variant="outlined" color="secondary">
//           Clear
//         </Button>
//         <Button variant="outlined">Print</Button>
//       </footer>
//     </div>
//   );
// }

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
  IconButton,
} from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";

export default function TugServices() {
  const [rows, setRows] = useState([{ date: "", time: "", description: "" }]);

  const addRow = () => {
    setRows([...rows, { date: "", time: "", description: "" }]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar className="flex justify-between">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="h-10 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          />
          <Button variant="outlined" color="error" size="small">
            Logout
          </Button>
        </Toolbar>
      </AppBar> */}

      {/* Body */}
      <div className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Section 1 - Two Columns */}
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Vessel Name
                  </label>
                  <Select size="small" fullWidth defaultValue="">
                    <MenuItem value="">Select Vessel</MenuItem>
                    <MenuItem value="1">Vessel 1</MenuItem>
                  </Select>
                </div>
                <TextField size="small" fullWidth label="Length Overall (M)" />
                <TextField size="small" fullWidth label="Draught (M)" />
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <Select size="small" fullWidth defaultValue="">
                    <MenuItem value="">Select Location</MenuItem>
                    <MenuItem value="1">Location 1</MenuItem>
                  </Select>
                </div>
                <TextField size="small" fullWidth label="IMO No" />
                <TextField size="small" fullWidth label="Type of Vessel" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 */}
        <Card>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Type of Service
              </label>
              <Select size="small" fullWidth defaultValue="">
                <MenuItem value="">Select Service</MenuItem>
                <MenuItem value="1">Service 1</MenuItem>
              </Select>
            </div>
            <TextField
              size="small"
              fullWidth
              label="Service Remarks"
              multiline
              rows={3}
            />
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
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        type="date"
                        size="small"
                        fullWidth
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="time"
                        size="small"
                        fullWidth
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        variant="outlined"
                        placeholder="Enter description"
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
            <TextField
              size="small"
              fullWidth
              label="Remarks"
              multiline
              rows={4}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

