import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";

/**
 * Reusable MUI-only confirmation modal.
 * @param {boolean} open - Controls modal visibility
 * @param {function} onClose - Close modal handler
 * @param {function} onConfirm - Confirm action handler
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 */
const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  cancelButtonName,
  confirmButtonName,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          width: { xs: "90%", sm: 420 },
          p: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            // pb: 1.5,
            mb: 2,
          }}
        >
          <Typography
            id="confirm-modal-title"
            // variant="h6"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            <FaTimes />
          </IconButton>
        </Box>

        {/* Body */}
        <Typography
          id="confirm-modal-description"
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          {message}
        </Typography>

        {/* Footer */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose} size="small">
            {cancelButtonName}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            size="small"
          >
            {confirmButtonName}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
