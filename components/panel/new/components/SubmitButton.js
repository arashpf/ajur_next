// components/panel/new/components/SubmitButton.js
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const SubmitButton = ({
  onPress,
  title,
  loading,
  isVideoProcessing,
  isEditMode,
  showToast,
}) => {
  const handlePress = () => {
    if (isVideoProcessing) {
      if (showToast) {
        showToast("لطفا تا پایان بارگذاری ویدیو صبر کنید", "warning");
      }
      return;
    }
    onPress();
  };

  const buttonText = isEditMode ? "تکمیل ویرایش ملک" : title || "ثبت ملک";

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        px: { xs: 2, md: 5 },
        py: 1.5,
        pb: { xs: 2, md: 2.5 },
        borderTop: "1px solid #f0f0f0",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
        zIndex: 100,
      }}
    >
      <Button
        fullWidth
        onClick={handlePress}
        disabled={loading}
        sx={{
          height: 54,
          borderRadius: "12px",
          backgroundColor: "#a92b31",
          color: "white",
          fontFamily: "iransans, Arial, sans-serif",
          fontSize: 18,
          fontWeight: "bold",
          textTransform: "none",
          boxShadow: "0 4px 12px rgba(169, 43, 49, 0.25)",
          "&:hover": {
            backgroundColor: "#8a2228",
            boxShadow: "0 6px 18px rgba(169, 43, 49, 0.35)",
          },
          "&:disabled": {
            backgroundColor: "#cccccc",
            color: "white",
            boxShadow: "none",
          },
        }}
      >
        {loading ? (
          <CircularProgress size={22} sx={{ color: "white" }} />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 22 }} />
            <span>{buttonText}</span>
          </Box>
        )}
      </Button>
    </Box>
  );
};

export default SubmitButton;