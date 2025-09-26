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
  // show the scrolled-down header (search box) by default
  const [nav_kind, set_nav_kind] = useState("secondary");

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
      // if ( /Mobi|Android/i.test(navigator.userAgent)) {
      // if (1) {
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

  // We no longer switch header variant on scroll. The scrolled/secondary
  // header (with search) is shown by default via initial state above.

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
      // <Link
      //   href={`/categories/فروش%20خانه?city=${selected_city}`}
      //   key={place.id}
      // >
      <div
        className={styles.ingleSearchResault}
        onClick={() => handleSingleLocationClicked({ place })}
      >
        <p>
          {place.title} ({place.region})
        </p>
        <p></p>
      </div>
      // </Link>
    ));
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
        console.log("the response data is -----------------");
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

  // const onClickMarketing = () => {

  //   var token = Cookies.get("id_token");
  //   if (token) {
  //     router.push("/marketing/single");
  //   } else {
  //     router.push("/marketing");
  //   }
  // };



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
    // Cookies.remove("user_city");
    Cookies.remove("user_realstate");
    Cookies.remove("user_description");
    Cookies.remove("user_profile_url");
    Cookies.remove("user_realstate_url");
    // Cookies.remove("selected_city");

    // router.push("/panel/auth/login");
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
        // router.push("/city-selection");


        router.push("/city-selection");
        set_loading(false);
        //  set_loading(false);
      }
    });

    // router.push("/city-selection").then(set_loading(false));
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

  const navabrOrSearch = () => {
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

    if (nav_kind == "main") {
      return (
        <Container fluid className={styles.navbar}>
          <Navbar.Brand className={styles.navar_brand_center} href="/">
            <Link href={`/${selected_city !== undefined ? selected_city : ""}`}>
              <img
                className={styles.image_logo_small}
                src="/logo/web-logo-text.png"
                alt="لوگوی آجر"
              />
            </Link>
          </Navbar.Brand>
          <Tooltip
            arrow
            title={<p>از اینجا میتوانید شهر خود را انتخاب کنید</p>}
            open={selected_city ? false : true}
          >
            {!loading ? (
              <>


                <Nav.Link
                  style={{
                    background: "#bc323a",
                    color: "#f9f9f9",
                    padding: "5px 12px",
                    boxShadow: "0 3px 14px rgba(0, 0, 0, 0.4)",
                  }}
                  onClick={onClickSelectCity}
                >
                  شهر : {selected_city}
                </Nav.Link>

              </>
            ) : (
              <Nav.Link
                style={{
                  background: "#333",
                  color: "#f9f9f9",
                  padding: "5px 12px",
                  boxShadow: "0 3px 14px rgba(0, 0, 0, 0.4)",
                  borderRadius: 5,
                }}
              // onClick={onClickSelectCity}
              >
                در حال انتقال
              </Nav.Link>


            )}
          </Tooltip>

          {/* <NavDropdown
                  title=}
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                    <NavDropdown.Item
                      onClick={onClickSelectCity}
                      href="#action3" className={styles['nav-dropdown-item']}>
                       انتخاب شهر جدید
                    </NavDropdown.Item>
                   
                   

                    {renderLogoutButton()}

                

          </NavDropdown> */}

          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
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
                className={`flex-grow-1 pe-3 ${styles["nav-link-wrapper-end"]}  `}
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


                {/* <NavDropdown
                  title= {<bold>حساب من</bold>}
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                  
                  className={styles["nav-dropdown-myaccount"]}
                >
                  <NavDropdown.Item
                    onClick={onClickLogin}
                    href="#"
                    className={styles["nav-dropdown-item"]}
                  >
                    <p>ورود به پنل</p>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={onClickMarketing}
                    href="#"
                    className={styles["nav-dropdown-item"]}
                  >
                     <p>بازاریابی</p>
                  </NavDropdown.Item>

                  {renderLogoutButton()}
                </NavDropdown> */}
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

              {/* <div className={styles["logo-just-mobile"]}>
                
              </div> */}
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      );
    } else {
      return (
        <Container className={styles.navbar_second}>
          <Nav.Link
            style={{
              background: "#bc323a",
              color: "#f9f9f9",
              padding: "5px 12px",
              boxShadow: "0 3px 14px rgba(0, 0, 0, 0.4)",
            }}
            onClick={onClickSelectCity}
          >
            شهر : {selected_city}
          </Nav.Link>
          <Form
            className={`${styles.d_flex} ${styles.navar_brand_center} ${styles.navbar_serach}`}
          >
            <Form.Control
              type="search"
              placeholder={"جستجو شهر و منظقه"}
              className={`'me-2' ${styles["search-input"]}  'form-control-lg' `}
              aria-label="Search"
              onChange={handleChangeInput}
              onClick={handleOnclickInput}
              value={search}
            />
          </Form>

          {/* {locationLi()} */}
          {searchResults()}
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
        {navabrOrSearch()}
        {renderSnackBarAlert()}
      </Navbar>
    </>
  );
}

export default Header;
