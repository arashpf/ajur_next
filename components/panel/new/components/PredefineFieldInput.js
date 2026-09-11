// components/panel/new/components/PredefineFieldInput.js
// Ported from NewWorker.js inline predefine rendering

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const PredefineFieldInput = ({ field, value, onChange, isRequired }) => {
  return (
    <Box
      sx={{
        mx: { xs: 0.5, md: 1 },
        my: 0.75,
        p: 1.25,
        borderRadius: "10px",
        border: "1.5px solid #d0d0d0",
        backgroundColor: "white",
      }}
    >
      <Typography
        sx={{
          fontFamily: "iransans, Arial, sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: "#333",
          textAlign: "right",
          mb: 0.75,
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

      <FormControl fullWidth size="small">
        <Select
          value={value || "-"}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          sx={{
            fontFamily: "iransans, Arial, sans-serif",
            fontSize: 15,
            borderRadius: "8px",
            "& .MuiSelect-select": {
              textAlign: "right",
              direction: "rtl",
              fontFamily: "iransans, Arial, sans-serif",
            },
            "& fieldset": { borderColor: "#d0d0d0" },
            "&:hover fieldset": { borderColor: "#a92b31" },
            "&.Mui-focused fieldset": { borderColor: "#a92b31" },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                "& .MuiMenuItem-root": {
                  justifyContent: "center",
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 15,
                  textAlign: "center",
                },
              },
            },
          }}
        >
          <MenuItem value="-" disabled>
            -
          </MenuItem>
          {field.varchars &&
            field.varchars.map((vr) => (
              <MenuItem key={vr.id} value={vr.value}>
                {vr.value}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default PredefineFieldInput;