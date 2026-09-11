// components/panel/new/components/TitleInput.js
// Ported from NewWorker.js <TitleInput>
// RN used native-base <Input>; web uses MUI <TextField>.
// Behavior: autoFocus on mount, max 90 chars, RTL.

import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const TitleInput = ({ value, onChangeText }) => {
  return (
    <Box sx={{ mx: { xs: 0.5, md: 1 }, mt: 1, mb: 1 }}>
      <TextField
        fullWidth
        autoFocus
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder="عنوان ملک را اینجا وارد کنید"
        inputProps={{ maxLength: 90 }}
        variant="outlined"
        sx={{
          backgroundColor: "white",
          "& .MuiOutlinedInput-root": {
            height: 60,
            borderRadius: "10px",
            fontFamily: "iransans, Arial, sans-serif",
            fontSize: 16,
            "& fieldset": {
              borderColor: "gray",
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
            padding: "0 15px",
            fontFamily: "iransans, Arial, sans-serif",
          },
        }}
      />
    </Box>
  );
};

export default TitleInput;