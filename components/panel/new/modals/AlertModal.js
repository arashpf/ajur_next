// components/panel/new/modals/AlertModal.js
// Ported from NewWorker.js <AlertModal>

import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const AlertModal = ({ isVisible, onCancel, onConfirm }) => {
  return (
    <Dialog
      open={isVisible}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", p: 0 },
      }}
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
          آیا مطمئن هستید که می‌خواهید خارج شوید؟ اطلاعات وارد شده ذخیره نخواهد
          شد.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            width: "100%",
          }}
        >
          <Button
            onClick={onCancel}
            fullWidth
            sx={{
              backgroundColor: "#e0e0e0",
              color: "#333",
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 15,
              textTransform: "none",
              borderRadius: "10px",
              py: 1.25,
              "&:hover": { backgroundColor: "#d0d0d0" },
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={onConfirm}
            fullWidth
            sx={{
              backgroundColor: "#ff6b6b",
              color: "white",
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 15,
              textTransform: "none",
              borderRadius: "10px",
              py: 1.25,
              "&:hover": { backgroundColor: "#e55c5c" },
            }}
          >
            خروج
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AlertModal;