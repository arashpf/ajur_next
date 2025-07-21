import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Checkbox } from "@mui/material";
import axios from "axios";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const CatSelector = ({ selectedCats, setSelectedCats }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        axios
            .get("https://api.ajur.app/api/sub-category")
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setOptions(res.data);
                } else {
                    setOptions([]);
                    console.error("API response items is not an array", res.data);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch categories", err);
                setOptions([]);
            });
    }, []);

    const handleChange = (_, newValue) => {
        if (newValue.length <= 2) {
            setSelectedCats(newValue);
        }
    };

    const isOptionDisabled = (option) =>
        selectedCats.length >= 2 && !selectedCats.some(c => c.id === option.id);

    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            options={options}
            getOptionLabel={(option) => option.name}
            value={selectedCats}
            onChange={handleChange}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="دسته بندی ها"
                    placeholder={selectedCats.length >= 2 ? "حداکثر دو دسته" : "انتخاب دسته بندی"}
                />
            )}
            renderOption={(props, option, { selected }) => (
                <li
                    {...props}
                    style={{ opacity: isOptionDisabled(option) ? 0.4 : 1 }}
                >
                    <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                        disabled={isOptionDisabled(option)}
                    />
                    {option.name}
                </li>
            )}
        />
    );
};

export default CatSelector;
