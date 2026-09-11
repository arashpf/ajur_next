// components/panel/new/modals/CloseModal.js
// Ported from NewWorker.js <CloseModal>
// Save / Delete / Cancel dialog.

import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const CloseModal = ({ isVisible, onCancel, onSave, onDelete }) => {
  return (
    <Dialog
      open={isVisible}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <WarningAmberIcon sx={{ fontSize: 60, color: "#ff6b6b" }} />
        <Typography
          sx={{
            fontFamily: "iransans, Arial, sans-serif",
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
            mt: 2,
          }}
        >
          خروج از صفحه
        </Typography>
        <Typography
          sx={{
            fontFamily: "iransans, Arial, sans-serif",
            fontSize: 15,
            color: "#666",
            textAlign: "center",
            mt: 1,
            mb: 3,
          }}
        >
          آیا می‌خواهید پیش‌نویس را ذخیره کنید یا حذف کنید؟
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          <Button
            onClick={onSave}
            sx={{
              flex: 1,
              minWidth: 100,
              backgroundColor: "#4CAF50",
              color: "white",
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 14,
              textTransform: "none",
              borderRadius: "10px",
              py: 1.25,
              "&:hover": { backgroundColor: "#43a047" },
            }}
          >
            ذخیره پیش‌نویس
          </Button>
          <Button
            onClick={onDelete}
            sx={{
              flex: 1,
              minWidth: 100,
              backgroundColor: "#ff6b6b",
              color: "white",
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 14,
              textTransform: "none",
              borderRadius: "10px",
              py: 1.25,
              "&:hover": { backgroundColor: "#e55c5c" },
            }}
          >
            حذف کامل
          </Button>
        </Box>

        <Button
          onClick={onCancel}
          fullWidth
          sx={{
            mt: 1.5,
            backgroundColor: "#e0e0e0",
            color: "#333",
            fontFamily: "iransans, Arial, sans-serif",
            fontSize: 14,
            textTransform: "none",
            borderRadius: "10px",
            py: 1.1,
            "&:hover": { backgroundColor: "#d0d0d0" },
          }}
        >
          انصراف
        </Button>
      </Box>
    </Dialog>
  );
};

export default CloseModal;