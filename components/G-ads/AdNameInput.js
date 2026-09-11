import React from "react";
import { TextField } from "@mui/material";

function AdNameInput({ adName, setAdName }) {
    return (
        <TextField
            label="عنوان تبلیغ"
            value={adName}
            onChange={(e) => setAdName(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder="مثلاً فروش آپارتمان در تهران"
            InputLabelProps={{ shrink: true }}
        />
    );
}

export default AdNameInput;
