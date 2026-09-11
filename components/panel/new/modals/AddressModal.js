// components/panel/new/modals/AddressModal.js
// Ported from NewWorker.js <AddressModal> (React Native)
// + the API shape your web LocationForm uses (/all-available-locations).

import React, { useState, useEffect, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckIcon from "@mui/icons-material/Check";

import axios from "axios";

const API_BASE = "https://api.ajur.app/api";

const AddressModal = ({ isVisible, onClose, onConfirm, isLoading }) => {
  // ---------- data ----------
  const [availableCities, setAvailableCities] = useState([]);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // ---------- form ----------
  const [city, setCity] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [formatted, setFormatted] = useState("");
  const [region, setRegion] = useState("");
  const [state, setState] = useState("");
  const [municipalityZone, setMunicipalityZone] = useState("");

  const [errors, setErrors] = useState({
    city: "",
    neighbourhood: "",
    formatted: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // ---------- load locations ----------
  useEffect(() => {
    if (!isVisible) return;
    setLoadingLocations(true);
    axios
      .get(`${API_BASE}/all-available-locations`, { timeout: 35000 })
      .then((response) => {
        setAvailableCities(response.data.cities || []);
        setAvailableNeighborhoods(response.data.neighborhoods || []);
      })
      .catch((error) => {
        console.error("load locations error:", error);
      })
      .finally(() => {
        setLoadingLocations(false);
      });
  }, [isVisible]);

  // ---------- auto formatted ----------
  useEffect(() => {
    let combined = "";
    if (city && neighbourhood) combined = `${city} ${neighbourhood}`;
    else if (city) combined = city;
    else if (neighbourhood) combined = neighbourhood;

    if (combined && combined !== formatted) setFormatted(combined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, neighbourhood]);

  // ---------- derived neighbourhood list ----------
  const neighbourhoodsForCity = (() => {
    if (!city) return [];
    const selected = availableCities.find((c) => c.title === city);
    if (!selected) return [];
    const list = availableNeighborhoods.filter(
      (nb) => String(nb.city_id) === String(selected.id)
    );
    if (list.length === 0) {
      return [{ id: "all-areas", name: "همه مناطق", city_id: selected.id }];
    }
    return list;
  })();

  // ---------- validation ----------
  const validate = useCallback(() => {
    const next = { city: "", neighbourhood: "", formatted: "" };
    if (!city) next.city = "لطفا شهر را انتخاب کنید";
    if (!neighbourhood) next.neighbourhood = "لطفا محله را انتخاب کنید";
    if (!formatted || !formatted.trim())
      next.formatted = "لطفا آدرس کامل را وارد کنید";
    setErrors(next);
    return !next.city && !next.neighbourhood && !next.formatted;
  }, [city, neighbourhood, formatted]);

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  // ---------- actions ----------
  const handleCityChange = (value) => {
    setCity(value);
    setNeighbourhood("");
    clearError("city");
    clearError("neighbourhood");
  };

  const handleNeighbourhoodChange = (value) => {
    setNeighbourhood(value);
    clearError("neighbourhood");
  };

  const handleConfirm = () => {
    if (!validate()) return;

    setSubmitting(true);
    onConfirm({
      formatted,
      region: region || formatted,
      neighbourhood,
      city,
      municipality_zone: municipalityZone,
      state,
    });
    setSubmitting(false);
  };

  // Reset fields when closing
  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  // ---------- render ----------
  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: { xs: "20px", md: "20px" },
          m: { xs: 1, md: 2 },
          maxHeight: "95vh",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 1.5,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Typography
            sx={{
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 18,
              fontWeight: "bold",
              color: "#333",
              flex: 1,
              textAlign: "center",
            }}
          >
            ثبت موقعیت ملک
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {loadingLocations ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "#4CAF50" }} />
            <Typography
              sx={{
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 15,
                color: "#666",
              }}
            >
              در حال بارگذاری...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: 2.5, py: 2, overflowY: "auto" }}>
            {/* Info card */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#E3F2FD",
                border: "1px solid #BBDEFB",
                borderRadius: "12px",
                p: 1.5,
                mb: 2.5,
              }}
            >
              <InfoOutlinedIcon
                sx={{ color: "#2196F3", flexShrink: 0 }}
              />
              <Typography
                sx={{
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 13,
                  color: "#1565C0",
                  textAlign: "right",
                  lineHeight: 1.6,
                }}
              >
                لطفا شهر، محله و آدرس کامل ملک خود را وارد کنید
              </Typography>
            </Box>

            {/* City */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                sx={{
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "right",
                  mb: 1,
                }}
              >
                انتخاب شهر *
              </Typography>
              <FormControl fullWidth error={!!errors.city}>
                <Select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  displayEmpty
                  renderValue={(value) =>
                    value || (
                      <Typography
                        sx={{
                          color: "#999",
                          fontFamily: "iransans, Arial, sans-serif",
                          fontSize: 15,
                        }}
                      >
                        شهر را انتخاب کنید
                      </Typography>
                    )
                  }
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "white",
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 15,
                    "& .MuiSelect-select": {
                      textAlign: "right",
                      direction: "rtl",
                      fontFamily: "iransans, Arial, sans-serif",
                      py: 1.5,
                    },
                    "& fieldset": {
                      borderColor: errors.city ? "#D32F2F" : "#e0e0e0",
                    },
                    "&:hover fieldset": { borderColor: "#4CAF50" },
                    "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 320,
                        "& .MuiMenuItem-root": {
                          justifyContent: "center",
                          fontFamily: "iransans, Arial, sans-serif",
                          fontSize: 15,
                        },
                      },
                    },
                  }}
                >
                  {availableCities.map((c) => (
                    <MenuItem key={c.id} value={c.title}>
                      {c.title}
                    </MenuItem>
                  ))}
                </Select>
                {errors.city && (
                  <FormHelperText sx={{ textAlign: "right" }}>
                    {errors.city}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Neighbourhood */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                sx={{
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "right",
                  mb: 1,
                }}
              >
                انتخاب محله *
              </Typography>
              <FormControl
                fullWidth
                error={!!errors.neighbourhood}
                disabled={!city}
              >
                <Select
                  value={neighbourhood}
                  onChange={(e) => handleNeighbourhoodChange(e.target.value)}
                  displayEmpty
                  renderValue={(value) =>
                    value || (
                      <Typography
                        sx={{
                          color: "#999",
                          fontFamily: "iransans, Arial, sans-serif",
                          fontSize: 15,
                        }}
                      >
                        {city ? "محله را انتخاب کنید" : "ابتدا شهر را انتخاب کنید"}
                      </Typography>
                    )
                  }
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "white",
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 15,
                    "& .MuiSelect-select": {
                      textAlign: "right",
                      direction: "rtl",
                      fontFamily: "iransans, Arial, sans-serif",
                      py: 1.5,
                    },
                    "& fieldset": {
                      borderColor: errors.neighbourhood
                        ? "#D32F2F"
                        : "#e0e0e0",
                    },
                    "&:hover fieldset": { borderColor: "#4CAF50" },
                    "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 320,
                        "& .MuiMenuItem-root": {
                          justifyContent: "center",
                          fontFamily: "iransans, Arial, sans-serif",
                          fontSize: 15,
                        },
                      },
                    },
                  }}
                >
                  {neighbourhoodsForCity.map((nb) => (
                    <MenuItem key={nb.id} value={nb.name}>
                      {nb.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.neighbourhood && (
                  <FormHelperText sx={{ textAlign: "right" }}>
                    {errors.neighbourhood}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Formatted address */}
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "right",
                  mb: 1,
                }}
              >
                آدرس کامل * ( قابل ویرایش )
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.75,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 12,
                    color: "#E65100",
                  }}
                >
                  آدرس قابل ویرایش است
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                minRows={3}
                maxRows={6}
                value={formatted}
                onChange={(e) => {
                  setFormatted(e.target.value);
                  clearError("formatted");
                }}
                placeholder="آدرس کامل محل را وارد کنید..."
                error={!!errors.formatted}
                helperText={errors.formatted}
                FormHelperTextProps={{
                  sx: { textAlign: "right" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "white",
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 15,
                    "& fieldset": {
                      borderColor: errors.formatted ? "#D32F2F" : "#e0e0e0",
                    },
                    "&:hover fieldset": { borderColor: "#4CAF50" },
                    "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                  },
                  "& .MuiInputBase-input": {
                    textAlign: "right",
                    direction: "rtl",
                    fontFamily: "iransans, Arial, sans-serif",
                  },
                }}
              />
            </Box>

            {/* Submit */}
            <Button
              fullWidth
              onClick={handleConfirm}
              disabled={submitting || isLoading}
              startIcon={<CheckIcon />}
              sx={{
                mt: 1,
                mb: 2,
                py: 1.75,
                borderRadius: "12px",
                backgroundColor: "#4CAF50",
                color: "white",
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 16,
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                "&:hover": {
                  backgroundColor: "#43a047",
                  boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
                },
                "&:disabled": {
                  backgroundColor: "#cccccc",
                  color: "white",
                },
              }}
            >
              {submitting || isLoading ? (
                <CircularProgress size={22} sx={{ color: "white" }} />
              ) : (
                "تایید آدرس"
              )}
            </Button>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default AddressModal;