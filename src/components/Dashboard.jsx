import React, { useState,useEffect } from "react";
import { FaSearch, FaFilter, FaSort, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Box, TextField, MenuItem, IconButton, InputAdornment } from "@mui/material";
import DataTable from "./common/DataTable";
import {tugService} from "../api/apiServices";
import Loader from "@/components/Loader.jsx";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await tugService.getAllServices();
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

  const handleSearch=(value)=>{
    console.log(value)
    gridApi.setQuickFilter(value);
  }

  // Quick stats data
  const columns = [
    { headerName: "Vessel Name", field: "vesselName", sortable: true, flex: 1 },
    { headerName: "Vessel Type", field: "vesselType", sortable: true, flex: 1 },
    { headerName: "Imo Code", field: "imoCode", sortable: true, flex: 1 },
    { headerName: "Service Type", field: "serviceType", sortable: true, flex: 1 },
    { headerName: "Service Date", field: "serviceDate", sortable: true, flex: 1 },
    { headerName: "Service Remarks", field: "serviceRemarks", sortable: true, flex: 1 },
    { headerName: "Draught Aft", field: "draughtAft", sortable: true, flex: 1 },
    { headerName: "Draught Forward", field: "draughtForward", sortable: true, flex: 1 },
    { headerName: "Ref No", field: "refNo", sortable: true, flex: 1 },
    { headerName: "Remarks", field: "remarks", sortable: true, flex: 1 },
    {
      headerName: "Actions",
      field: "actions",
      flex: 1,
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
        filter={false}
        columnDefs={columns}
        onGridReady={onGridReady}
      />
      </Box>
      </>
  );
};

export default Dashboard;
