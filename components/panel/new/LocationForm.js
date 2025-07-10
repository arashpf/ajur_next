import React, { useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  LayerGroup,
  LayersControl,
  useMap,
  Circle
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
import Link from 'next/link';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from "@mui/icons-material/Directions";

import CancelIcon from '@mui/icons-material/Cancel';



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



function LocationForm(props){
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

  const [old_lat, set_old_lat] = useState();
  const [old_long, set_old_long] = useState();
  const [old_city, set_old_city] = useState();
  const [old_neighbourhood, set_old_neighbourhood] = useState();

  const [loc, updLoc] = useState();
  const [location_li, set_location_li] = useState(false);
  const [search, set_search] = useState("");
  const [search_places, set_search_places] = useState([]);

  function Test({ location, search }) {

    const map = useMap();
    if (location && loc) map.flyTo(location, 15);
  
    return 0 ? (
      <Circle center={location} radius={30} pathOptions={{ color: 'blue' }} />
    ) : null;
  }

  // useEffect(() => {
  //   const geocoder = L.Control.Geocoder.nominatim();
  //   if (search)
  //     geocoder.geocode(search, (results) => {

  //       var r = results[0];
  //       if (r) {
  //         const { lat, lng } = r?.center;
  //         // updLoc({ lat, lng });

  //       }
  //     });
  // }, [search]);

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

    //  setInitialPosition([35.54399154, 51.058358367]);

    axios({
      method: "get",
      url: "https://api.ajur.app/api/all-available-locations",
      timeout: 1000 * 35, // Wait for 35 seconds
      params: {},
    })
      .then((response) => {
        console.log("the availble location is -----------------");
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

      // set_zoomLevel(16);
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
      timeout: 1000 * 35, // Wait for 35 seconds
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

  const renderAdress = () => {
    if (0) {
    } else {
      return (
        <Button
          variant="outlined"
          fullWidth
          style={{ textAlign: "center", padding: 10, marginTop: 10 }}
        >
          {addressFormatted}
        </Button>
      );
    }
  };

  const onClickMyLocation = () => {
    console.log("hey you clicked to get location ---------");
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      // setInitialPosition([latitude, longitude]);
      // setSelectedPosition([latitude, longitude]);

      console.log("the user current location is ============");
    });
  };
  const handleChangeCity = (event) => {
    set_addressCity(event.target.value);
  };

  const handleChangeNeighbor = (event) => {
    set_addressNeighbourhood(event.target.value);
  };

  const renderAvailableCities = () => {
    return available_cities.map((city) => (
      <MenuItem value={city.title}>{city.title}</MenuItem>
    ));
  };  

  const renderAvailableNeighborhoods = () => { 
    return available_neighborhoods.map((nb) =>
      nb.city_name == addressCity ? (
        <MenuItem value={nb.name}>{nb.name}</MenuItem>
      ) : null
    );
  };

  const rendercityselection = () => {
    if (1) {
      return (
        <Box sx={{ minWidth: "50%" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">شهر</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={addressCity}
              label="Age"
              onChange={handleChangeCity}
            >
              {renderAvailableCities()}
            </Select>
          </FormControl>
        </Box>
      );
    }
  };

  const renderNeighborselection = () => {
    if (1) {
      return (

        <Box sx={{ minWidth: "50%" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">محله</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={addressNeighbourhood}
              label="neighbourhoods"
              onChange={handleChangeNeighbor}

            >
              {!addressCity && (
                <MenuItem value={0} disabled>
                  ابتدا شهر را انتخاب کنید
                </MenuItem>
              )}
              {renderAvailableNeighborhoods()}
            </Select>
          </FormControl>
        </Box>


        // <Box sx={{ minWidth: "50%" }}>
        //   <FormControl fullWidth>
        //     <InputLabel id="demo-simple-select-label">محله</InputLabel>
        //     <Select
        //       labelId="demo-simple-select-label"
        //       id="demo-simple-select"
        //       value={addressNeighbourhood}
        //       label="Age"
        //       onChange={handleChangeNeighbor}
        //     >
        //       {!addressCity && (
        //         <MenuItem value={0} disabled>
        //           ابتدا شهر را انتخاب کنید
        //         </MenuItem>
        //       )}

        //       {renderAvailableNeighborhoods()}
        //     </Select>
        //   </FormControl>
        // </Box>
      );
    }
  };

  const renderFinalAddress = () => {
    if (1) {
      return (
        <Grid item xs={12} md={12}>
          <TextField
            required
            id="Name"
            label="آدرس کامل"
            placeholder="آدرس کامل"
            fullWidth
            autoFocus={false}
            variant="standard"
            multiline
            maxRows={4}
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
    }
  };

  const rendeUserLocationDetails = () => {
    return (
      <div className={Styles["location-info-wrapper"]}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {renderNeighborselection()}
          {rendercityselection()}
        </div>

        {renderFinalAddress()}
      </div>
    );
  };

  const renderErrors = () => {
    if (1) {
      return <p style={{ textAlign: "center", color: "red" }}>{problem}</p>;
    }
  };

  const handleChangeInput = (e) => {
    console.log("form changed");
    console.log(e.target.value);
    if (e.target.value) {
      var title = e.target.value;

      set_search(title);
      set_location_li(false);

      axios({
        method: "get",
        url: "https://api.neshan.org/v1/search",
        headers: {
          "api-key": "service.UylIa21mMdoxUKtQ9nnS7b3dE5sJfgKWPpRVoyPV",
        },
        params: {
          term: title,
          lat: 35,
          lng: 52,
        },
      }).then(function (response) {
        set_search_places(response.data.items);
        console.log(response.data);
      });
    } else {
      set_search("");
    }
  };

  const locationLi = () => {
    if(location_li){
      return(


        <div className={Styles['search-location-li']} style={{background:'#f7f7f7'}}>
          <div onClick = { onclickCloseButton }  className={Styles['search-location-li-close-icon']} >X</div>
          <div onClick = {handleCurrentLocationClicked}  className={Styles['search-my-location-text']} >
              <p>مکان فعلی من</p>
                <i className="fa fa-map-marker"></i>
          </div>
        </div>

      )
    }
  }

  const onclickPlacesCloseButton = () => {
    set_search_places([]);
    set_search(); 
  }

 

  const renderSearchPlaces = () => {  
    return search_places.map( (place,key) =>
      key < 6 &&
      
      <div key={key} className={Styles.singleSearchResault} onClick = {()=>handleSingleLocationClicked({place})} >
         <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',margin:'10px 0'}}>
            
            <p>{place.title} ({place.region}) </p>
            <LocationOnIcon  style={{margin:'0px 10px'}}/>
          </div>
          <Divider />
      </div> 
    

    );
  }


  const searchResults = () => {  
    if(search){
      return(
        <div className={Styles.search_location_li}  >
          <div onClick = { onclickPlacesCloseButton } className={Styles.search_location_li_close_icon}    >

          
           <HighlightOffIcon fontSize="large"/>

          </div>
          <div className={Styles.search_locations_wrapper}  >
              {renderSearchPlaces()}
          </div> 
        </div>
      )
    }
  }

  const renderSearchButton = () => {
    if (1) {
      return (
        <Paper className={Styles["search-wrapper"]} elevation={5}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* <IconButton sx={{ p: '10px' }} aria-label="menu">
      <DirectionsIcon />
      </IconButton> */}
            <InputBase
              sx={{ ml: 1, flex: 1, direction: "rtl" }}
              placeholder="جستجو منطقه و محله"
              inputProps={{ "aria-label": "جستجو منطقه" }}
              
              onChange={handleChangeInput}
            />
            {/* <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton> */}
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="directions"
            >
              <SearchIcon />
            </IconButton>
          </Paper>

          {/* {locationLi()} */}
          {searchResults()}
        </Paper>
      );
    }
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
    }
    // else if(zoomLevel <15){
    //   return(
    //     <Button
    //       variant="contained"
    //       fullWidth
    //       color="warning"
    //       style={{textAlign:'center',padding:10,marginTop:10}}
    //     >
    //     لطفا بیشتر زوم کنید
    //     </Button>
    //   )
    // }
    else {
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

  function handleSingleLocationClicked({place}){
    set_search('');
    console.log('the place is :');
    console.log(place.location.x);



    const new_location = [place.location.y,place.location.x];

    updLoc(new_location);
    // const map = useMap();
    // if (map) map.flyTo(new_location, 15); 

    // set_zoomLevel(16);

    // setSelectedPosition([place.location.x, place.location.y]);

    // set_final_lat(place.location.x);
    // set_final_lng(place.location.y);

     set_isSelected(false);

  }

  const Markers = () => {
    const map = useMapEvents({
      click: async (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const zoom = map.getZoom();
  
        console.log("Map click coordinates:", { lat, lng, zoom });
  
        // set_zoomLevel(zoom);
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
                "api-key": "service.UylIa21mMdoxUKtQ9nnS7b3dE5sJfgKWPpRVoyPV"
              },
              params: { lat, lng }
            }
          );
  
          console.log("Neshan response:", neshanResponse.data);
  
          if (neshanResponse.data?.city) {
            // Use Neshan data if city exists
            updateAddressFromNeshan(neshanResponse.data);
          } else {
            // 2. Fallback to OSM if Neshan lacks city data
            console.log("No city in Neshan response, falling back to OSM...");
            await new Promise(resolve => setTimeout(resolve, 1000)); // Respect OSM rate limit
            await fetchOSMData(lat, lng);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          // Consider showing user feedback here
        }
      }
    });
  
    // Helper function to process Neshan data
    const updateAddressFromNeshan = (data) => {
      set_addressRegion(data.addresses[0]?.formatted || "");
      set_addressNeighbourhood(data.neighbourhood || "");
      set_addressCity(data.city || "");
      // alert('city from neshan is ' + data.city);
      set_addressMunicipality_zone(data.municipality_zone || "");
      console.warn('neshan data is ');
      console.warn(data); 
      
      
      // alert('city  from neshan is ' + data.city );
      alert('neighbourhood now  from neshan is ' + data.neighbourhood );

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
              "accept-language": "fa-IR"
            },
            headers: {
              "User-Agent": "YourAppName/1.0 (your@email.com)"
            }
          }
        );
  
        console.log("OSM response:", response.data);
  
        if (response.data.address) {
          console.warn('the data from open street is ');
          console.warn(response.data);
          
          
          const addr = response.data.address;
          set_addressRegion(response.data.display_name || "");
          set_addressNeighbourhood(
            addr.neighbourhood || addr.suburb || addr.village || ""
          );
          set_addressCity(addr.city || addr.town || addr.county || "");

          alert('the city is  from openstree is ' +  addr.county );
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

  // const Markers = () => {
  //   const map = useMapEvents({
  //     click(e) {
  //       var zoom = map.getZoom();
  //       console.log("the zoom level right now");
  //       console.log(zoom);
  //       set_zoomLevel(zoom);

  //       setSelectedPosition([e.latlng.lat, e.latlng.lng]);

  //       set_final_lat(e.latlng.lat);
  //       set_final_lng(e.latlng.lng);

  //       console.log(e.latlng.lat);
  //       console.log("and long is: ");
  //       console.log(e.latlng.lng);

  //       console.log("all the data we get from the click");
  //       console.log(e);
  //       set_isSelected(true);

  //       axios({
  //         method: "get",
  //         // url:'http://localhost/iracharweb/public/api/search-category',
  //         url: "https://api.neshan.org/v2/reverse",
  //         headers: {
  //           "api-key": "service.UylIa21mMdoxUKtQ9nnS7b3dE5sJfgKWPpRVoyPV",
  //         },
  //         params: {
  //           lat: e.latlng.lat,
  //           lng: e.latlng.lng,
  //         },
  //       })
  //         .then((response) => {
  //           // console.log('the response data come from neshan is:');
  //           // console.log(response.data);

  //           set_addressRegion(response.data.addresses[0].formatted);
  //           set_addressNeighbourhood(response.data.neighbourhood);
  //           if (response.data.city) {
  //             set_addressCity(response.data.city);
  //             set_addressMunicipality_zone(response.data.municipality_zone);
  //             set_addressState(response.data.state);
  //             set_addressFormatted(response.data.formatted_address);
  //             console.log("the address now is --------");
  //           }

  //           console.log(response.data);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     },
  //   });

  //   return isSelected ? (
  //     <Marker
  //       key={selectedPosition[0]}
  //       position={selectedPosition}
  //       interactive={false}
  //     />
  //   ) : null;
  // };

  return city_lat ? (
    <div>
      {/* {renderAdress()} */}
      <MapContainer
       whenCreated={(map) => {
        mapRef.current = map
    }}
        className={Styles["location"]}
        center={selectedPosition || selectedPosition}
        zoom={zoomLevel}
        scrollWheelZoom={false}
        
        
      >
        <Markers />

        {/* <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        {/* <TileLayer
          attribution="Google Maps"
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
        /> */}

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
        {/* <Button size="large"  onClick={onclickCreateDepartment} variant="contained" fullWidth={true} style={{fontSize:20}}>ورود یا ایجاد دپارتمان مجازی</Button> */}
        {renderFinishButton()}
      </Paper>

      {renderSearchButton()}

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
};

export default LocationForm;
