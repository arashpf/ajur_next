import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Checkbox } from "@mui/material";
import axios from "axios";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const CitySelector = ({ selectedCities, setSelectedCities }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        axios
            .get("https://api.ajur.app/api/search-cities")
            .then((res) => {
                if (Array.isArray(res.data.items)) {
                    setOptions(res.data.items);
                } else {
                    setOptions([]);
                    console.error("API response items is not an array", res.data);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch cities", err);
                setOptions([]);
            });
    }, []);

    const handleChange = (_, newValue) => {
        if (newValue.length <= 2) {
            setSelectedCities(newValue);
        }
    };

    const isOptionDisabled = (option) =>
        selectedCities.length >= 2 && !selectedCities.some(c => c.id === option.id);

    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            options={options}
            getOptionLabel={(option) => option.title}
            value={selectedCities}
            onChange={handleChange}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="شهرها"
                    placeholder={selectedCities.length >= 2 ? "حداکثر دو شهر" : "انتخاب شهر"}
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
                    {option.title}
                </li>
            )}
        />
    );
};

export default CitySelector;
