import React, { useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  LayersControl,
  useMap,
  Popup,
} from "react-leaflet";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import Styles from "../../styles/panel/LocationForm.module.css";
import Button from "@mui/material/Button";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
import FormHelperText from "@mui/material/FormHelperText";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function LocationForm(props) {
  const returnedWorker = props.returnedWorker;
  const router = useRouter();
  const edit_id = props.edit_id;

  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Map, 2: Form

  const [selectedPosition, setSelectedPosition] = useState([
    35.6892, 51.3890, // Tehran center as default
  ]);
  const [isSelected, set_isSelected] = useState(false);
  const [addressRegion, set_addressRegion] = useState("");
  const [addressNeighbourhood, set_addressNeighbourhood] = useState("");
  const [addressCity, set_addressCity] = useState("");
  const [addressMunicipality_zone, set_addressMunicipality_zone] = useState("");
  const [addressState, set_addressState] = useState("");
  const [addressFormatted, set_addressFormatted] = useState("");
  const [zoomLevel, set_zoomLevel] = useState(10);

  const [final_lat, set_final_lat] = useState(35.6892);
  const [final_lng, set_final_lng] = useState(51.3890);
  const [city_lat, set_city_lat] = useState();
  const [city_lng, set_city_lng] = useState();

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [problem, setProblem] = useState("");
  const [alert_sevirity, set_alert_sevirity] = useState("warning");
  const [btn_status, set_btn_status] = useState(false);
  const [available_cities, set_available_cities] = useState([]);
  const [available_neighborhoods, set_available_neighborhoods] = useState([]);

  // Add state for search functionality
  const [citySearch, setCitySearch] = useState("");
  const [neighborhoodSearch, setNeighborhoodSearch] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState([]);

  // New state for search functionality
  const [placeSearchQuery, setPlaceSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // State for confirmation
  const [selectedPlaceName, setSelectedPlaceName] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Initialize filtered lists when data loads
  useEffect(() => {
    setFilteredCities(available_cities);
  }, [available_cities]);

  useEffect(() => {
    setFilteredNeighborhoods(
      available_neighborhoods.filter((nb) => nb.city_name === addressCity)
    );
  }, [available_neighborhoods, addressCity]);

  // Filter cities based on search
  useEffect(() => {
    if (citySearch) {
      const filtered = available_cities.filter((city) =>
        city.title?.toLowerCase().includes(citySearch.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(available_cities);
    }
  }, [citySearch, available_cities]);

  // Filter neighborhoods based on search
  useEffect(() => {
    if (neighborhoodSearch && addressCity) {
      const filtered = available_neighborhoods.filter(
        (nb) =>
          nb.city_name === addressCity &&
          nb.name?.toLowerCase().includes(neighborhoodSearch.toLowerCase())
      );
      setFilteredNeighborhoods(filtered);
    } else if (addressCity) {
      setFilteredNeighborhoods(
        available_neighborhoods.filter((nb) => nb.city_name === addressCity)
      );
    } else {
      setFilteredNeighborhoods([]);
    }
  }, [neighborhoodSearch, addressCity, available_neighborhoods]);

  // Search for places using OpenStreetMap Nominatim
  const searchPlaces = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: query,
            format: "json",
            limit: 10,
            'accept-language': 'fa-IR',
            countrycodes: 'ir',
            viewbox: '44.0,24.0,64.0,40.0',
            bounded: 1
          },
          headers: {
            "User-Agent": "AjurApp/1.0 (realestate@ajur.app)",
          },
        }
      );

      const results = response.data.map(item => ({
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: item.type,
        class: item.class,
        importance: item.importance
      }));
      
      results.sort((a, b) => b.importance - a.importance);
      setSearchResults(results);
    } catch (error) {
      console.error("OSM search error:", error);
      setSearchResults([]);
      setProblem("خطا در جستجوی مکان");
      setOpenSnackBar(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlaceSelect = (place) => {
    if (place) {
      const lat = place.lat;
      const lng = place.lon;
      
      setSelectedPosition([lat, lng]);
      set_final_lat(lat);
      set_final_lng(lng);
      set_isSelected(true);
      
      updateAddressFromOSM(place);
      setSelectedPlaceName(place.display_name);
      
      setPlaceSearchQuery("");
      setSearchResults([]);
      setShowConfirmation(true);
      
      const map = document.querySelector('.leaflet-container')?._leaflet_map;
      if (map) {
        map.flyTo([lat, lng], 15);
      }
    }
  };

  // Update address information from OSM data
  const updateAddressFromOSM = (data) => {
    const addressParts = data.display_name.split(', ');
    
    let city = "";
    let neighborhood = "";
    let state = "";
    
    const iranianCities = [
      'تهران', 'مشهد', 'اصفهان', 'کرج', 'تبریز', 'شیراز', 'اهواز', 
      'قم', 'کرمانشاه', 'ارومیه', 'رشت', 'زاهدان', 'کرمان', 'همدان',
      'اردبیل', 'یزد', 'بندرعباس', 'اراک', 'اسلامشهر', 'زنجان', 'ساری',
      'قزوین', 'خرمآباد', 'گرگان', 'سبزوار', 'نجفآباد', 'بوشهر'
    ];
    
    for (const part of addressParts) {
      if (iranianCities.includes(part)) {
        city = part;
        break;
      }
    }
    
    if (!city && addressParts.length > 0) {
      city = addressParts[0];
    }
    
    if (addressParts.length > 1) {
      neighborhood = addressParts[0];
    }
    
    set_addressCity(city);
    set_addressNeighbourhood(neighborhood);
    set_addressState(state);
    set_addressFormatted(data.display_name);
    set_addressRegion(data.display_name);
  };

  // Reverse geocoding using OpenStreetMap
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: "jsonv2",
            lat: lat,
            lon: lng,
            "accept-language": "fa-IR",
            zoom: 18,
          },
          headers: {
            "User-Agent": "AjurApp/1.0 (realestate@ajur.app)",
          },
        }
      );

      if (response.data) {
        const displayName = response.data.display_name || "موقعیت انتخاب شده";
        setSelectedPlaceName(displayName);
        
        if (response.data.address) {
          const addr = response.data.address;
          const city = addr.city || addr.town || addr.village || addr.municipality || "";
          const neighborhood = addr.neighbourhood || addr.suburb || addr.hamlet || "";
          const state = addr.state || addr.province || "";
          
          set_addressCity(city);
          set_addressNeighbourhood(neighborhood);
          set_addressState(state);
          set_addressFormatted(displayName);
          set_addressRegion(displayName);
          set_addressMunicipality_zone(addr.county || "");
        }
        
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setSelectedPlaceName(`موقعیت: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      setShowConfirmation(true);
    }
  };

  // MARKERS COMPONENT
  const Markers = () => {
    const map = useMapEvents({
      click: async (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        setSelectedPosition([lat, lng]);
        set_final_lat(lat);
        set_final_lng(lng);
        set_isSelected(true);

        await reverseGeocode(lat, lng);
      },
    });

    return isSelected ? (
      <Marker position={selectedPosition}>
        <Popup>
          موقعیت انتخاب شده
          <br />
          {selectedPlaceName}
        </Popup>
      </Marker>
    ) : null;
  };

  // Handle confirmation
  const handleConfirmation = () => {
    setShowConfirmation(false);
    setCurrentStep(2); // Move to form step
  };

  // Your existing useEffect hooks
  useEffect(() => {
    if (edit_id) {
      fetch_old_locations_params();
      setCurrentStep(2);
    }
  }, [edit_id]);

  useEffect(() => {
    console.log("the returned worker id is");
    console.log(returnedWorker.id);

    var selected_city_lat = Cookies.get("selected_city_lat");
    var selected_city_lng = Cookies.get("selected_city_lng");

    if (!edit_id) {
      if (selected_city_lat) {
        set_city_lat(selected_city_lat);
      } else {
        set_city_lat(35.6892);
        var selected_city_lat = "35.6892";
      }

      if (selected_city_lng) {
        set_city_lng(selected_city_lng);
      } else {
        set_city_lng(51.3890);
        var selected_city_lng = "51.3890";
      }

      setSelectedPosition([selected_city_lat, selected_city_lng]);
    }

    axios({
      method: "get",
      url: "https://api.ajur.app/api/all-available-locations",
      timeout: 1000 * 35,
      params: {},
    })
      .then((response) => {
        set_available_cities(response.data.cities);
        set_available_neighborhoods(response.data.neighborhoods);
      })
      .catch((e) => {
        console.log("error when try to fetch available data from api--------");
      });
  }, []);

  const fetch_old_locations_params = (worker) => {
    axios({
      method: "get",
      url: `https://api.ajur.app/api/posts/${edit_id}`,
    }).then(function (response) {
      set_final_lat(response.data.details.lat);
      set_final_lng(response.data.details.long);
      set_addressFormatted(response.data.details.formatted);
      set_addressCity(response.data.details.city);
      set_addressNeighbourhood(response.data.details.neighbourhood);
      set_city_lat(response.data.details.lat);
      set_city_lng(response.data.details.long);
      setSelectedPosition([
        response.data.details.lat,
        response.data.details.long,
      ]);
      set_isSelected(true);
    });
  };

  const onClickFinish = () => {
    if (!isSelected) {
      setProblem("لطفا ابتدا روی نقشه موقعیت ملک را مشخص کنید");
      set_alert_sevirity("warning");
      setOpenSnackBar(true);
      return;
    }
    
    if (!addressCity) {
      setProblem("شهر را انتخاب کنید");
      set_alert_sevirity("warning");
      setOpenSnackBar(true);
      return;
    } else if (!addressNeighbourhood) {
      setProblem("محله را انتخاب کنید");
      set_alert_sevirity("warning");
      setOpenSnackBar(true);
      return;
    } else if (!addressFormatted) {
      setProblem("لطفا آدرس را پر کنید");
      set_alert_sevirity("warning");
      setOpenSnackBar(true);
      return;
    }

    set_btn_status(true);
    var token = Cookies.get("id_token");

    axios({
      method: "post",
      url: "https://api.ajur.app/api/post-model-location",
      timeout: 1000 * 35,
      params: {
        token: token,
        lat: final_lat,
        long: final_lng,
        worker_id: returnedWorker.id,
        region: addressRegion,
        neighbourhood: addressNeighbourhood,
        city: addressCity,
        municipality_zone: addressMunicipality_zone,
        state: addressState,
        formatted: addressFormatted,
      },
    })
      .then((response) => {
        if (response.data.status == "200") {
          set_alert_sevirity("success");
          setProblem("آگهی شما با موفقیت ثبت شد");
          setOpenSnackBar(true);
          router.push("/panel");
          set_btn_status(false);
        } else {
          set_alert_sevirity("warning");
          setProblem("متاسفانه با مشکلی مواجه شدیم");
          set_btn_status(false);
          setOpenSnackBar(true);
        }
      })
      .catch((e) => {
        set_alert_sevirity("warning");
        setProblem("error 500");
        setOpenSnackBar(true);
        set_btn_status(false);
      });
  };

  // Search component for places
  const renderPlaceSearch = () => {
    return (
      <Box sx={{ 
        position: "absolute", 
        top: 16, 
        left: 16, 
        right: 16, 
        zIndex: 1000,
        maxWidth: "500px",
        margin: "0 auto"
      }}>
        <Autocomplete
          freeSolo
          options={searchResults}
          getOptionLabel={(option) => option.display_name || ""}
          loading={isSearching}
          onInputChange={(event, newValue) => {
            setPlaceSearchQuery(newValue);
            if (newValue.length >= 3) {
              const timeoutId = setTimeout(() => {
                searchPlaces(newValue);
              }, 500);
              return () => clearTimeout(timeoutId);
            } else {
              setSearchResults([]);
            }
          }}
          onChange={(event, newValue) => {
            if (newValue) {
              handlePlaceSelect(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="جستجوی مکان (رباط کریم، تهران و...)"
              variant="outlined"
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isSearching ? <div>جستجو...</div> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          noOptionsText={
            placeSearchQuery.length >= 3 
              ? "مکانی یافت نشد" 
              : "حداقل ۳ حرف تایپ کنید"
          }
          popupIcon={<SearchIcon />}
          renderOption={(props, option) => (
            <li {...props}>
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  {option.display_name.split(',')[0]}
                </div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>
                  {option.display_name.split(',').slice(1).join(',').trim()}
                </div>
              </div>
            </li>
          )}
        />
      </Box>
    );
  };

  // Confirmation Alert Box
  const renderConfirmationAlert = () => {
    if (!showConfirmation) return null;

    return (
      <Fade in={showConfirmation}>
        <Box sx={{
          position: "absolute",
          top: 80,
          left: 16,
          right: 16,
          zIndex: 1000,
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          <Paper 
            elevation={4}
            sx={{
              p: 2,
              backgroundColor: "white",
              borderRadius: 2,
              border: "2px solid #4CAF50"
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: "#2E7D32" }}>
              موقعیت انتخاب شده
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
              {selectedPlaceName}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button 
                variant="outlined" 
                onClick={() => setShowConfirmation(false)}
                size="small"
              >
                تغییر موقعیت
              </Button>
              <Button 
                variant="contained" 
                color="success"
                onClick={handleConfirmation}
                size="small"
                startIcon={<span>✓</span>}
              >
                همینجا درسته
              </Button>
            </Box>
          </Paper>
        </Box>
      </Fade>
    );
  };

  const rendercityselection = () => {
    return (
      <Box sx={{ width: "100%", p: 1 }}>
        <FormControl fullWidth>
          <Autocomplete
            id="city-search"
            options={filteredCities}
            getOptionLabel={(option) => option.title || option}
            value={available_cities.find(city => city.title === addressCity) || null}
            onChange={(event, newValue) => {
              set_addressCity(newValue?.title || "");
              setCitySearch("");
              set_addressNeighbourhood("");
            }}
            inputValue={citySearch}
            onInputChange={(event, newInputValue) => {
              setCitySearch(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="شهر"
                variant="outlined"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            noOptionsText="شهری یافت نشد"
            loadingText="در حال جستجو..."
            disablePortal={false}
          />
          <FormHelperText>نام شهر را تایپ کنید</FormHelperText>
        </FormControl>
      </Box>
    );
  };

  const renderNeighborselection = () => {
    return (
      <Box sx={{ width: "100%", p: 1 }}>
        <FormControl fullWidth disabled={!addressCity}>
          <Autocomplete
            id="neighborhood-search"
            freeSolo
            options={filteredNeighborhoods}
            getOptionLabel={(option) => option.name || option}
            value={addressNeighbourhood}
            onChange={(event, newValue) => {
              if (newValue && typeof newValue === "object") {
                set_addressNeighbourhood(newValue.name);
              } else {
                set_addressNeighbourhood(newValue || "");
              }
              setNeighborhoodSearch("");
            }}
            inputValue={neighborhoodSearch}
            onInputChange={(event, newInputValue) => {
              setNeighborhoodSearch(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="محله"
                variant="outlined"
                required
                disabled={!addressCity}
                placeholder={
                  addressCity
                    ? "نام محله را جستجو یا تایپ کنید"
                    : "ابتدا شهر را انتخاب کنید"
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            noOptionsText={
              addressCity ? "محله‌ای یافت نشد" : "ابتدا شهر را انتخاب کنید"
            }
            loadingText="در حال جستجو..."
            disablePortal={false}
          />
          <FormHelperText>
            {addressCity
              ? "نام محله را تایپ کنید یا از لیست انتخاب کنید"
              : "برای انتخاب محله، ابتدا شهر را انتخاب کنید"}
          </FormHelperText>
        </FormControl>
      </Box>
    );
  };

  const renderFinalAddress = () => {
    return (
      <Grid item xs={12} md={12} sx={{ p: 1 }}>
        <TextField
          required
          id="Name"
          label="آدرس کامل"
          placeholder="آدرس کامل"
          fullWidth
          autoFocus={false}
          variant="outlined"
          multiline
          rows={2}
          value={addressFormatted}
          onChange={(adr) => set_addressFormatted(adr.target.value)}
          style={{
            textAlign: "right",
            direction: "rtl",
            backgroundColor: "#f8f8f8",
          }}
        />
      </Grid>
    );
  };

  const rendeUserLocationDetails = () => {
    return (
      <Paper 
        elevation={4}
        sx={{ 
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 1000,
          maxWidth: "500px",
          margin: "0 auto",
          backgroundColor: "white"
        }}
      >
        <div className={Styles["location-info-wrapper"]}>
          <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>
            اطلاعات موقعیت ملک
          </Typography>
          {rendercityselection()}
          {renderNeighborselection()}
          {renderFinalAddress()}
          <Box sx={{ p: 1, mt: 1 }}>
            {renderFinishButton()}
          </Box>
        </div>
      </Paper>
    );
  };

  const renderErrors = () => {
    return problem ? <p style={{ textAlign: "center", color: "red" }}>{problem}</p> : null;
  };

  const renderFinishButton = () => {
    const isFormValid = addressCity && addressNeighbourhood && addressFormatted;
    
    return !btn_status ? (
      <Button
        variant="contained"
        color="success"
        fullWidth
        style={{
          textAlign: "center",
          padding: 10,
          marginTop: 10,
          fontSize: 20,
        }}
        onClick={() => onClickFinish()}
        disabled={!isFormValid}
      >
        {isFormValid ? "ارسال نهایی" : "لطفا شهر و محله را انتخاب کنید"}
      </Button>
    ) : (
      <Button
        variant="contained"
        color="success"
        fullWidth
        style={{
          textAlign: "center",
          padding: 10,
          marginTop: 10,
          fontSize: 20,
        }}
        disabled
      >
        در حال ارسال...
      </Button>
    );
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  // Render based on current step
  const renderCurrentStep = () => {
    return (
      <div style={{ position: "relative", height: "100vh", width: "100%" }}>
        {/* Map as Background */}
        <MapContainer
          className={Styles["location"]}
          center={selectedPosition}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          style={{ 
            height: "100%", 
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <Markers />
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="نقشه عادی">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="نقشه سیاه و سفید">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>
        </MapContainer>

        {/* Search Bar - Always visible */}
        {renderPlaceSearch()}

        {/* Step 1: Map with Confirmation Alert */}
        {currentStep === 1 && (
          <>
            {renderConfirmationAlert()}
            <Paper 
              sx={{ 
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                zIndex: 1000,
                maxWidth: "500px",
                margin: "0 auto",
                p: 2,
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.9)"
              }}
            >
              <Typography variant="body1" color="textSecondary">
                لطفا روی نقشه کلیک کنید یا مکان مورد نظر را جستجو کنید
              </Typography>
            </Paper>
          </>
        )}

        {/* Step 2: Form Overlay */}
        {currentStep === 2 && (
          <>
            {rendeUserLocationDetails()}
          </>
        )}
      </div>
    );
  };

  return city_lat ? (
    <div style={{ position: "relative", height: "100vh" }}>
      {renderCurrentStep()}
      {renderErrors()}

      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={alert_sevirity}
          sx={{ width: "100%" }}
        >
          {problem}
        </Alert>
      </Snackbar>
    </div>
  ) : null;
}

export default LocationForm;