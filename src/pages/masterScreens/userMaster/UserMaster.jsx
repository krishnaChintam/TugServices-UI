import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt,FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Box,
  IconButton,
  Button,
  TextField,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FormControlLabel, 
  Switch
} from "@mui/material";
import DataTable from "../../../components/common/DataTable";
import Loader from "@/components/Loader.jsx";
import ToastContainer from "../../../components/common/toster.jsx";
import { USER_MASTER } from "../../../api/apiConfig";
import { genericDataService } from "../../../api/apiServices.js";

const UserCreateForm = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    role: "",
    tugName: "",
    password: "",
    confirmPassword: "",
    isActive: true,
    createdBy: "",
    createdDate: "",
    editedBy: "",
    editedDate: "",
  });
  //   const [roles, setRoles] = useState([]);
  //   const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const loginUserData = JSON.parse(localStorage.getItem("userData"));
  const [allUsersList, setAllUsersList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const roles = [
    { roleId: 1, roleName: "Admin" },
    { roleId: 2, roleName: "User" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await genericDataService.getAllData(USER_MASTER.GET_ALL);
      setLoading(false);
      console.log(response?.data);
      setAllUsersList(response?.data);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleRoleChange = (event) => {
    // setSelectedRole(event.target.value);
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleReset = () => {
    setData({
      username: "",
      email: "",
      role: "",
      tugName: "",
      password: "",
      confirmPassword: "",
      isActive: true
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    if (!data.username) {
      tempErrors.username = true;
      isValid = false;
    }
    if (!data.email) {
      tempErrors.email = true;
      isValid = false;
    }
    if (!data.role) {
      tempErrors.role = true;
      isValid = false;
    }
    if (!data.tugName) {
      tempErrors.tugName = true;
      isValid = false;
    }
    if (!data.password) {
      tempErrors.password = true;
      isValid = false;
    }
    if (!data.confirmPassword) {
      tempErrors.confirmPassword = true;
      isValid = false;
    }
    if (!data.isActive) {
      tempErrors.isActive = true;
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const handleSaveOrUpdate = async (props) => {
    if (!validateForm()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
    // let payload = 
    data.createdBy = data?.id ? data?.createdBy : loginUserData?.username;
    data.createdDate = data?.id ? data?.createdDate : new Date().toISOString();
    data.editedBy = data?.id ? loginUserData?.username : "";
    data.editedDate = data?.id ? new Date().toISOString() : null;
    console.log(data);
    setLoading(true);
    try {
      let response = null;
      if (data?.id) {
        response = await genericDataService.updateData(
          USER_MASTER.UPDATE,
          data
        );
        toast.success("User Updated successfully");
        setLoading(false);
      } else {
        response = await genericDataService.saveData(USER_MASTER.CREATE, data);
        toast.success("User created successfully");
        setLoading(false);
      }
      console.log(response);
    } catch (error) {
      console.error("Error in handleSaveOrUpdate:", error);
      toast.error("Failed to create/Update user.");
      setLoading(false);
    }
  };

  const ActionRenderer = (props) => {
    return (
        <>
         <div className="grid grid-cols-2 gap-3">
      <IconButton
        size="small"
        color="primary"
        onClick={() => onRowClicked(props,'edit')}
      >
        <FaEdit />
      </IconButton>
      
      <IconButton
        size="small"
        color="error"
        onClick={() => onRowClicked(props,'delete')}
      >
        <FaTrashAlt />
      </IconButton>
      </div>
      </>
    );
  };

  const onRowClicked = (props,type) => {
    let data = props?.data;
    if(type === 'edit'){
    if (data?.id) {
      setData(data);
    }
}else{
    window.alert('Confirmation to delete');
    data.isActive = 0; // 0 indicates InActive
    handleSaveOrUpdate(data)
}
  };

  const columns = [
    { headerName: "Username", field: "username", sortable: true },
    { headerName: "Email", field: "email", sortable: true },
    { headerName: "Role", field: "role", sortable: true },
    { headerName: "TugName", field: "tugName", sortable: true },
    { headerName: "isActive", field: "isActive", sortable: true },
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

  const handleClickShowPassword = (type) => {
    // Toggle the state
    if(type === "password"){
      setShowPassword((prev) => !prev);
    }else{
      setConfirmPassword((prev)=> !prev);
    }
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
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3  mb-4">
                <TextField
                  size="small"
                  fullWidth
                  label="UserName *"
                  name="username"
                  value={data.username}
                  onChange={handleChange}
                />
                <TextField
                  size="small"
                  fullWidth
                  label="Email *"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                />
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={errors.role}
                >
                  <InputLabel id="role-label">Role *</InputLabel>
                  <Select
                    labelId="role-label"
                    label="Role *"
                    name="role"
                    value={data.role || ""}
                    onChange={handleRoleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {roles.map((item) => (
                      <MenuItem key={item.roleId} value={item.roleId}>
                        {item.roleName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {/* Row 2 */}
              <div className="grid  grid-cols-1 md:grid-cols-3 gap-3">
                <TextField
                  size="small"
                  fullWidth
                  label="TugName *"
                  name="tugName"
                  value={data.tugName}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    size="small"
                    fullWidth
                    label="Password *"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              className="focus:outline-none active:outline-none active:ring-0"
                              aria-label="toggle password visibility"
                              onClick={() =>
                                handleClickShowPassword("password")
                              }
                              size="m"
                              // onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="Confirm Password *"
                    name="confirmPassword"
                    type={confirmPassword ? "text" : "password"}
                    value={data.confirmPassword}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              className="focus:outline-none active:outline-none active:ring-0"
                              aria-label="toggle confirmPassword visibility"
                              onClick={() =>
                                handleClickShowPassword("confirmPassword")
                              }
                              size="m"
                              // onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {confirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.isActive}
                      onChange={(e) =>
                        handleChange({
                          target: { name: "isActive", value: e.target.checked },
                        })
                      }
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Active"
                />
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleSaveOrUpdate}
                >
                  {data?.id ? "Update" : "Save"}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={handleReset}
                >
                  {data?.id ? "Clear" : "Reset"}
                </Button>
              </div>
              <div className="mt-4">
                {/* AG Grid Table */}
                <DataTable
                  rowData={allUsersList}
                  sortable={true}
                  filter={true}
                  columnDefs={columns}
                  height="60vh"
                  // quickFilterValue={""}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UserCreateForm;
