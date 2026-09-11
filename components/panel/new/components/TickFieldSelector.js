// components/panel/new/components/TickFieldSelector.js
// Ported from NewWorker.js <TickFieldSelector> — 1:1
// Two buttons: دارد (1) / ندارد (0)

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const TickFieldSelector = ({ field, value, onSelect, isRequired }) => {
  const handleSelect = (option) => {
    if (option === "دارد") onSelect(1);
    else if (option === "ندارد") onSelect(0);
    else onSelect("");
  };

  const isSelected = (option) => {
    if (option === "دارد") return value === 1;
    if (option === "ندارد") return value === 0;
    return false;
  };

  const renderOption = (label) => (
    <Box
      onClick={() => handleSelect(label)}
      sx={{
        px: 2,
        py: 0.75,
        mx: 0.5,
        borderRadius: "8px",
        border: "1.5px solid",
        borderColor: isSelected(label) ? "#a92b31" : "#d0d0d0",
        backgroundColor: "white",
        minWidth: 60,
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: "#a92b31",
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: "iransans, Arial, sans-serif",
          fontSize: 14,
          color: isSelected(label) ? "#a92b31" : "#666",
          fontWeight: isSelected(label) ? "bold" : 400,
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        mx: { xs: 0.5, md: 1 },
        my: 0.75,
        px: 1.5,
        py: 1.25,
        borderRadius: "10px",
        border: "1.5px solid #d0d0d0",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {renderOption("ندارد")}
        {renderOption("دارد")}
      </Box>

      <Typography
        sx={{
          fontFamily: "iransans, Arial, sans-serif",
          fontSize: 15,
          fontWeight: 500,
          color: "#333",
          flex: 1,
          textAlign: "right",
        }}
      >
        {field.value}
        {isRequired && (
          <Typography
            component="span"
            sx={{ color: "red", fontSize: 16, fontWeight: "bold" }}
          >
            {" "}
            *
          </Typography>
        )}
      </Typography>
    </Box>
  );
};

export default TickFieldSelector;