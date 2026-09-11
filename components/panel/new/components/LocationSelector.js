// components/panel/new/components/LocationSelector.js
// Ported from NewWorker.js <LocationSelector>

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const LocationSelector = ({ selectedLocation, onPress }) => {
  const getDisplayText = () => {
    if (!selectedLocation) return "انتخاب موقعیت ملک";
    if (selectedLocation.formatted) return selectedLocation.formatted;
    if (selectedLocation.city && selectedLocation.neighbourhood) {
      return `${selectedLocation.city} - ${selectedLocation.neighbourhood}`;
    }
    if (selectedLocation.city) return selectedLocation.city;
    return "موقعیت ملک را انتخاب کنید";
  };

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
        gap: 1,
        "&:hover": {
          borderColor: "#4CAF50",
          backgroundColor: "#f5fbf6",
        },
        transition: "all 0.2s",
      }}
    >
      <ChevronLeftIcon sx={{ color: "#4CAF50", fontSize: 24 }} />

      <Typography
        sx={{
          fontFamily: "iransans, Arial, sans-serif",
          fontSize: 15,
          flex: 1,
          textAlign: "right",
          color: selectedLocation ? "#333" : "#999",
          px: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {getDisplayText()}
      </Typography>

      <LocationOnOutlinedIcon sx={{ color: "#999", fontSize: 24 }} />
    </Box>
  );
};

export default LocationSelector;