// components/panel/new/modals/CategoryModal.js
// Ported from NewWorker.js <CategoryModal>
// Full-screen dialog with checkmark rows.

import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AlertCircleIcon from "@mui/icons-material/ErrorOutline";

const CategoryModal = ({
  isVisible,
  categories,
  loading,
  selectedCategory,
  onSelectCategory,
  onClose,
  formatCategoryName,
}) => {
  const canClose = !!selectedCategory;

  return (
    <Dialog
      open={isVisible}
      onClose={() => {
        if (canClose) onClose();
      }}
      fullScreen
      PaperProps={{ sx: { backgroundColor: "white" } }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          pt: 3,
          px: 2,
          pb: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 22,
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
            }}
          >
            انتخاب دسته بندی
          </Typography>
          {canClose && (
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", right: 0, top: 0 }}
              size="small"
            >
              <CloseIcon sx={{ color: "#666" }} />
            </IconButton>
          )}
        </Box>

        {/* Divider decoration */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 4,
            mb: 1.5,
          }}
        >
          <Box
            sx={{ flex: 1, height: 1.5, backgroundColor: "#e8e8e8" }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#a92b31",
              mx: 1.5,
            }}
          />
          <Box
            sx={{ flex: 1, height: 1.5, backgroundColor: "#e8e8e8" }}
          />
        </Box>

        {/* Content */}
        {loading ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "#a92b31" }} />
            <Typography
              sx={{
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 15,
                color: "#666",
              }}
            >
              در حال بارگذاری...
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              pb: 3,
            }}
          >
            {categories.map((cat, index) => {
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <Box
                  key={cat.id}
                  onClick={() => onSelectCategory(cat)}
                  sx={{
                    py: 2,
                    px: 2.5,
                    mx: 2,
                    my: 0.25,
                    borderRadius: "12px",
                    backgroundColor: isSelected ? "#fef0f1" : "transparent",
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                    "&:hover": {
                      backgroundColor: isSelected ? "#fef0f1" : "#f8f8f8",
                    },
                    display: "flex",
                    alignItems: "center",
                    borderBottom:
                      index < categories.length - 1 && !isSelected
                        ? "0.5px solid #f0f0f0"
                        : "none",
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mr: 1.5,
                    }}
                  >
                    {isSelected && (
                      <CheckCircleIcon
                        sx={{ fontSize: 24, color: "#a92b31" }}
                      />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      flex: 1,
                      fontFamily: "iransans, Arial, sans-serif",
                      fontSize: 17,
                      color: isSelected ? "#a92b31" : "#444",
                      fontWeight: isSelected ? "bold" : 400,
                      textAlign: "right",
                    }}
                  >
                    {formatCategoryName(cat.name)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Forced footer */}
        {!canClose && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 2,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <AlertCircleIcon sx={{ color: "#a92b31", fontSize: 20 }} />
            <Typography
              sx={{
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 14,
                color: "#a92b31",
                fontWeight: 500,
                ml: 1,
              }}
            >
              لطفاً یک دسته بندی را انتخاب کنید
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default CategoryModal;