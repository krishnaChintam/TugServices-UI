import React, { useEffect, useState } from "react";
import { Snackbar, Alert, LinearProgress } from "@mui/material";

export default function Toster({
  open,
  message,
  severity = "info",
  autoHideDuration = 2000,
  anchorOrigin = { vertical: "top", horizontal: "right" },
  onClose,
  headerHeight = 64, // default header height in px
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      sx={{ marginTop: `${headerHeight}px` }} // Add margin to avoid header
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: "100%", position: "relative", paddingBottom: "8px" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}