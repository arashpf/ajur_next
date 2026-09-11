// import * as React from 'react';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import ListSubheader from '@mui/material/ListSubheader';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import PeopleIcon from '@mui/icons-material/People';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import LayersIcon from '@mui/icons-material/Layers';
// import AssignmentIcon from '@mui/icons-material/Assignment';

// // Convert to a function component that accepts props
// const MainListItems = ({ onCloseMenu, onGrabClicked }) => {
//   // Handle item clicks
//   const handleItemClick = (itemName) => {
//     // Call onGrabClicked if provided
//     if (onGrabClicked) {
//       onGrabClicked(itemName);
//     }
    
//     // Call onCloseMenu if provided
//     if (onCloseMenu) {
//       onCloseMenu();
//     }
//   };

//   return (
//     <React.Fragment>
//       <ListItemButton onClick={() => handleItemClick('Dashboard')}>
//         <ListItemIcon>
//           <DashboardIcon />
//         </ListItemIcon>
//         <ListItemText primary="Dashboard" />
//       </ListItemButton>
//       <ListItemButton onClick={() => handleItemClick('Orders')}>
//         <ListItemIcon>
//           <ShoppingCartIcon />
//         </ListItemIcon>
//         <ListItemText primary="Orders" />
//       </ListItemButton>
//       <ListItemButton onClick={() => handleItemClick('Customers')}>
//         <ListItemIcon>
//           <PeopleIcon />
//         </ListItemIcon>
//         <ListItemText primary="Customers" />
//       </ListItemButton>
//       <ListItemButton onClick={() => handleItemClick('Reports')}>
//         <ListItemIcon>
//           <BarChartIcon />
//         </ListItemIcon>
//         <ListItemText primary="Reports" />
//       </ListItemButton>
//       <ListItemButton onClick={() => handleItemClick('Integrations')}>
//         <ListItemIcon>
//           <LayersIcon />
//         </ListItemIcon>
//         <ListItemText primary="Integrations" />
//       </ListItemButton>
//     </React.Fragment>
//   );
// };

// // Export as default so you can use: import MainListItems from "..."
// export default MainListItems;

// // Keep secondaryListItems as a named export (it's still JSX, not a component)
// export const secondaryListItems = (
//   <React.Fragment>
//     <ListSubheader component="div" inset>
//       Saved reports
//     </ListSubheader>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Current month" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Last quarter" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Year-end sale" />
//     </ListItemButton>
//   </React.Fragment>
// );

import * as React from "react";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import FilterNone from "@mui/icons-material/FilterNone";
import Portrait from "@mui/icons-material/Portrait";
import CampaignIcon from "@mui/icons-material/Campaign";
import { InfoIcon } from "lucide-react";
import Desk from "@mui/icons-material/Desk";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import SupportAgent from "@mui/icons-material/SupportAgent";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import { Clock10Icon, Download, DownloadIcon, TimerIcon } from "lucide-react";
import { LibraryBooks, PrivacyTip } from "@mui/icons-material";

const MainListItems = ({onCloseMenu, onGrabClicked}) => {
  const router = useRouter();

  const onClickDownload = () => {
    router.push("/download");
  };

  const onClickAbout = () => {
    router.push("/about");
  };

  const onClickPrivacy = () => {
    router.push("/privacy-policy");
  };

  const onClickTerms = () => {
    router.push("/terms");
  };

  const onClickLatest = () => {
    router.push("/recents");
  };

  const onClickLogout = () => {
    console.log("you press logout");

    Cookies.remove("id_token");

    router.push("/panel/auth/login");
  };

  const onClickHome = () => {
    const currentPath = router.pathname;
    
    // If we're not exactly on /panel, redirect to /panel
    if (currentPath !== "/panel") {
      router.push("/panel");
    } else {
      // If we're already on /panel, just close the menu
      onCloseMenu();
    }
  };

  const onClickNew = () => {
    router.push("/panel/new");
    if (onGrabClicked) {
      onGrabClicked("new item call it");
    }
    if (onCloseMenu) {
      onCloseMenu();
    }
  };

  const onClickProfile = () => {
    router.push("/panel/profile");
  };

  const onClickMarketing = () => {
    router.push("/marketing/single");
  };
  const onClickSupport = () => {
    router.push("/support");
  };

  const onClickDepartment = () => {
    router.push("/panel/department-entro");
  };

  return (
    <React.Fragment>
      <ListItemButton>
        <ListItemText
          onClick={onClickDownload}
          primary={
            <p
              type="body2"
              style={{ color: "#555", textAlign: "right", paddingRight: 20 }}
            >
              دانلود اپلیکیشن
            </p>
          }
        />
        <ListItemIcon>
          <DownloadIcon />
        </ListItemIcon>
      </ListItemButton>

      <Divider sx={{ my: 1 }} />

      <ListItemButton>
        <ListItemText
          onClick={onClickLatest}
          primary={
            <p
              type="body2"
              style={{ color: "#555", textAlign: "right", paddingRight: 20 }}
            >
              بازدیدهای اخیر
            </p>
          }
        />
        <ListItemIcon>
          <Clock10Icon />
        </ListItemIcon>
      </ListItemButton>

      <Divider sx={{ my: 1 }} />

      <ListItemButton>
        <ListItemText
          onClick={onClickHome}
          primary={
            <p
              type="body2"
              style={{ color: "#555", textAlign: "right", paddingRight: 20 }}
            >
              میز کار
            </p>
          }
        />
        <ListItemIcon>
          <Desk />
        </ListItemIcon>
      </ListItemButton>

      <ListItemButton>
        <ListItemText
          onClick={onClickNew}
          primary={
            <p
              type="body2"
              style={{ color: "#555", textAlign: "right", paddingRight: 20 }}
            >
              ثبت فایل جدید
            </p>
          }
        />
        <ListItemIcon>
          <LibraryAdd />
        </ListItemIcon>
      </ListItemButton>

      <ListSubheader component="div" inset></ListSubheader>
      <ListItemButton>
        <ListItemText
          onClick={onClickProfile}
          primary={
            <p
              type="body2"
              style={{ color: "#555", textAlign: "right", paddingRight: 20 }}
            >
              پروفایل
            </p>
          }
        />
        <ListItemIcon>
          <Portrait />
        </ListItemIcon>
      </ListItemButton>

      {/* <ListItemButton>
        <ListItemText
          onClick={onClickMarketing}
          primary={
            <p
              type="body2"
              style={{ color: "#555", textAlign: "right", paddingRight: 20 }}
            >
              بخش بازاریابی
            </p>
          }
        />
        <ListItemIcon>
          <CampaignIcon />
        </ListItemIcon>
      </ListItemButton> */}

      <ListSubheader component="div" inset></ListSubheader>

      <Divider sx={{ my: 1 }} />

      <ListItemButton>
        <ListItemText
          onClick={onClickAbout}
          primary={
            <p
              type="body2"
              style={{ color: "#555", textAlign: "right", paddingRight: 20 }}
            >
              درباره آجر
            </p>
          }
        />
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
      </ListItemButton>

      {/* <ListItemButton>
        <ListItemText
          onClick={onClickTerms}
          primary={
            <p
              type="body2"
              style={{ color: "#555", textAlign: "right", paddingRight: 20 }}
            >
              قوانین کاربری
            </p>
          }
        />
        <ListItemIcon>
          <LibraryBooks />
        </ListItemIcon>
      </ListItemButton> */}

      <ListItemButton>
        <ListItemText
          onClick={onClickPrivacy}
          primary={
            <p
              type="body2"
              style={{ color: "#555", textAlign: "right", paddingRight: 20 }}
            >
              حریم خصوصی
            </p>
          }
        />
        <ListItemIcon>
          <PrivacyTip />
        </ListItemIcon>
      </ListItemButton>

      <ListItemButton>
        <ListItemText
          onClick={onClickSupport}
          primary={
            <p
              type="body2"
              style={{ color: "#555", textAlign: "right", paddingRight: 20 }}
            >
              پشتیبانی آجر
            </p>
          }
        />
        <ListItemIcon>
          <SupportAgent />
        </ListItemIcon>
      </ListItemButton>

      {/* <ListItemButton>
        <ListItemText
          onClick={onClickDepartment}
          primary={
            <p
              type="body2"
              style={{ color: "#555", textAlign: "right", paddingRight: 20 }}
            >
              دپارتمان مجازی
            </p>
          }
        />
        <ListItemIcon>
          <Diversity1Icon />
        </ListItemIcon>
      </ListItemButton> */}

      <Divider sx={{ my: 3 }} />

      <ListItemButton
        onClick={onClickLogout}
        sx={{
          backgroundColor: "brown",
          "&:hover": {
            backgroundColor: "#a83232", // custom hover color
          },
        }}
      >
        <ListItemText
          primary={
            <p
              type="body2"
              style={{ color: "#fff", textAlign: "right", paddingRight: 20 }}
            >
              خروج از حساب
            </p>
          }
        />
        <ListItemIcon>
          <LogoutIcon sx={{ color: "white" }} />
        </ListItemIcon>
      </ListItemButton>
    </React.Fragment>
  );
};

export default MainListItems;