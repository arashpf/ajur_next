// components/SearchDiv.jsx

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import SmartSearchBox from "./SmartSearchBox";
import styles from "../styles/SearchDiv.module.css";
import InfoIcon from "@mui/icons-material/Info";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Button from "@mui/material/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "font-awesome/css/font-awesome.min.css";

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

export default function SearchDiv({ the_city, the_neighborhoods, loading }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected_city, set_selected_city] = useState("robat");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const selected = Cookies.get("selected_city");
    set_selected_city(selected || "robat");
  }, []);

  const handleTooltipClose = () => setOpen(false);
  const handleTooltipOpen = () => setOpen(true);

const handleSmartSearch = (filters) => {
  if (!filters || typeof filters !== "object") {
    console.warn("⚠️ Invalid filters object:", filters);
    return;
  }

  const category = filters.category_name?.trim();
  const city     = filters.city?.trim();

  // 🚫 Prevent redirect if filters are malformed
  if (!category || !city || category === "search-intent" || city === "api") {
    console.warn("🚫 Blocked redirect due to invalid filter values:", { category, city });
    return;
  }

  const encodedCity     = encodeURIComponent(city);
  const encodedCategory = encodeURIComponent(category);
  const encodedHood     = filters.neighborhood ? encodeURIComponent(filters.neighborhood.trim()) : "";

  let url = `/${encodedCity}/${encodedCategory}?city=${encodedCity}`;
  if (encodedHood) url += `&neighbor=${encodedHood}`;

  console.log("🚀 Redirecting to:", url);
  router.push(url);
};



  const renderNeighborhoods = () =>
    the_neighborhoods.map((neighbor) => (
      <SwiperSlide key={neighbor.id} onClick={loading}>
        <Link
          href={`/${the_city.title}/فروش%20خانه?neighbor=${neighbor.name}&city=${selected_city}`}
        >
          <Button
            variant="contained"
            size="small"
            fullWidth
            style={{ background: "#b92a31" }}
          >
            <p>{neighbor.name}</p>
          </Button>
        </Link>
      </SwiperSlide>
    ));

  const rendertooltip = () => (
    <div>
      <p style={{ color: "#e2e2e2" }}>{the_city.description}</p>
      {the_city.link && <a href={the_city.link}>اطلاعات بیشتر</a>}
    </div>
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <div
        className={styles["search-div-wrapper"]}
        style={{
          backgroundImage: !the_city.video
            ? `url(${the_city.avatar_url})`
            : null,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className={styles["navbar-about-place"]}>
          <ThemeProvider theme={theme}>
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <CustomWidthTooltip
                PopperProps={{ disablePortal: true }}
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
                />
              </CustomWidthTooltip>
            </ClickAwayListener>
          </ThemeProvider>
          <p>{the_city.avatar_title}</p>
        </div>

        <div className={styles["search-box-wrapper"]}>
          <SmartSearchBox onSearch={handleSmartSearch} />
        </div>

        {/* <div className={styles["neighborhoods-wrapper"]}>
          <Swiper
            slidesPerView={1}
            spaceBetween={5}
            navigation={false}
            pagination={{ clickable: true, enabled: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              200: { slidesPerView: 3, spaceBetween: 3 },
              640: { slidesPerView: 6, spaceBetween: 3 },
              768: { slidesPerView: 7, spaceBetween: 3 },
              1024: { slidesPerView: 7, spaceBetween: 3 },
            }}
            modules={[Pagination, Navigation, Autoplay]}
            className={styles["neighborh-swiper"]}
          >
            {renderNeighborhoods()}
          </Swiper>
        </div> */}

        {/* Render search results
        {searchResults.length > 0 && (
          <div className={styles.resultsGrid}>
            {searchResults.map((item) => (
              <div key={item.id} className={styles.resultCard}>
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>قیمت: {item.price?.toLocaleString()}</p>
                <p>متراژ: {item.area} متر</p>
                <p>اتاق: {item.rooms}</p>
              </div>
            ))}
          </div>
        )} */}
      </div>
    </ThemeProvider>
  );
}

SearchDiv.propTypes = {
  the_city: PropTypes.object.isRequired,
  the_neighborhoods: PropTypes.array.isRequired,
  loading: PropTypes.func,
};
