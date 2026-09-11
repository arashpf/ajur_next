// components/panel/new/components/StepIndicator.js
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const StepIndicator = ({
  currentStep,
  onClose,
  onBack,          // ← new prop
  isEditMode,
  isDraft,
}) => {
  const totalSteps = 2;

  const getStepTitle = () => {
    if (currentStep === 1) return "تصاویر و توضیحات";
    if (currentStep === 2) return "مشخصات ملک";
    return "";
  };

  const getSubtitle = () => {
    if (isEditMode) return "ویرایش ملک";
    if (isDraft) return "ادامه پیش‌نویس";
    return "ثبت ملک جدید";
  };

  const progressPercent = currentStep === 1 ? 50 : 100;

  return (
    <Box
      sx={{
        py: 1,
        px: 2,
        backgroundColor: "white",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      {/* Header row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        {/* Left: close */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ ml: -0.5 }}
          aria-label="close"
        >
          <CloseIcon sx={{ fontSize: 22, color: "#333" }} />
        </IconButton>

        <Typography
          sx={{
            fontFamily: "iransans, Arial, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "#333",
            textAlign: "right",
            flex: 1,
            mx: 1,
          }}
        >
          {getSubtitle()}
        </Typography>

        {/* Right: back (only on step 2) */}
        {currentStep > 1 && onBack ? (
          <Tooltip title="بازگشت به مرحله قبل">
            <IconButton
              onClick={onBack}
              size="small"
              sx={{
                mr: -0.5,
                color: "#a92b31",
                "&:hover": { backgroundColor: "#fef0f1" },
              }}
              aria-label="back"
            >
              <ChevronLeftIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Box sx={{ width: 34 }} /> // spacer to keep title centered
        )}
      </Box>

      {/* Progress row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
        <Box
          sx={{
            flex: 1,
            height: 3,
            backgroundColor: "#e8e8e8",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${progressPercent}%`,
              backgroundColor: "#a92b31",
              borderRadius: 2,
              transition: "width 0.3s ease",
            }}
          />
        </Box>
        <Typography
          sx={{
            fontFamily: "iransans, Arial, sans-serif",
            fontSize: 11,
            color: "#999",
            minWidth: 100,
            textAlign: "right",
          }}
        >
          صفحه {currentStep} از {totalSteps}: {getStepTitle()}
        </Typography>
      </Box>
    </Box>
  );
};

export default StepIndicator;