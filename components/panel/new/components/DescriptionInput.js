// components/panel/new/components/DescriptionInput.js
// v2 — no horizontal margin (parent handles it)

import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const DescriptionInput = ({
  description,
  setDescription,
  note,
  setNote,
  showDescription = true,
  showNote = true,
}) => {
  const textFieldSx = {
    backgroundColor: "white",
    mt: 1,
    mb: 1,
    width: "100%",
    boxSizing: "border-box",
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      fontFamily: "iransans, Arial, sans-serif",
      fontSize: 15,
      backgroundColor: "white",
      "& fieldset": {
        borderColor: "#d0d0d0",
        borderWidth: 1,
      },
      "&:hover fieldset": {
        borderColor: "#a92b31",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#a92b31",
        borderWidth: 2,
      },
    },
    "& .MuiInputBase-input": {
      textAlign: "right",
      direction: "rtl",
      fontFamily: "iransans, Arial, sans-serif",
    },
  };

  return (
    <Box sx={{ width: "100%" }}>
      {showDescription && (
        <TextField
          fullWidth
          multiline
          minRows={5}
          maxRows={14}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="توضیحات : این توضیحات برای مشتری و دیگران قابل مشاهده خواهد بود"
          inputProps={{ maxLength: 3000 }}
          variant="outlined"
          sx={textFieldSx}
        />
      )}

      {showNote && (
        <TextField
          fullWidth
          multiline
          minRows={5}
          maxRows={14}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="یادداشت خصوصی : فقط توسط شما قابل مشاهده خواهد بود ، مانند نام مالک ، مقدار کمسیون توافقی و غیره"
          inputProps={{ maxLength: 3000 }}
          variant="outlined"
          sx={textFieldSx}
        />
      )}
    </Box>
  );
};

export default DescriptionInput;