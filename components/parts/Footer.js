import * as React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";


import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";

const Footer = () => {
  const router = useRouter();
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  const prevValueRef = React.useRef(0);
  const touchStartRef = React.useRef(null);
  const touchMovedRef = React.useRef(false);
  // assistant overlay removed: keep only refs used for touch handling

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // keep the footer selector in sync with current route
  const routeToIndex = (path) => {
    if (!path) return 0;
    // strip query/hash
    const base = path.split('?')[0].split('#')[0];
    if (base === '/' || base === '/index' || base === '/search') return 0;
    if (base.startsWith('/assistant')) return 1;
    if (base.startsWith('/panel/new')) return 2;
    if (base.startsWith('/favorites')) return 3;
    if (base.startsWith('/panel')) return 4;
    // fallback to home
    return 0;
  };

  React.useEffect(() => {
    try {
      const base = router && router.asPath ? router.asPath.split('?')[0] : router.pathname;
      const idx = routeToIndex(base);
      setValue(idx);
    } catch (err) {
      // ignore
    }
  }, [router && router.asPath]);

  // overlay-related effects removed

  const renderFixedFooterNav = () => {
  const onClickHome = () => {
      console.log("home button clicked");
      // close assistant if open and navigate only if we're not already on '/'
      const base = router && router.asPath ? router.asPath.split('?')[0] : router.pathname;
      if (base !== "/") router.push("/");
    };

    const onClickSearch = () => {
      console.log("search (home) button clicked");
      // close assistant if open and navigate only if we're not already on '/'
      const base = router && router.asPath ? router.asPath.split('?')[0] : router.pathname;
      if (base !== "/") router.push("/");
    };
    const onClickFavorites = () => {
      console.log("favorites button clicked");
      // close assistant if open and navigate only if we're not already on '/favorites'
      const base = router && router.asPath ? router.asPath.split('?')[0] : router.pathname;
      if (base !== "/favorites") router.push("/favorites");
    };

    const onClickMap = () => {
      console.log("map button clicked");
      // close assistant if open and navigate only if we're not already on '/map'
      const base = router && router.asPath ? router.asPath.split('?')[0] : router.pathname;
      if (base !== "/map") router.push("/map");
    };

    const onClickNew = () => {
     
       
       
      const token = Cookies.get('id_token');
      if (token) {
          router.push("/panel/new");
      }else{
        router.push("/panel/auth/login");
        Cookies.set("destination_before_auth", "/panel/new", { expires: 14 });
        
      }

      // close assistant if open and navigate only if we're not already on '/panel/new'
      // const base = router && router.asPath ? router.asPath.split('?')[0] : router.pathname;
      // if (base !== "/panel/new") router.push("/panel/new"); 
    };

    const onClickMyDashboard = () => {
      console.log("new worker clicked from a person");
      var token = Cookies.get("id_token");
      // close assistant and navigate according to auth, but avoid pushing the same route
      if (!token) {
        Cookies.set("destination_before_auth", "/panel", { expires: 14 });
        setValue(0);
        const base = router && router.asPath ? router.asPath.split('?')[0] : router.pathname;
        if (base !== "/panel/auth/login") router.push("/panel/auth/login");
      } else {
        console.log("you are currently loged in and enjoy");
        console.log(token);
        setValue(4);
        const base = router && router.asPath ? router.asPath.split('?')[0] : router.pathname;
        if (base !== "/panel") router.push("/panel");
      }
    };
    const onClickMarketing = () => {
      console.log("new worker clicked from a person");
      var token = Cookies.get("id_token");
      // close assistant and navigate according to auth, but avoid re-pushing same route
      const base = router && router.asPath ? router.asPath.split('?')[0] : router.pathname;
      if (token) {
        if (base !== "/marketing/single") router.push("/marketing/single");
      } else {
        if (base !== "/marketing") router.push("/marketing");
      }
    };

    // build the footer node and portal it into document.body when mounted so stacking works
    const footerNode = (
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
          bottom: -4,
          left: 0,
          right: 0,
          // render footer above backdrop by placing it into body via portal; give it higher z-index
          zIndex: 1000,

          // use the CSS variable so JS and CSS share the same source of truth
          height: 'var(--bottom-nav-height)',
          background: 'rgba(255, 255, 255, 0)',
          // backdropFilter: 'blur(6px)',
          // WebkitBackdropFilter: 'blur(6px)',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          margin: '0 0',
          // borderRadius: '37px',
          // margin: '0 2px 1px',
          overflow: 'visible',
          // boxShadow: "0 -6px 18px rgba(0,0,0,0.05)",
        }}
      >
  <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 0, width: 'min(720px, calc(100% - 40px))', height: 'calc(var(--bottom-nav-height) - 4px)', borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0 0 0', boxSizing: 'border-box' }}>
      {/* subtle background oval (moved up a bit and slightly smaller) */}
      <div style={{ position: 'absolute', left: 0, right: 0, height: 52, bottom: 7, margin: '0 auto', borderRadius: 9999, background: 'rgba(236, 236, 236, 0.8)   ', backdropFilter: 'blur(12px) saturate(1.1)', WebkitBackdropFilter: 'blur(6px)', boxShadow: 'inset -4px 3px 15px rgba(199, 199, 199, 0.29)',}} />

        {/* active pill: centered both vertically and horizontally within each tab slot - adjusted for 5 items */}
      <div style={{ position: 'absolute', top: '53%', left: `${value === 0 ? '10%' : value === 1 ? '30%' : value === 2 ? '50%' : value === 3 ? '70%' : '90%'}`, height: value === 2 ? 0 : 53, width: value === 2 ? 0 : `calc(20% - 5px)`, borderRadius: 9999, transform: 'translate(-50%, -50%)', transition: 'left 520ms cubic-bezier(0.175,0.885,0.32,1.275), height 320ms ease, width 320ms ease', boxShadow: value === 2 ? 'none' : '0 8px 20px rgba(185,39,46,0.14), inset 0 2px 6px rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(192,36,42,0.9), rgba(170,30,36,0.75))', border: '1px solid rgba(255,255,255,0.06)', zIndex: 2 }} aria-hidden />
  <div onClick={() => { setValue(0); onClickHome(); }} role="button" aria-label="خانه" style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '8px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <HomeIcon style={{ color: value === 0 ? '#fff' : 'rgba(0,0,0,0.50)', fontSize: 26 }} />
            </div>
          </div>
      <div
            role="button"
            aria-label="دستیار هوشمند"
            style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '8px 0' }}
            onTouchStart={(e) => {
              touchMovedRef.current = false;
              e && e.stopPropagation && e.stopPropagation();
              if (e.touches && e.touches[0]) touchStartRef.current = e.touches[0].clientY;
            }}
            onTouchMove={(e) => {
              if (!touchStartRef.current) return;
              const currentY = e.touches && e.touches[0] ? e.touches[0].clientY : null;
              if (currentY !== null && Math.abs(currentY - touchStartRef.current) > 10) {
                touchMovedRef.current = true;
              }
            }}
        onTouchEnd={(e) => {
              e && e.stopPropagation && e.stopPropagation();
              e && e.preventDefault && e.preventDefault();
              if (!touchMovedRef.current) {
                prevValueRef.current = value;
                setValue(1);
                try {
                  const base = router && router.asPath ? router.asPath.split('?')[0] : router.pathname;
                  if (base !== "/assistant") router.push("/assistant");
                } catch (err) {
                  // ignore routing errors
                }
              }
              touchStartRef.current = null;
              touchMovedRef.current = false;
            }}
            onClick={(e) => {
              e && e.stopPropagation && e.stopPropagation();
              e && e.preventDefault && e.preventDefault();
              if (touchMovedRef.current) return;
              prevValueRef.current = value;
              setValue(1);
              try {
                const base = router && router.asPath ? router.asPath.split('?')[0] : router.pathname;
                if (base !== "/assistant") router.push("/assistant");
              } catch (err) {
                // ignore routing errors
              }
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <AutoAwesomeIcon style={{ color: value === 1 ? '#fff' : 'rgba(0,0,0,0.50)', fontSize: 30 }} />
            </div>
          </div>
          <div onClick={() => { setValue(2); onClickNew(); }} role="button" aria-label="افزودن جدید" style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '8px 0' }}>
            <div style={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #ff3030, #d41c1c)', boxShadow: '0 6px 20px rgba(255, 48, 48, 0.4)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
            </div>
          </div>
          <div onClick={() => { setValue(3); onClickFavorites(); }} role="button" aria-label="موردعلاقه ها" style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '8px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <FavoriteBorderIcon style={{ color: value === 3 ? '#fff' : 'rgba(0,0,0,0.50)', fontSize: 26 }} />
            </div>
          </div>
          <div onClick={() => { setValue(4); onClickMyDashboard(); }} role="button" aria-label="پروفایل" style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '8px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <PersonIcon style={{ color: value === 4 ? '#fff' : 'rgba(0,0,0,0.50)', fontSize: 26 }} />
            </div>
          </div>
        </div>
      </div>
      {/*</Paper>*/}
      </div>
    );

    if (typeof document !== 'undefined' && mounted) {
      return ReactDOM.createPortal(footerNode, document.body);
    }

    return footerNode;
  };

  return (
    <div>
      {renderFixedFooterNav()}

  {/* assistant overlay removed: footer now only handles tab selection without opening an overlay */}
  {/* site footer removed — keep only bottom navbar + assistant */}

    </div>
  );
};

export default Footer;