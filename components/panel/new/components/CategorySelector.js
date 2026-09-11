// components/panel/new/components/CategorySelector.js
// Ported from NewWorker.js <CategorySelector>
// A tappable row showing the selected category (or a placeholder).

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const CategorySelector = ({
  selectedCategory,
  onPress,
  formatCategoryName,
}) => {
  return (
    <Box
      onClick={onPress}
      sx={{
        backgroundColor: "white",
        minHeight: 60,
        px: 2,
        py: 1.5,
        mx: { xs: 0.5, md: 1 },
        my: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid gray",
        borderRadius: "8px",
        cursor: "pointer",
        "&:hover": {
          borderColor: "#a92b31",
          backgroundColor: "#fef8f8",
        },
        transition: "all 0.2s",
      }}
    >
      <ChevronLeftIcon sx={{ color: "#bc323b", fontSize: 24 }} />
      <Typography
        sx={{
          fontFamily: "iransans, Arial, sans-serif",
          fontSize: 15,
          flex: 1,
          textAlign: "right",
          color: selectedCategory ? "#333" : "#999",
          pr: 1,
        }}
      >
        {selectedCategory
          ? formatCategoryName(selectedCategory.name)
          : "دسته بندی را انتخاب کنید"}
      </Typography>
    </Box>
  );
};

export default CategorySelector;