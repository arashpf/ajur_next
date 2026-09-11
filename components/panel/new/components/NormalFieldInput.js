// components/panel/new/components/NormalFieldInput.js
// v4 — RTL floating label (anchored right) + right-aligned hint below.

import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ClearIcon from "@mui/icons-material/Clear";
import { normalizeNumericInput } from "../numberInput";

const NormalFieldInput = ({
  field,
  value,
  onChangeText,
  numToPersian,
  isRequired,
}) => {
  const rawValue = String(value || "").trim();
  const numericValue = rawValue.replace(/[^0-9]/g, "");

  const displayValue = numericValue
    ? Number(numericValue).toLocaleString("en-US")
    : "";

  const persianText = numToPersian ? numToPersian(numericValue) : "";

  const handleChange = (e) => {
    const cleaned = normalizeNumericInput(e.target.value);
    onChangeText(cleaned);
  };

  const handleClear = () => {
    onChangeText("");
  };

  return (
    <Box sx={{ mx: { xs: 0.5, md: 1 }, my: 0.75 }}>
      <TextField
        fullWidth
        variant="outlined"
        value={displayValue}
        onChange={handleChange}
        onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text");
            const cleaned = normalizeNumericInput(pasted);
            onChangeText(cleaned);
          }}
        label={
          <span>
            {field.value}
            {field.unit ? (
              <Typography
                component="span"
                sx={{ fontSize: 11, color: "#666", ml: 0.5 }}
              >
                ({field.unit})
              </Typography>
            ) : null}
            {isRequired && (
              <Typography
                component="span"
                sx={{
                  color: "red",
                  fontSize: 16,
                  fontWeight: "bold",
                  ml: 0.5,
                }}
              >
                *
              </Typography>
            )}
          </span>
        }
        // 👇 RTL anchored label — floats UP and stays on the RIGHT
        InputLabelProps={{
          sx: {
            fontFamily: "iransans, Arial, sans-serif",
            fontSize: 15,
            color: "#333",
            backgroundColor: "white",
            px: 0.5,

            right: 24,
            left: "auto",
            transformOrigin: "top right",

            "&.MuiInputLabel-shrink": {
              right: 14,
              left: "auto",
              transformOrigin: "top right",
            },

            "&.Mui-focused": { color: "#a92b31" },
            "&.MuiFormLabel-filled": { color: "#333" },
          },
        }}
        inputProps={{
          inputMode: "numeric",
          style: {
            textAlign: "right",
            direction: "rtl",
            fontFamily: "iransans, Arial, sans-serif",
            fontSize: 15,
            padding: "14px",
          },
        }}
        InputProps={{
          endAdornment: numericValue ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
                sx={{ color: "#999" }}
              >
                <ClearIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "white",
            minHeight: 52,
            "& fieldset": {
              borderColor: "#d0d0d0",
              borderWidth: 1.5,
            },
            "&:hover fieldset": { borderColor: "#bc323b" },
            "&.Mui-focused fieldset": {
              borderColor: "#bc323b",
              borderWidth: 2,
            },
          },
        }}
      />

      {/* Persian hint — right-aligned below the field */}
      <Box
        sx={{
          mt: 0.5,
          display: "flex",
          justifyContent: "flex-end",
          height: 18,
          opacity: persianText ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        <Typography
          sx={{
            fontFamily: "iransans, Arial, sans-serif",
            fontSize: 12,
            color: "#888",
            textAlign: "right",
            mr: 1.5,
          }}
        >
          {persianText || " "}
        </Typography>
      </Box>
    </Box>
  );
};

export default NormalFieldInput;