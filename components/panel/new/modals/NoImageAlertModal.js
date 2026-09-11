// components/panel/new/modals/NoImageAlertModal.js
// Ported from NewWorker.js <NoImageAlertModal>

import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

const NoImageAlertModal = ({ isVisible, onCancel, onConfirm }) => {
  return (
    <Dialog
      open={isVisible}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", p: 0 } }}
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ImageOutlinedIcon sx={{ fontSize: 60, color: "#ffa94d" }} />
        <Typography
          sx={{
            fontFamily: "iransans, Arial, sans-serif",
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
            mt: 2,
          }}
        >
          ثبت ملک بدون عکس
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
          ملک با عکس های مناسب به مراتب بیشتر دیده و به آن توجه خواهد شد
        </Typography>

        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
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
            نه صبر کن
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
            آره، اطمینان دارم
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default NoImageAlertModal;