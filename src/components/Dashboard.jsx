import React, { useState,useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Box, TextField, MenuItem, IconButton, InputAdornment } from "@mui/material";
import DataTable from "./common/DataTable";
import {tugService} from "../api/apiServices";
import Loader from "@/components/Loader.jsx";
import { TUG_SERVICES } from '../api/apiConfig.js';

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // http://localhost:8080/tug-services/getByUsername/user
      const url = userData?.role === 'Admin' ? TUG_SERVICES.GET_ALL_SERVICES : `${TUG_SERVICES?.GET_SERVICE_BY_USERNAME}/${userData?.username}`
      const response = await tugService.getAllServices(url);
      setLoading(false);
      setData(response);
    };
    fetchData();
  }, []);

const onGridReady = (params) => {
  setGridApi(params.api);
};

  const onRowClicked = (props) =>{
    const data = props?.data;
    setSelectedItem(data);
    if (data?.serviceId) {
      navigate(`/tugservices/${data?.serviceId}`);
    }

  };

  const ActionRenderer = (props) => {
    return (
      <IconButton
        size="small"
        color="primary"
        onClick={()=>onRowClicked(props)}
      >
        <FaEdit />
      </IconButton>
    );
  };

  // Quick stats data
  const columns = [
    { headerName: "Date", field: "serviceDate", sortable: true, flex: 1 },
    { headerName: "Voucher No", field: "refNo", sortable: true, flex: 1 },
    { headerName: "Location", field: "location", sortable: true, flex: 1 },
    { headerName: "Mother Vessel", field: "motherVessel", sortable: true, flex: 1 },
    { headerName: "Doughter Vessel", field: "vesselName", sortable: true, flex: 1 },
    { headerName: "Tug Name", field: "tugName", sortable: true, flex: 1 },
    { headerName: "Type of Service", field: "serviceRemarks", sortable: true, flex: 1 },
    { headerName: "Remarks", field: "remarks", sortable: true, flex: 1 },
    {
      headerName: "Actions",
      field: "actions",
      flex: 1,
      pinned: "right", 
      width: 100,          // fixed width
      minWidth: 100,       // optional safeguard
      maxWidth: 120,       // optional safeguard
      cellRenderer: ActionRenderer
    },
  ]
  
  return (
  <>
   {/* The Loader will only be visible when the 'loading' state is true */}
   <Loader show={loading} />
    <Box className="p-6">
    {/* <Box className="flex justify-between items-center mb-4">
        <TextField
          size="small"
          placeholder="Search a product"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch className="text-gray-500" />
              </InputAdornment>
            ),
          }}
          className="w-1/3"
        />

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
        </Box> */}
      <DataTable
        rowData={data}
        sortable={true}
        filter={true}
        columnDefs={columns}
        onGridReady={onGridReady}
      />
      </Box>
      </>
  );
};

export default Dashboard;
