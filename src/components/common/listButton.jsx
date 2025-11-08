import React, { useState } from "react";
import { Menu, MenuItem, Button, Divider, ListItemIcon } from "@mui/material";
import { FaAngleDown } from "react-icons/fa";

/**
 * Reusable CustomMenu Component
 *
 * Combines MUI's Button & Menu components with Tailwind CSS styling.
 * Accepts a dynamic list of menu items and allows full customization of behavior and style.
 *
 * @param {string} buttonLabel - The text displayed on the button.
 * @param {Array} items - Array of menu items [{ label, icon, onClick, dividerAbove }]
 * @param {string} color - Tailwind color name (default: 'blue')
 * @param {string} variant - MUI button variant ('contained', 'outlined', 'text')
 */
const CustomMenu = ({ buttonLabel = "Options", items = [], variant = "contained", className="" }) => {
  // State to control menu open/close
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Open menu on button click
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  // Close menu
  const handleClose = () => setAnchorEl(null);

  return (
    <div className="inline-block">
      {/* MUI Button with Tailwind styling */}
      <Button
        variant={variant}
        endIcon={<FaAngleDown />}
        onClick={handleClick}
        className={className}
      >
        {buttonLabel}
      </Button>

      {/* MUI Menu Component */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Render menu items dynamically */}
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {/* Optional divider */}
            {item.dividerAbove && <Divider sx={{ my: 0.5 }} />}

            <MenuItem
              onClick={() => {
                handleClose();
                item.onClick && item.onClick(); // Trigger item action if provided
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              {/* Optional icon */}
              {item.icon && <ListItemIcon className="min-w-6 text-gray-500">{item.icon}</ListItemIcon>}
              {item.label}
            </MenuItem>
          </React.Fragment>
        ))}
      </Menu>
    </div>
  );
};

export default CustomMenu;
