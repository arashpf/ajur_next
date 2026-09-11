import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Tooltip from "@mui/material/Tooltip";

import styles from "../styles/Header.module.css";

import axios from "axios";
import "animate.css";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});



// PWA Install Button Logic
let deferredPrompt;



function Header() {

  const router = useRouter();
  const expand = "false";
  // State to control search visibility
  const [showSearch, setShowSearch] = useState(false);

  const [location_li, set_location_li] = useState(false);
  const [search, set_search] = useState("");
  const [search_places, set_search_places] = useState([]);
  const [user_initial_lat, set_user_initial_lat] = useState(35.7074612);
  const [user_initial_long, set_user_initial_long] = useState(51.3005805);
  const [loading, set_loading] = useState(false);

  const [problem, setProblem] = useState("username_test_problem");
  const [vertical, set_vertical] = useState("top");
  const [horizontal, set_horizontal] = useState("center");
  const [alert_type, set_alert_type] = useState("success");
  const [open_alert, setOpenAlert] = React.useState(false);

  const [installPrompt, setInstallPrompt] = useState(false);


  const [selected_city, set_selected_city] = useState("");
  var city = Cookies.get("selected_city");
  useEffect(() => {
    if (city) {
      set_selected_city(city);
    } else {
      set_selected_city('رباط کریم');
    }

  }, [city]);

  useEffect(() => {

    // Detect if the app can be installed (only on mobile)
    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log(choiceResult.outcome);
        setInstallPrompt(false); // Hide the button after installation prompt is shown
      });
    }
  };

  const renderInstallButton = () => {
    if (installPrompt && /Mobi|Android/i.test(navigator.userAgent)) {
      return (
        <Button
          variant="primary"
          onClick={handleInstallClick}
          className={styles.installButton}
        >
          نصب وب اپلیکیشن
        </Button>
      );
    }
    return null;
  };

  function handleCloseAlert() {
    setOpenAlert(false);
  }

  /* navbar scroll changeBackground function */
  const changeBackground = () => {
    if (window.scrollY >= 200) {
    } else {
    }
  };

  useEffect(() => {
    changeBackground();

    window.addEventListener("scroll", changeBackground);
  }, []);

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleSearchClose = () => {
    setShowSearch(false);
    set_search("");
    set_search_places([]);
    set_location_li(false);
  };

  const handleOnclickInput = () => {
    console.log("form clicked");
    set_location_li(true);
  };

  const handleSingleLocationClicked = ({ place }) => {
    set_search("");
    console.log("the place is :");
    console.log(place.location);
  };

  const renderSearchPlaces = () => {
    return search_places.map((place) => (
      <div
        className={styles.ingleSearchResault}
        onClick={() => handleSingleLocationClicked({ place })}
        key={place.id}
      >
        <p>
          {place.title} ({place.region})
        </p>
        <p></p>
      </div>
    ));
  };

  const handleChangeInput = (e) => {
    console.log("form changed -------");
    console.log(e.target.value);
    if (e.target.value) {
      var title = e.target.value;

      set_search(title);
      set_location_li(false);

      axios({
        method: "get",
        url: "https://api.neshan.org/v1/search",
        headers: {
          "api-key": "service.df4c9bbc16704476847da9b6b5cf892e",
        },
        params: {
          term: title,
          lat: 35,
          lng: 52,
        },
      }).then(function (response) {
        console.log("the response data for neshan in header is -----------------");
        set_search_places(response.data.items);
        console.log(response.data);
      });
      /* end of fetching data */
    } else {
      set_search("");
    }
  };

  const onclickPlacesCloseButton = () => {
    set_search_places([]);
  };

  const searchResults = () => {
    if (search) {
      return (
        <div className="search_location_li">
          <div
            onClick={onclickPlacesCloseButton}
            className="search_location_li_close_icon"
          >
            X
          </div>
          <div className={styles.search_location_text_in_header}>
            {renderSearchPlaces()}
          </div>
        </div>
      );
    }
  };

  const onclickCloseButton = () => {
    set_location_li(false);
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
      });
    });
  }

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

  const onClickHome = () => {
    router.push("/");
  };

  const onClickAboutUs = () => {
    router.push("/about");
  };

  const onClickSupport = () => {
    router.push("/support");
  };

  const onClickGAds = () => {
    router.push("/G-ads/landing-page")
  }

  const onClickDownlaod = () => {
    router.push("/download");
  };

  const onClickCounseling = () => {
    router.push("/Counseling");
  };

  const onClickMarketing = () => {
    var token = Cookies.get("id_token");
    if (!token) {
      console.log("you have to login");
      Cookies.set("destination_before_auth", "/marketing", { expires: 14 });
      router.push("/panel/auth/login");
    } else {
      console.log("you are currently loged in and enjoy");
      console.log(token);
      router.push("/marketing");
    }
  };

  const onClickLogin = () => {
    console.log("login clicked");

    var token = Cookies.get("id_token");
    if (!token) {
      console.log("you have to login");
      router.push("/panel/auth/login");
    } else {
      console.log("you are currently loged in and enjoy");
      console.log(token);
      router.push("/panel");
    }
  };

  const onClickLogout = () => {
    console.log("you press logout");

    setOpenAlert(true);
    setProblem("با موفقیت خارج شدید");
    set_alert_type("success");

    // remove all cookies before logout and im the god guy respect others privacy !!!
    Cookies.remove("id_token");
    Cookies.remove("destination_before_auth");
    Cookies.remove("ref");
    Cookies.remove("phone");
    Cookies.remove("star");
    Cookies.remove("user_phone");
    Cookies.remove("user_realstate");
    Cookies.remove("user_description");
    Cookies.remove("user_profile_url");
    Cookies.remove("user_realstate_url");

    router.push("/");
  };

  const renderSnackBarAlert = () => {
    if (1) {
      return (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open_alert}
          autoHideDuration={10000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert_type}
            sx={{ width: "100%" }}
          >
            {problem}
          </Alert>
        </Snackbar>
      );
    }
  };

  const onClickSelectCity = () => {
    set_loading(true);
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = true;
        resolve(result);
      }, 3000);
    });

    promise.then((result) => {
      if (result) {
        router.push("/city-selection");
        set_loading(false);
      }
    });
  };

  const renderLogoutButton = () => {
    var token = Cookies.get("id_token");

    if (token) {
      return (
        <NavDropdown.Item
          onClick={onClickLogout}
          href="#"
          className={styles["nav-dropdown-item"]}
        >
          <p>خروج از حساب</p>
        </NavDropdown.Item>
      );
    }
  };

  const renderCitySelector = () => {
    return (
      <Tooltip
        arrow
        title={<p>از اینجا میتوانید شهر خود را انتخاب کنید</p>}
        open={selected_city ? false : true}
      >
        {!loading ? (
          <Nav.Link
            style={{
              background: "#bc323a",
              color: "#f9f9f9",
              padding: "5px 12px",
              boxShadow: "0 3px 14px rgba(0, 0, 0, 0.4)",
              marginLeft: "10px",
            }}
            onClick={onClickSelectCity}
          >
            شهر : {selected_city}
          </Nav.Link>
        ) : (
          <Nav.Link
            style={{
              background: "#333",
              color: "#f9f9f9",
              padding: "5px 12px",
              boxShadow: "0 3px 14px rgba(0, 0, 0, 0.4)",
              borderRadius: 5,
              marginLeft: "10px",
            }}
          >
            در حال انتقال
          </Nav.Link>
        )}
      </Tooltip>
    );
  };

  const renderHeaderContent = () => {
    if (loading) {
      return (
        <div className="spinnerImageView">
          <img
            className="spinner-image"
            src="/logo/ajour-gif.gif"
            alt="ajur logo"
          />
        </div>
      );
    }

    if (showSearch) {
      // Search mode - show search box and hide logo, but keep city selector
      return (
        <Container fluid className={styles.navbar}>
          <div className={styles.searchHeader}>
            {/* City Selector on the left */}
            <div className={styles.citySelectorContainer}>
              {renderCitySelector()}
            </div>

            {/* Search box in the middle */}
            <Form className={styles.navbar_search_full}>
              <Form.Control
                type="search"
                placeholder={"جستجو "}
                className={`'me-2' ${styles["search-input"]} 'form-control-lg'`}
                aria-label="Search"
                onChange={handleChangeInput}
                onClick={handleOnclickInput}
                value={search}
                autoFocus
              />
            </Form>

            {/* Close button on the right */}
            <Button 
              variant="link" 
              onClick={handleSearchClose}
              className={styles.searchCloseButton}
            >
              ✕
            </Button>

            {searchResults()}
          </div>
        </Container>
      );
    } else {
      // Normal mode - show logo, search button, and city selector
      
      return (
        <Container fluid className={styles.navbar}>
          <div className={styles.normalHeader}>
            {/* Search Button on Top Right */}
           {/*  <Button
              variant="link"
              onClick={handleSearchClick}
              className={styles.searchButton}
            >
              <i className="fa fa-search"></i>
            </Button>

            */}

            {/* Logo in Middle */}
            <Navbar.Brand className={styles.navbar_brand_center} href="/">
              <Link href="/">
                <img
                  className={styles.image_logo}
                  src="/logo/web-logo-text.png"
                  alt="لوگوی آجر"
                />
              </Link>
            </Navbar.Brand>

            {/* City Selector on Left */}

            {/*
            <div className={styles.citySelectorContainer}>
              {renderCitySelector()}
            </div>

            */}
           

            {/* <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} /> */}
          </div>

          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton style={{ background: '#bc323a', flexDirection: 'row-reverse' }}>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                <p
                  style={{
                    background: "#bc323a",
                    margin: 10,
                    padding: 6,
                    fontSize: 16,
                    textAlign: "center",
                    color: 'white',
                    borderRadius: '5px',
                  }}
                >
                  <img
                    className={styles["logo-just-mobile-image"]}
                    src="/img/big-logo-180.png"
                    alt="لوگوی مشاور املاک آجر"
                    width={45}
                    height={45}
                    style={{ marginRight: '5px' }}
                  />
                  مشاور املاک هوشمند آجر
                </p>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav
                className={`flex-grow-1 pe-3 ${styles["nav-link-wrapper-end"]}`}
              >
                <Nav.Link href={"/"} onClick={onClickHome}>
                  <p>خانه</p>
                </Nav.Link>
                <Nav.Link href="/about" onClick={onClickAboutUs}>
                  <p>درباره آجر</p>
                </Nav.Link>
                <Nav.Link href="/support" onClick={onClickSupport}>
                  <p>پشتیبانی</p>
                </Nav.Link>
                <Nav.Link href="/G-ads/landing-page" onClick={onClickGAds}>
                  <p>تبلیغات گوگل</p>
                </Nav.Link>

                <Nav.Link href="/download" onClick={onClickDownlaod}>
                  <p>دانلود اپلیکیشن</p>
                </Nav.Link>
              </Nav>

              <Nav className={` ${styles["nav-link-wrapper-start"]} pe-3 `}>
                <Nav.Link href="#" onClick={onClickCounseling}>
                  <p> درخواست فایل</p>
                </Nav.Link>

                <Nav.Link href="#" onClick={onClickMarketing}>
                  <p>بازاریابی</p>
                </Nav.Link>
              </Nav>
              {renderInstallButton()}
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      );
    }
  };

  return (
    <>
      <Navbar
        key={expand}
        collapseOnSelect
        bg="light"
        expand={expand}
        className={styles.mb_1}
        sticky="top"
      >
         {renderHeaderContent()} 
        {/* {renderSnackBarAlert()} */}
      </Navbar>
    </>
  );
}

export default Header;