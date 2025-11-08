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
import { toast } from "../../../components/common/toster.jsx";
import ToastContainer from "../../../components/common/toster.jsx";
import DataTable from "../../../components/common/DataTable";
import Loader from "@/components/Loader.jsx";
import { USER_MASTER } from "../../../api/apiConfig";
import { genericDataService } from "../../../api/apiServices.js";

const UserCreateForm = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    role: "",
    tugName: "",
    passwordHash: "",
    confirmPassword: "",
    isActive: 1,
    createdBy: "",
    createdDate: "",
    editedBy: "",
    editedDate: "",
    id: null,
    noOfHours: 4,
    packageCost: 2700,
    perHourCost: 670
  });
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const loginUserData = JSON.parse(localStorage.getItem("userData"));
  const [allUsersList, setAllUsersList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const roles = [
    { roleId: 1, roleName: "Admin", value: "Admin" },
    { roleId: 2, roleName: "user", value: 'user' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      let response = await genericDataService.getAllData(USER_MASTER.GET_ALL);
      response?.data?.forEach((item) => {      
        item.isActiveValue = item.isActive == 1 ? 'True' : 'False';
      });
      setLoading(false);
      setAllUsersList(response?.data);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setData({ ...data, [event.target.name]: event.target.value });
    setErrors({...errors, [event.target.name]: false});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Update data first
    const updatedData = { ...data, [name]: value };
    setData(updatedData);
    // Copy existing errors
    let updatedErrors = { ...errors, [name]: false };
    // Check if confirmPassword is being changed
    if (name === "confirmPassword" || name === "passwordHash") {
      if (updatedData.confirmPassword && updatedData.passwordHash !== updatedData.confirmPassword) {
        updatedErrors.confirmPassword = true;
      } else {
        updatedErrors.confirmPassword = false;
      }
    }
    // Update errors state
    setErrors(updatedErrors);
  };

  const handleReset = () => {
    setData({
      username: "",
      email: "",
      role: "",
      tugName: "",
      passwordHash: "",
      confirmPassword: "",
      isActive: 1,
      id: null,
      noOfHours: 4,
      packageCost: 2700,
      perHourCost: 670      
    });
    setSelectedRole("");
    setErrors({});
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    if (!data.username) {
      tempErrors.username = true;
      isValid = false;
    }
    // if (!data.email) {
    //   tempErrors.email = true;
    //   isValid = false;
    // }
    if (!data.role) {
      tempErrors.role = true;
      isValid = false;
    }
    if (!data.tugName) {
      tempErrors.tugName = true;
      isValid = false;
    }
    if (!data?.id && !data.passwordHash) {
      tempErrors.passwordHash = true;
      isValid = false;
    }
    if (!data?.id && !data.confirmPassword) {
      tempErrors.confirmPassword = true;
      isValid = false;
    }
    // if (!data.isActive) {
    //   tempErrors.isActive = true;
    //   isValid = false;
    // }
    setErrors(tempErrors);
    return isValid;
  };

  const handleDeactivate = async (props) => {
    try {
      if (props?.id) {
        setLoading(true);
        // Make sure response is properly declared
        const response = await genericDataService.updateData(
          USER_MASTER.UPDATE,
          props.id,
          { ...props, isActive: 0 } // ensure you're marking inactive
        );
        toast.success("User deactivated successfully");
        fetchData(); // usually fine to trigger reload before unsetting loading
      } else {
        toast.error("Invalid user data");
      }
    } catch (error) {
      console.error("Error in deactivate:", error);
      toast.error("Failed to deactivate user.");
    } finally {
      // Always stop loading — even if error occurs
      setLoading(false);
    }
  };

  const handleSaveOrUpdate = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
    data.createdBy = data?.id ? data?.createdBy : loginUserData?.username;
    data.createdDate = data?.id ? data?.createdDate : new Date().toISOString();
    data.editedBy = data?.id ? loginUserData?.username : "";
    data.editedDate = data?.id ? new Date().toISOString() : null;
    try {
      let response = null;
      if (data?.id) {
        setLoading(true);
        response = await genericDataService.updateData(
          USER_MASTER.UPDATE,
          data?.id,
          data
        );
        toast.success("User Updated successfully");
        setLoading(false);
        handleReset();
        fetchData();
      } else {
        setLoading(true);
        response = await genericDataService.saveData(USER_MASTER.CREATE, data);
        toast.success("User created successfully");
        setLoading(false);
        handleReset();
        fetchData();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error in handleSaveOrUpdate:", error);
      toast.error("Failed to create/Update user.");
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
    let payload = props?.data;
    if (type === "edit") {
      if (payload?.id) {
        const data = {
          ...payload,
          confirmPassword: payload?.passwordHash,
          noOfHours: payload?.noOfHours ?? 4,
          packageCost: payload?.packageCost ?? 2700,
          perHourCost: payload?.perHourCost ?? 670,
        };
        setData(data);
        setSelectedRole(data?.role);
      }
    } else {
      if (window.confirm("Are you sure you want to deactivate this record?")) {
        payload.isActive = 0;
        handleDeactivate(payload)
      }
    }
  };

  const columns = [
    { headerName: "Username", field: "username", sortable: true },
    { headerName: "Email", field: "email", sortable: true },
    { headerName: "Role", field: "role", sortable: true, minWidth: 60, maxWidth: 180 },
    { headerName: "TugName", field: "tugName", sortable: true },
    { headerName: "isActive", field: "isActiveValue", sortable: true, minWidth: 60, maxWidth: 180 },
    { field: "noOfHours", headerName: "No Of Hours", sortable: true },
    { field: "packageCost", headerName: "Package Cost", sortable: true },
    { field: "perHourCost", headerName: "Per Hour Cost", sortable: true },
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
    if(type === "passwordHash"){
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
                  error={errors.username}
                  disabled={data?.id}
                />
                <TextField
                  size="small"
                  fullWidth
                  label="Email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 gap-3">
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
                    value={selectedRole}
                    onChange={handleRoleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {roles.map((item) => (
                      <MenuItem key={item.roleId} value={item.value}>
                        {item.roleName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  fullWidth
                  label="TugName *"
                  name="tugName"
                  value={data.tugName}
                  onChange={handleChange}
                  error={errors.tugName}
                />
                </div>
              </div>
              {/* Row 2 */}
              <div className="grid  grid-cols-1 md:grid-cols-3 gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    size="small"
                    fullWidth
                    label="Password *"
                    name="passwordHash"
                    type={showPassword ? "text" : "password"}
                    value={data.passwordHash}
                    onChange={handleChange}
                    error={errors.passwordHash}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              className="focus:outline-none active:outline-none active:ring-0"
                              aria-label="toggle password visibility"
                              onClick={() =>
                                handleClickShowPassword("passwordHash")
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
                      error={errors.confirmPassword}
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
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    size="small"
                    fullWidth
                    label="No of Hours"
                    name="noOfHours"
                    value={data.noOfHours}
                    onChange={handleChange}
                    error={errors.noOfHours}
                  />                    
                  <TextField
                    size="small"
                    fullWidth
                    label="Package Cost"
                    name="packageCost"
                    value={data.packageCost}
                    onChange={handleChange}
                    error={errors.packageCost}
                  />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                  <TextField
                    size="small"
                    fullWidth
                    label="Per Hour Cost"
                    name="perHourCost"
                    value={data.perHourCost}
                    onChange={handleChange}
                    error={errors.perHourCost}
                  />
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.isActive == 1 ? true : false || data.isActive}
                      onChange={(e) =>
                        handleChange({
                          target: { name: "isActive", value: Number(e.target.checked) },
                        })
                      }
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Active"
                />
                </div>
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
