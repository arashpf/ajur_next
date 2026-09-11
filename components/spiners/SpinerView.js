import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const SpinnerView = ({ size = 60, color = "primary" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <CircularProgress size={size} color={color} />
    </Box>
  );
};

export default SpinnerView;
