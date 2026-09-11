import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import "font-awesome/css/font-awesome.min.css";
import styles from "../styles/SearchDiv.module.css";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGeolocated } from "react-geolocated";
import Cookies from "js-cookie";

import InfoIcon from "@mui/icons-material/Info";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Button from "@mui/material/Button";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    minWidth: 300,
    maxWidth: 500,
  },
});

const defaultTheme = createTheme();
const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "1.2em",
          color: "#a1a1a1",
          backgroundColor: "black",
          textAlign: "right",
          padding: 20,
          fontFamily: "iransans",
        },
      },
    },
  },
});

const SearchDiv = (props) => {
  const the_city = props.the_city;
  const loading = props.loading;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [the_neighborhoods, set_the_neighborhoods] = useState(
    props.the_neighborhoods
  );
  const [selected_city, set_selected_city] = useState("robat");

  useEffect(() => {
    console.log("the neighborhood we catched in search div is---------------");
    console.log(the_neighborhoods);

    var selected_city_here = Cookies.get("selected_city");
    set_selected_city(selected_city_here);
  }, []);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const [location_li, set_location_li] = useState(false);
  const [search, set_search] = useState("");
  const [search_places, set_search_places] = useState([]);
  const [user_initial_lat, set_user_initial_lat] = useState(35.7074612);

  const [user_initial_long, set_user_initial_long] = useState(51.3005805);

  const handleOnclickInput = () => {
    console.log("form clicked");
    set_location_li(true);
  };

  const handleChangeInput = (e) => {
    console.log("form changed");
    console.log(e.target.value);
    if (e.target.value) {
      var title = e.target.value;

      set_search(title);

      /* fetch the places using axios and neshan */

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
      /* end of fetching data */
    } else {
      set_location_li(true);
      set_search("");
    }
  };

  function handleCurrentLocationClicked() {
    console.log("current location clicked");
    set_location_li(false);

    console.log("the location lat is ");

    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);

      set_user_initial_lat(position.coords.latitude);
      set_user_initial_long(position.coords.longitude);

      /* fetch the places using axios and neshan  */

      axios({
        method: "get",
        url: "https://api.neshan.org/v5/reverse",
        headers: {
          "api-key": "service.UylIa21mMdoxUKtQ9nnS7b3dE5sJfgKWPpRVoyPV",
        },
        params: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      }).then(function (response) {
        set_search_places(response.data.items);
        console.log(response.data);
        var formatted_address = response.data.formatted_address;
        var county = response.data.county;
        var city = response.data.city;

        if (!county) {
          var title = city;
        } else {
          var title = county;
        }

        router.push("/search/" + title);
      });
      /* end of fetching data */
    });
  }

  const onclickCloseButton = () => {
    set_location_li(false);
  };

  const onclickPlacesCloseButton = () => {
    set_search_places([]);
  };

  const locationLi = () => {
    if (location_li) {
      return (
        <div
          className={styles["search-location-li"]}
          style={{ background: "#f7f7f7" }}
        >
          <div
            onClick={onclickCloseButton}
            className={styles["search-location-li-close-icon"]}
          >
            X
          </div>
          <div
            onClick={handleCurrentLocationClicked}
            className={styles["search-my-location-text"]}
          >
            <p>مکان فعلی من</p>
            <i className="fa fa-map-marker"></i>
          </div>
        </div>
      );
    }
  };

  const handleSingleLocationClicked = ({ place }) => {
    set_search("");
    console.log("the place is :");

    loading();
    console.log(place.location);
  };

  const renderSearchPlaces = () => {
    return search_places.map((place) =>
      place.region == the_city.region ? (
        <Link href={`/search/${place.title}`} key={place.id}>
          <div
            className={styles["singleSearchResault"]}
            onClick={() => handleSingleLocationClicked({ place })}
          >
            <p>
              {place.title} ({place.region})
            </p>
            <p></p>
          </div>
        </Link>
      ) : (
        <div></div>
      )
    );
  };

  const searchResults = () => {
    if (search) {
      return (
        <div
          className={styles["search-location-li"]}
          style={{ background: "#f7f7f7" }}
        >
          <div
            onClick={onclickPlacesCloseButton}
            className={styles["search-location-li-close-icon"]}
          >
            X
          </div>
          <div className={styles["search-location-text"]}>
            {renderSearchPlaces()}
          </div>
        </div>
      );
    }
  };

  const rendertooltip = () => {
    // return the_city.description;

    return (
      <div>
        <p style={{ color: "#e2e2e2" }}>{the_city.description}</p>
        {the_city.link ? <a href={the_city.link}>اطلاعات بیشتر</a> : null}
      </div>
    );
    // return 'برج تجارت جهانی تبریز با ارتفاع ۱۵۲ متر در سال ۱۳۹۶ افتتاح شده است . این برج با استفاده از فناوری‌های نوین لرزه‌گیر و با قابلیت نصب دستگاه‌های جاذب انرژی زلزله در داخل گنبد ساخته شده‌است ، امیدواریم این برج زیبا نقش قابل توجهی در فرایند جهانی شدن ایران ایفا کند';
  };

  function AlterParentloading() {
    console.log("please fire parent loading !!!!!!!!!!!!!!!!!!");
    loading();
  }

  const renderNeighborhoods = () => {
    if (1) {
      return the_neighborhoods.map((neighbor) => (
        <SwiperSlide key={neighbor.id} onClick={AlterParentloading}>
          <Link
            href={`/categories/فروش%20خانه?neighbor=${neighbor.name}&city=${selected_city}`}
          >
            <Button variant="contained" size="small">
              {neighbor.name}
            </Button>
          </Link>
        </SwiperSlide>
      ));
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <div
        style={{
          // backgroundImage: "url(/img/tabriz-trading-center.jpg)" ,
          // backgroundImage: "url({the_city.avatar_url})" ,

          backgroundImage: !the_city.video
            ? `url(${the_city.avatar_url})`
            : null,

          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className={styles["search-div-wrapper"]}
      >
        <div className={styles["navbar-about-place"]}>
          {/* <video autoplay muted loop>
            <source
              src="https://api.ajur.app/city/banner/roza.mp4"
              type="video/mp4"
            />
          </video> */}

          
          <ThemeProvider theme={theme}>
            {/* <Tooltip enterTouchDelay={0} title={rendertooltip()} arrow>
           <div style={{ marginBottom: "20px" }}>
              <InfoIcon enterTouchDelay={0} style={{margin:10}}>Arrow</InfoIcon>
           </div>
         </Tooltip> */}

            <ClickAwayListener onClickAway={handleTooltipClose}>
              <div>
                <CustomWidthTooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  onClose={handleTooltipClose}
                  open={open}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  title={rendertooltip()}
                >
                  <InfoIcon
                    onClick={handleTooltipOpen}
                    enterTouchDelay={0}
                    style={{ margin: 10, cursor: "pointer" }}
                  >
                    Arrow
                  </InfoIcon>
                </CustomWidthTooltip>
              </div>
            </ClickAwayListener>
          </ThemeProvider>
          <p>{the_city.avatar_title}</p>
        </div>

        <Form
          className={`'d-flex' ${styles["navar-brand-center"]} ${styles["navbar-serach"]} `}
        >
          <Form.Control
            type="search"
            placeholder={" جستجو مناطق " + the_city.title}
            className={`'me-2' ${styles["search-input"]}  'form-control-lg' `}
            aria-label="Search"
            onChange={handleChangeInput}
            onClick={handleOnclickInput}
            value={search}
          />
          <div className={styles["navbar-serach-icon"]}>
            <i className="fa fa-search"></i>
          </div>
        </Form>
        {locationLi()}
        {searchResults()}

        <div className={styles["neighborhoods-wrapper"]}>
          <Swiper
            slidesPerView={1}
            spaceBetween={3}
            navigation
            breakpoints={{
              200: {
                slidesPerView: 3,
                spaceBetween: 3,
              },

              640: {
                slidesPerView: 6,
                spaceBetween: 3,
              },
              768: {
                slidesPerView: 7,
                spaceBetween: 3,
              },
              1024: {
                slidesPerView: 8,
                spaceBetween: 3,
              },
            }}
            modules={[Pagination, Navigation]}
            className={styles["neighborh-swiper"]}
          >
            {renderNeighborhoods()}
          </Swiper>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SearchDiv;
