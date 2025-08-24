import * as React from "react";
import styles from "../styles/Footer.module.css";
import "font-awesome/css/font-awesome.min.css";
import Image from "next/image";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import CampaignIcon from "@mui/icons-material/Campaign";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";

import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";

const Footer = () => {
  const router = useRouter();
  const [value, setValue] = React.useState(0);

  const renderFixedFooterNav = () => {
    const onClickHome = () => router.push("/");
    const onClickSearch = () => router.push("/search");
    const onClickFavorites = () => router.push("/favorites");
    const onClickNew = () => router.push("/panel/new-base");
    const onClickMyDashboard = () => {
      const token = Cookies.get("id_token");
      if (!token) {
        Cookies.set("destination_before_auth", "/panel", { expires: 14 });
        router.push("/panel/auth/login");
      } else {
        router.push("/panel");
      }
    };
    const onClickMarketing = () => {
      const token = Cookies.get("id_token");
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
            onChange={(event, newValue) => setValue(newValue)}
          >
            <BottomNavigationAction onClick={onClickSearch} label="جستجو" icon={<SearchIcon />} />
            <BottomNavigationAction onClick={onClickFavorites} label="پسندها" icon={<FavoriteIcon />} />
            <BottomNavigationAction
              onClick={onClickNew}
              label={<p style={{ marginTop: "-10px" }}>جدید</p>}
              icon={
                <AddCircleIcon
                  style={{
                    paddingBottom: 5,
                    color: "#b9272e",
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
            <BottomNavigationAction onClick={onClickMarketing} label="بازاریابی" icon={<CampaignIcon />} />
            <BottomNavigationAction onClick={onClickMyDashboard} label="آجر مشاور" icon={<PersonIcon />} />
          </BottomNavigation>
        </Paper>
      </div>
    );
  };

  return (
    <div>
      {renderFixedFooterNav()}

      <footer className={styles.footer}>
        {/* معرفی آجر */}
        <section className={styles.footerContainer}>
          <section className={styles.header}>
            <h2>مشاوره املاک هوشمند آجر</h2>
            <p>
              تا حالا خرید یا فروش ملک انقدر ساده و مطمئن نبوده! آجر با یک ایده‌ی نو برای اولین بار در ایران اومده
              که تجربه‌ی ملک‌دار شدن رو براتون شیرین‌تر کنه. تیم مجرب و حرفه‌ای ما کنارتونه تا توی هر قدم بهترین
              همراهی رو داشته باشید.
            </p>
          </section>

          {/* لینک‌های سریع */}
          <section className={styles.quickLinks}>
            <h3>لینک‌های سریع</h3>
            <ul>
              <li><Link href="/support">پشتیبانی</Link></li>
              <li><Link href="/about">درباره‌ی آجر</Link></li>
              <li><Link href="/marketing">بازاریابی</Link></li>
              <li><Link href="/city-selection">انتخاب شهر</Link></li>
              <li><Link href="/">صفحه‌ی اصلی</Link></li>
            </ul>
          </section>
        </section>

        {/* ارتباط با ما */}
        <div className={styles.contactSection}>
          <h2 className={styles.contactTitle}>ارتباط با ما</h2>

          <div className={styles.contactGrid}>
            <div className={styles.contactCol}>
              <div className={styles.contactItem} onClick={() => window.open("https://www.instagram.com/ajur_real_estate", "_blank")}>
                <div className={styles.iconCircle}>
                  <img src="/icons/instagram.svg" alt="Instagram" width={24} height={24} />
                </div>
                <p>ajur_real_estate</p>
              </div>

              <div className={styles.contactItem} onClick={() => window.open("https://t.me/ajur_real_estate", "_blank")}>
                <div className={styles.iconCircle}>
                  <img src="/icons/telegram.svg" alt="Telegram" width={24} height={24} />
                </div>
                <p>ajur_real_estate</p>
              </div>

              <div className={styles.contactItem} onClick={() => window.open("https://wa.me/989382740488", "_blank")}>
                <div className={styles.iconCircle}>
                  <img src="/icons/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
                </div>
                <p>ajur_real_estate</p>
              </div>
            </div>

            <div className={styles.contactCol}>
              <div className={styles.contactItem} onClick={() => window.open("https://goo.gl/maps/5Z1b7z8f35x", "_blank")}>
                <div className={styles.iconCircle}>
                  <img src="/icons/location.svg" alt="Location" width={24} height={24} />
                </div>
                <p>ایران، تهران، رباط‌کریم، آزادگان چهارم</p>
              </div>

              <div className={styles.contactItem} onClick={() => window.open("tel:02140557301")}>
                <div className={styles.iconCircle}>
                  <img src="/icons/call.svg" alt="Call" width={24} height={24} />
                </div>
                <p>021 40557301</p>
              </div>

              <div className={styles.contactItem} onClick={() => window.open("mailto:support@ajur.app")}>
                <div className={styles.iconCircle}>
                  <img src="/icons/email.svg" alt="Email" width={24} height={24} />
                </div>
                <p>support@ajur.app</p>
              </div>
            </div>
          </div>
        </div>

        {/* تصویر تهران */}
        <div className={styles.cityImage}>
          <Image
            src="/img/tehran.png"
            alt="تصویر تهران"
            layout="fill"
            objectFit="cover"
            objectPosition="bottom"
            priority
          />
        </div>
      </footer>
    </div>
  );
};

export default Footer;