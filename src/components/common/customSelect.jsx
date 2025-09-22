import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

const CustomSelect = ({
  isDisabled = false,
  isMulti = false,
  name,
  onChange,
  options = [],
  placeholder = "Select...",
  value,
  label = "Select",
  width = 300,
}) => {
  return (
    <FormControl sx={{ m: 1, width }} disabled={isDisabled}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={`${name}-select`}
        multiple={isMulti}
        name={name}
        value={value || (isMulti ? [] : "")}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        displayEmpty
      >
        {/* Placeholder */}
        {!isMulti && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}

        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
