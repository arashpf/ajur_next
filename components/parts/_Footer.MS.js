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
import SmartToyIcon from '@mui/icons-material/SmartToy';

import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";

const Footer = (props) => {
  const router = useRouter();
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  const [assistantOpen, setAssistantOpen] = React.useState(false);
  const touchStartRef = React.useRef(null);
  const touchMovedRef = React.useRef(false);
  const ignoreBackdropClicksRef = React.useRef(false);
  const ignoreTimerRef = React.useRef(null);
  const sheetRef = React.useRef(null);
  const dragStartYRef = React.useRef(null);
  const draggingRef = React.useRef(false);
  const [sheetTranslate, setSheetTranslate] = React.useState(0); // px
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const SHEET_TOP_OFFSET = 88; // px of space to keep at top when expanded (keeps header/controls visible)

  React.useEffect(() => {
    // Prevent background scrolling when assistant is open (don't modify touchAction so child touch works)
    const prevOverflow = document.body.style.overflow;
    if (assistantOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [assistantOpen]);

  React.useEffect(() => {
    // cleanup timer on unmount
    return () => {
      if (ignoreTimerRef.current) {
        clearTimeout(ignoreTimerRef.current);
        ignoreTimerRef.current = null;
      }
    };
  }, []);

  const renderFixedFooterNav = () => {
    const onClickHome = () => {
      console.log("home button clicked");
  // close assistant if open and navigate
  setAssistantOpen(false);
  setValue(0);
  router.push("/");
    };

    const onClickSearch = () => {
      console.log("search (home) button clicked");
  // close assistant if open and navigate
  setAssistantOpen(false);
  setValue(0);
  router.push("/");
    };
    const onClickFavorites = () => {
      console.log("favorites button clicked");
  // close assistant if open and navigate
  setAssistantOpen(false);
  setValue(0);
  router.push("/favorites");
    };

    const onClickMap = () => {
      console.log("map button clicked");
  // close assistant if open and navigate
  setAssistantOpen(false);
  setValue(0);
  router.push("/map");
    };

    const onClickNew = () => {
      console.log("new worker clicked");
  // close assistant if open and navigate
  setAssistantOpen(false);
  setValue(0);
  router.push("/panel/new-base");
    };

    const onClickMyDashboard = () => {
      console.log("new worker clicked from a person");
      var token = Cookies.get("id_token");
      if (!token) {
        console.log("you have to login");
        Cookies.set("destination_before_auth", "/panel", { expires: 14 });
  // close assistant and navigate to login
  setAssistantOpen(false);
  setValue(0);
  router.push("/panel/auth/login");
      } else {
        console.log("you are currently loged in and enjoy");
        console.log(token);
  // close assistant and navigate
  setAssistantOpen(false);
  setValue(4);
  router.push("/panel");
      }
    };

    const onClickMarketing = () => {
      console.log("new worker clicked from a person");
      var token = Cookies.get("id_token");
      // close assistant and navigate according to auth
      setAssistantOpen(false);
      setValue(0);
      if (token) {
        router.push("/marketing/single");
      } else {
        router.push("/marketing");
      }
    };

    return (
      <div className={styles["fixed-footer-wrapper"]}>
      {/*
      <div
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}
        elevation={9}
      >
      */}
  {/* original BottomNavigation moved to Footer.legacy.js */}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          // increased zIndex so footer/nav stays above assistant overlay (overlay zIndex = 30)
          zIndex: 60,

          height: 76,
          background: 'rgba(255, 255, 255, 0)',
          // backdropFilter: 'blur(6px)',
          // WebkitBackdropFilter: 'blur(6px)',
          borderTopLeftRadius: 27,
          borderTopRightRadius: 27,
          margin: '0 2px',
          // borderRadius: '37px',
          // margin: '0 2px 1px',
          overflow: 'visible',
          // boxShadow: "0 -6px 18px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 10, width: 'min(720px, calc(100% - 40px))', height: 56, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'rgba(255, 255, 255, 1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: ' 0 5px 15px rgba(0, 0, 0, 0.17)' }} />
      <div style={{ position: 'absolute', top: 6, left: 6, height: 'calc(100% - 12px)', width: `calc((100% - 12px) / 5)`, borderRadius: 9999, transform: `translateX(${value * 100}%)`, transition: 'transform 320ms cubic-bezier(.2,.9,.2,1)', boxShadow: '0 8px 20px rgba(185,39,46,0.14), inset 0 2px 6px rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(192,36,42,0.9), rgba(170,30,36,0.75))', border: '1px solid rgba(255,255,255,0.06)', zIndex: 2 }} aria-hidden />
      <div onClick={() => { setValue(0); setAssistantOpen(false); onClickHome(); }} role="button" aria-label="خانه" style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <HomeIcon style={{ color: value === 0 ? '#fff' : 'rgba(0,0,0,0.50)', fontSize: 26 }} />
        <span style={{ fontSize: 12, color: value === 0 ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.70)' }}>خانه</span>
            </div>
          </div>
      <div onClick={() => { setValue(1); setAssistantOpen(false); onClickMap(); }} role="button" aria-label="نقشه" style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <ShareLocationIcon style={{ color: value === 1 ? '#fff' : 'rgba(0,0,0,0.50)', fontSize: 26 }} />
              <span style={{ fontSize: 12, color: value === 1 ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.70)' }}>نقشه</span>
            </div>
      </div>
      <div
            role="button"
            aria-label="دستیار هوشمند"
            style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onTouchStart={(e) => {
              // record start Y to detect swipe vs tap
              touchMovedRef.current = false;
              // prevent parent/backdrop from also handling this touch
              e && e.stopPropagation && e.stopPropagation();
              if (e.touches && e.touches[0]) touchStartRef.current = e.touches[0].clientY;
            }}
            onTouchMove={(e) => {
              if (!touchStartRef.current) return;
              const currentY = e.touches && e.touches[0] ? e.touches[0].clientY : null;
              if (currentY !== null && Math.abs(currentY - touchStartRef.current) > 10) {
                touchMovedRef.current = true; // treat as scroll/drag
              }
            }}
            onTouchEnd={(e) => {
              // if finger didn't move significantly, treat as tap
              // stop propagation so sibling buttons/backdrop don't receive this touchend
              e && e.stopPropagation && e.stopPropagation();
              e && e.preventDefault && e.preventDefault();

              if (!touchMovedRef.current) {
                // toggle: if already open, close and revert to home
                if (assistantOpen || value === 2) {
                  setAssistantOpen(false);
                  setValue(0);
                } else {
                  setValue(2);
                  setAssistantOpen(true);
                  // ignore immediate backdrop clicks caused by this gesture
                  ignoreBackdropClicksRef.current = true;
                  if (ignoreTimerRef.current) clearTimeout(ignoreTimerRef.current);
                  ignoreTimerRef.current = setTimeout(() => {
                    ignoreBackdropClicksRef.current = false;
                    ignoreTimerRef.current = null;
                  }, 350);
                }
              }
              touchStartRef.current = null;
              touchMovedRef.current = false;
            }}
            onClick={(e) => {
              // stop propagation so other handlers (backdrop) don't receive this click
              e && e.stopPropagation && e.stopPropagation();
              e && e.preventDefault && e.preventDefault();
              // ignore synthetic click if it was a touch-drag
              if (touchMovedRef.current) return;
              // toggle on click as well
              if (assistantOpen || value === 2) {
                setAssistantOpen(false);
                setValue(0);
              } else {
                setValue(2);
                setAssistantOpen(true);
                ignoreBackdropClicksRef.current = true;
                if (ignoreTimerRef.current) clearTimeout(ignoreTimerRef.current);
                ignoreTimerRef.current = setTimeout(() => {
                  ignoreBackdropClicksRef.current = false;
                  ignoreTimerRef.current = null;
                }, 350);
              }
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <SmartToyIcon style={{ color: value === 2 ? '#fff' : 'rgba(0,0,0,0.50)', fontSize: 30 }} />
              <span style={{ fontSize: 12, color: value === 2 ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.70)' }}>دستیار هوشمند</span>
            </div>
          </div>
          <div onClick={() => { if (value === 3) { setAssistantOpen(false); setValue(0); } else { setAssistantOpen(false); setValue(3); onClickFavorites(); } }} role="button" aria-label="موردعلاقه ها" style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <FavoriteBorderIcon style={{ color: value === 3 ? '#fff' : 'rgba(0,0,0,0.50)', fontSize: 26 }} />
              <span style={{ fontSize: 12, color: value === 3 ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.70)' }}>موردعلاقه ها</span>
            </div>
          </div>
          <div onClick={() => { if (value === 4) { setAssistantOpen(false); setValue(0); } else { setAssistantOpen(false); setValue(4); onClickMyDashboard(); } }} role="button" aria-label="املاک من" style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <PersonIcon style={{ color: value === 4 ? '#fff' : 'rgba(0,0,0,0.50)', fontSize: 26 }} />
              <span style={{ fontSize: 12, color: value === 4 ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.70)' }}>املاک من</span>
            </div>
          </div>
        </div>
      </div>
      {/*</Paper>*/}
      </div>
    );
  };

  return (
    <div>
      {renderFixedFooterNav()}

      {/* Assistant bottom-sheet overlay */}
  <div style={{ position: 'fixed', inset: 0, zIndex: 30, pointerEvents: assistantOpen ? 'auto' : 'none', visibility: assistantOpen ? 'visible' : 'hidden' }} aria-hidden={!assistantOpen}>
        {/* Backdrop */}
        <div
          onClick={() => {
            // ignore backdrop clicks immediately after opening via the FAB/button
            if (ignoreBackdropClicksRef.current) return;
            setAssistantOpen(false);
            setValue(0);
          }}
          onTouchEnd={() => {
            if (ignoreBackdropClicksRef.current) return;
            setAssistantOpen(false);
            setValue(0);
          }}
          onMouseDown={() => {
            if (ignoreBackdropClicksRef.current) return;
            setAssistantOpen(false);
            setValue(0);
          }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.36)', opacity: assistantOpen ? 1 : 0, transition: 'opacity 220ms ease', backdropFilter: 'blur(2px)' }}
        />

        {/* Sheet */}
  <div
    role="dialog"
    aria-modal="true"
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: isFullScreen ? '100vh' : '60vh',
      maxHeight: isFullScreen ? '100vh' : '72vh',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      background: '#ffffff',
      transform: assistantOpen ? `translateY(${sheetTranslate}px)` : 'translateY(100%)',
      transition: draggingRef.current ? 'none' : 'transform 320ms cubic-bezier(.2,.9,.2,1)',
      boxShadow: '0 -24px 50px rgba(0,0,0,0.28)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      touchAction: 'auto'
    }}
  >
          <div
            ref={sheetRef}
            style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', touchAction: 'none' }}
          >
            <div
              role="button"
              aria-label="grab"
              onTouchStart={(e) => {
                if (!assistantOpen) return;
                draggingRef.current = true;
                dragStartYRef.current = e.touches && e.touches[0] ? e.touches[0].clientY : null;
              }}
              onTouchMove={(e) => {
                if (!draggingRef.current || dragStartYRef.current == null) return;
                const y = e.touches && e.touches[0] ? e.touches[0].clientY : null;
                if (y == null) return;
                const delta = y - dragStartYRef.current; // positive = down, negative = up
                // allow both directions; limit to viewport height for safety
                const viewport = (typeof window !== 'undefined') ? window.innerHeight : 1000;
                const maxUp = Math.max(0, viewport - SHEET_TOP_OFFSET);
                const clamped = Math.max(-maxUp, Math.min(viewport, delta));
                setSheetTranslate(clamped);
              }}
              onTouchEnd={() => {
                if (!draggingRef.current) return;
                draggingRef.current = false;
                const threshold = 80; // px to close/expand
                const delta = sheetTranslate;
                if (delta > threshold) {
                  // dragged down -> close
                  setAssistantOpen(false);
                  setValue(0);
                } else if (delta < -threshold) {
                  // dragged up -> expand to full screen
                  setIsFullScreen(true);
                } else {
                  // small movement -> if we were fullscreen and small down-drag, exit fullscreen
                  if (isFullScreen && delta > threshold * 0.5) {
                    setIsFullScreen(false);
                  }
                }
                setSheetTranslate(0);
                dragStartYRef.current = null;
              }}
              onMouseDown={(e) => {
                if (!assistantOpen) return;
                draggingRef.current = true;
                dragStartYRef.current = e.clientY;
                // attach move/up to window for mouse
                const onMove = (ev) => {
                  if (!draggingRef.current || dragStartYRef.current == null) return;
                  const delta = ev.clientY - dragStartYRef.current;
                  const viewport = (typeof window !== 'undefined') ? window.innerHeight : 1000;
                  const maxUp = Math.max(0, viewport - SHEET_TOP_OFFSET);
                  const clamped = Math.max(-maxUp, Math.min(viewport, delta));
                  setSheetTranslate(clamped);
                };
                const onUp = (ev) => {
                  draggingRef.current = false;
                  const delta = ev.clientY - (dragStartYRef.current || 0);
                  const threshold = 80;
                  if (delta > threshold) {
                    setAssistantOpen(false);
                    setValue(0);
                  } else if (delta < -threshold) {
                    setIsFullScreen(true);
                  } else if (isFullScreen && delta > threshold * 0.5) {
                    setIsFullScreen(false);
                  }
                  setSheetTranslate(0);
                  dragStartYRef.current = null;
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
              style={{ width: 48, height: 5, borderRadius: 9999, background: 'rgba(0,0,0,0.18)' }}
            />
            <button aria-label="بستن" onClick={() => { setAssistantOpen(false); setValue(0); }} style={{ position: 'absolute', right: 8, top: 6, background: 'transparent', border: 'none', fontSize: 22, lineHeight: 1, cursor: 'pointer' }}>×</button>
          </div>

          <div style={{ padding: 16, overflow: 'auto', flex: 1 }}>
            {/* Assistant content placeholder - replace with real content as needed */}
            <h3 style={{ marginTop: 0 }}>دستیار هوشمند</h3>
            <p style={{ color: '#444' }}>این پنل دستیار هوشمند است. محتوای اینجا قرار می‌گیرد — می‌توانید فرم‌ها یا چت بات را در اینجا سوار کنید.</p>
          </div>
        </div>
      </div>
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
