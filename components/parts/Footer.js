import * as React from "react";
import PropTypes from "prop-types";
import styles from "../styles/Footer.module.css";
import "font-awesome/css/font-awesome.min.css";
import Image from "next/image";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import ShareLocationIcon from "@mui/icons-material/ShareLocation";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import HomeIcon from "@mui/icons-material/Home";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Campaign";

import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";

const Footer = (props) => {
  const router = useRouter();
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);

  const renderFixedFooterNav = () => {
    const onClickHome = () => {
      console.log("home button clicked");
      router.push("/");
    };

    const onClickSearch = () => {
      console.log("search button clicked");
      router.push("/search");
    };
    const onClickFavorites = () => {
      console.log("favorites button clicked");
      router.push("/favorites");
    };

    const onClickMap = () => {
      console.log("map button clicked");
      router.push("/map");
    };

    const onClickNew = () => {
      console.log("new worker clicked");
      router.push("/panel/new-base");
    };

    const onClickMyDashboard = () => {
      console.log("new worker clicked from a person");
      var token = Cookies.get("id_token");
      if (!token) {
        console.log("you have to login");
        Cookies.set("destination_before_auth", "/panel", { expires: 14 });
        router.push("/panel/auth/login");
      } else {
        console.log("you are currently loged in and enjoy");
        console.log(token);
        router.push("/panel");
      }
    };

    const onClickMarketing = () => {
      console.log("new worker clicked from a person");
      var token = Cookies.get("id_token");
      if (token) {
        router.push("/marketing/single");
      } else {
        router.push("/marketing");
      }
    };

    return (
      <div className={styles["fixed-footer-wrapper"]}>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}
        elevation={9}
        
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            onClick={onClickHome}
            label="جستجو"
            icon={<SearchIcon />}
          />
          <BottomNavigationAction
           
            onClick={onClickFavorites}
            label=" پسند ها"
            icon={<FavoriteIcon />}
          />
          <BottomNavigationAction
            onClick={onClickNew}
            label = {
              <p style={{marginTop:'-10px'}}>جدید</p>
            }
            icon={
              <AddCircleIcon
                style={{
                  // marginBottom: 35,
                  paddingBottom: 5,
                  color:'#b9272e',
                  paddingLeft: 10,
                  paddingRight: 10,
                  background: "white",
                  fontSize: 60,
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                  borderTopColor: "#f2f2f2",
                  borderTopWidth: 2,
                  borderTopStyle: "solid",
                }}
              />
            }
          />
          {/* <BottomNavigationAction onClick={onClickMap} label="نقشه"   icon={<ShareLocationIcon />} /> */}
          <BottomNavigationAction
            onClick={onClickMarketing}
            label="بازاریابی"
            icon={<CampaignIcon />}
          />
          <BottomNavigationAction
            onClick={onClickMyDashboard}
            label="آجر مشاور"
            icon={<PersonIcon />}
          />
        </BottomNavigation>
      </Paper>
      </div>
    );
  };

  return (
    <div>
      {renderFixedFooterNav()}
      <footer className={styles["footer-distributed"]}>
        <div className={styles["footer-left"]}>
          <h3>
            Ajur <span> Real Estate </span>
          </h3>

          <p className={styles["footer-links"]}>
            <Link href={"/"}>
              <a className={styles["link-1"]}>صفحه اصلی</a>
            </Link>

            <Link href={"/city-selection"}>
              <a>انتخاب شهر</a>
            </Link>

            <Link href={"/marketing"}>
              <a>بازاریابی</a>
            </Link>

            <Link href={"/about"}>
              <a>درباره آجر</a>
            </Link>

            <Link href={"/support"}>
              <a>پشتیبانی</a>
            </Link>

            {/* <a href="#">Contact</a> */}
          </p>

          <p className={styles["footer-company-name"]}>Ajur © 2024</p>
        </div>

        <div className={styles["footer-icon-wrapper"]}>
          <div>
            <i className="fa fa-map-marker"></i>
            <p>
              <span> Tehran </span>  Iran, Earth
            </p>
          </div>

          <div>
            <i className="fa fa-phone"></i>
            <a href='tel:+989382740488' style={{ fontFamily: "Sans" ,color:'white'}}>+98 938 27 40 488 </a>
          </div>

          <div>
            <i className="fa fa-envelope"></i>
            <p>
              <a href="mailto:support@ajur.app">support@ajur.app</a>
            </p>
          </div>
        </div>

        <div className={styles["footer-right"]}>
          <p
            style={{ textAlign: "right" }}
            className={styles["footer-company-about"]}
          >
            <span>کمی درباره آجر</span>
            آجر مشاور املاکی هوشمند است که در شهرهای مختلف در ایران و خارج از
            کشور فعالیت خواهد داشت استفاده از تکنولوژی های روز دنیا از هوش
            مصنوعی گرفته تا تورهای مجازی ، ایجاد شبکه ای از مشاوران در منطقه و
            ... زیرساخت آجر را پایه گزاری میکنند
          </p>

          <div className={styles["footer-icons"]}>
            <a href="#">
              <i className="fa fa-whatsapp"></i>
            </a>
            <a href="#">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fa fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fa fa-github"></i>
            </a>
          </div>
        </div>

        <div className={styles["footer-big-image-wrapper"]}>
          <img
          className={styles["footer-big-image"]}
            src="/img/tehran.png"
            style={{ width: "100%",height:"100%" }}
            // layout='fill'
          />
        </div>
      </footer>
    </div>
  );
};

export default Footer;
