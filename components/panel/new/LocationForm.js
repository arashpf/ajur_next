import React, { useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  LayerGroup,
  LayersControl,
  useMap,
  Circle,
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
import Link from "next/link";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsIcon from "@mui/icons-material/Directions";
import CancelIcon from "@mui/icons-material/Cancel";

// Add these imports for searchable dropdown
import Autocomplete from "@mui/material/Autocomplete";
import FormHelperText from "@mui/material/FormHelperText";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function LocationForm(props) {
  const returnedWorker = props.returnedWorker;
  const router = useRouter();
  const edit_id = props.edit_id;

  const [selectedPosition, setSelectedPosition] = useState([
    35.54399154, 51.058358367,
  ]);
  const [isSelected, set_isSelected] = useState(false);
  const [addressRegion, set_addressRegion] = useState("-");
  const [addressNeighbourhood, set_addressNeighbourhood] = useState("");
  const [addressCity, set_addressCity] = useState("");
  const [addressMunicipality_zone, set_addressMunicipality_zone] = useState("");
  const [addressState, set_addressState] = useState("");
  const [addressFormatted, set_addressFormatted] = useState("");
  const [zoomLevel, set_zoomLevel] = useState(10);

  const [final_lat, set_final_lat] = useState(35.6998015438);
  const [final_lng, set_final_lng] = useState(51.3380798685);
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

  const [old_lat, set_old_lat] = useState();
  const [old_long, set_old_long] = useState();
  const [old_city, set_old_city] = useState();
  const [old_neighbourhood, set_old_neighbourhood] = useState();

  const [loc, updLoc] = useState();
  const [location_li, set_location_li] = useState(false);
  const [search, set_search] = useState("");
  const [search_places, set_search_places] = useState([]);

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
        city.title.toLowerCase().includes(citySearch.toLowerCase())
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
          nb.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
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

  function Test({ location, search }) {
    const map = useMap();
    if (location && loc) map.flyTo(location, 15);
    return 0 ? (
      <Circle center={location} radius={30} pathOptions={{ color: "blue" }} />
    ) : null;
  }

  // MARKERS COMPONENT - This was missing
  const Markers = () => {
    const map = useMapEvents({
      click: async (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const zoom = map.getZoom();

        console.log("Map click coordinates:", { lat, lng, zoom });

        setSelectedPosition([lat, lng]);
        set_final_lat(lat);
        set_final_lng(lng);
        set_isSelected(true);

        try {
          // 1. First try Neshan API
          console.log("Fetching from Neshan...");
          const neshanResponse = await axios.get(
            "https://api.neshan.org/v2/reverse",
            {
              headers: {
                "api-key": "service.UylIa21mMdoxUKtQ9nnS7b3dE5sJfgKWPpRVoyPV",
              },
              params: { lat, lng },
            }
          );

          console.log("Neshan response:", neshanResponse.data);

          if (neshanResponse.data?.city) {
            // Use Neshan data if city exists
            updateAddressFromNeshan(neshanResponse.data);
          } else {
            // 2. Fallback to OSM if Neshan lacks city data
            console.log("No city in Neshan response, falling back to OSM...");
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Respect OSM rate limit
            await fetchOSMData(lat, lng);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          // Consider showing user feedback here
        }
      },
    });

    // Helper function to process Neshan data
    const updateAddressFromNeshan = (data) => {
      set_addressRegion(data.addresses[0]?.formatted || "");
      set_addressNeighbourhood(data.neighbourhood || "");
      set_addressCity(data.city || "");
      set_addressMunicipality_zone(data.municipality_zone || "");
      console.warn("neshan data is ");
      console.warn(data);
      set_addressState(data.state || "");
      set_addressFormatted(data.formatted_address || "");
    };

    // OSM Fetch function
    const fetchOSMData = async (lat, lng) => {
      try {
        console.log("Fetching from OSM...");
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse`,
          {
            params: {
              format: "jsonv2",
              lat,
              lon: lng,
              "accept-language": "fa-IR",
            },
            headers: {
              "User-Agent": "YourAppName/1.0 (your@email.com)",
            },
          }
        );

        console.log("OSM response:", response.data);

        if (response.data.address) {
          console.warn("the data from open street is ");
          console.warn(response.data);

          const addr = response.data.address;
          set_addressRegion(response.data.display_name || "");
          set_addressNeighbourhood(
            addr.neighbourhood || addr.suburb || addr.village || ""
          );
          set_addressCity(addr.city || addr.town || addr.county || "");
          set_addressState(addr.state || "");
          set_addressFormatted(response.data.display_name || "");
        }
      } catch (error) {
        console.error("OSM fetch error:", error);
      }
    };

    return isSelected ? (
      <Marker
        key={selectedPosition[0]}
        position={selectedPosition}
        interactive={false}
      />
    ) : null;
  };

  // Your existing useEffect hooks
  useEffect(() => {
    if (edit_id) {
      fetch_old_locations_params();
    }
  }, [edit_id]);

  useEffect(() => {
    console.log("the returned worker id is");
    console.log(returnedWorker.id);

    var selected_city_lat = Cookies.get("selected_city_lat");
    var selected_city_lng = Cookies.get("selected_city_lng");

    console.log("selected cookie lat -----------------");
    console.log(selected_city_lat);

    if (!edit_id) {
      if (selected_city_lat) {
        set_city_lat(selected_city_lat);
      } else {
        set_city_lat(35.54399154);
        var selected_city_lat = "35.481818";
      }

      if (selected_city_lng) {
        set_city_lng(selected_city_lng);
      } else {
        set_city_lng(51.3380798685);
        var selected_city_lng = "51.081231";
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
        console.log("the available location is -----------------");
        console.log(response.data);
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
      console.log("----------- the old lat on edit is --------------");
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
    if (!addressCity) {
      setProblem("شهر را انتخاب کنید");
      return;
    } else if (!addressNeighbourhood) {
      setProblem("محله را انتخاب کنید");
      set_alert_sevirity("warning");
      setOpenSnackBar(true);
      return;
    } else if (!addressFormatted) {
      setProblem("لطفا آدرس را پر کنید");
      return;
    }

    console.log("finish here and send to panel");
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
        console.log("final section is:");
        console.log(response.data);

        if (response.data.status == "200") {
          console.log("succcccccccuuuuuuuus --------------");
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
        console.log("we got serious error herer----------------------");
        set_alert_sevirity("warning");
        setProblem("error 500");
        setOpenSnackBar(true);
        set_btn_status(false);
      });
  };

  const rendercityselection = () => {
    return (
      <Box sx={{ minWidth: "50%", p: 1 }}>
        <FormControl fullWidth>
          <Autocomplete
            id="city-search"
            freeSolo
            options={filteredCities}
            getOptionLabel={(option) => option.title || option}
            value={addressCity}
            onChange={(event, newValue) => {
              if (newValue && typeof newValue === "object") {
                set_addressCity(newValue.title);
              } else {
                set_addressCity(newValue || "");
              }
              setCitySearch("");
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
          />
          <FormHelperText>نام شهر را تایپ کنید</FormHelperText>
        </FormControl>
      </Box>
    );
  };

  const renderNeighborselection = () => {
    return (
      <Box sx={{ minWidth: "50%", p: 1 }}>
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
                    ? "نام محله را جستجو کنید"
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
          />
          <FormHelperText>
            {addressCity
              ? "نام محله را تایپ کنید"
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
      <div className={Styles["location-info-wrapper"]}>
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {renderNeighborselection()} {/* Neighborhood on the LEFT */}
          {rendercityselection()} {/* City on the RIGHT */}
        </div>
        {renderFinalAddress()}
      </div>
    );
  };

  const renderErrors = () => {
    return <p style={{ textAlign: "center", color: "red" }}>{problem}</p>;
  };

  const renderFinishButton = () => {
    if (!isSelected) {
      return (
        <Button
          variant="contained"
          fullWidth
          style={{ textAlign: "center", padding: 10, height: "70px" }}
        >
          لطفا ابتدا روی نقشه موقعیت ملک را با ضربه لمس کنید
        </Button>
      );
    } else {
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
        >
          ارسال نهایی
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
        >
          ...
        </Button>
      );
    }
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return city_lat ? (
    <div>
      <MapContainer
        className={Styles["location"]}
        center={selectedPosition || selectedPosition}
        zoom={zoomLevel}
        scrollWheelZoom={false}
      >
        <Markers />
        <LayersControl>
          <LayersControl.BaseLayer checked name="نقشه ">
            <TileLayer
              attribution="Google Maps"
              url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="ماهواره">
            <LayerGroup>
              <TileLayer
                attribution="Google Maps Satellite"
                url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
              />
              <TileLayer url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
            </LayerGroup>
          </LayersControl.BaseLayer>
        </LayersControl>
        <Test location={loc} search={search} />
      </MapContainer>

      {renderErrors()}

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 11000 }}
        elevation={9}
      >
        {rendeUserLocationDetails()}
        {renderFinishButton()}
      </Paper>

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
