import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ProfilePicker from "../../pickers/ProfilePicker";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import MainListItems from "../../panel/listItems";
import { useRouter } from "next/router";

// import { MainListItems } from "../../panel/listItems";

const Header = (props) => {
  const data = props.data;
  const profileImage = props.profileImage;
  const drawerWidth = props.drawerWidth || 400;
  const theme = useTheme();
  const router = useRouter();

  // detect mobile vs desktop
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Use localStorage to persist the drawer state
  const [open, setOpen] = useState(() => {
    // Check if there's a saved state in localStorage
    const savedState = localStorage.getItem('header-drawer-open');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('header-drawer-open', JSON.stringify(open));
  }, [open]);

  // Handle Android back button press
  useEffect(() => {
    const handleBackButton = (event) => {
      // If drawer is open on mobile, close it and prevent default back behavior
      if (isMobile && open) {
        // Prevent the default back navigation
        event.preventDefault();
        
        // Close the drawer
        setOpen(false);
        
        // Push a dummy state to prevent the browser from actually going back
        window.history.pushState(null, '', window.location.pathname);
        
        // Optional: Show a message or just close silently
        console.log("Drawer closed via back button");
      }
    };

    // Add event listener for popstate (back/forward buttons)
    window.addEventListener('popstate', handleBackButton);

    // Push initial state to enable back button handling when drawer is opened
    if (isMobile) {
      window.history.pushState({ drawerInitial: true }, '', window.location.pathname);
    }

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [isMobile, open]);

  // Alternative: Handle back button with Next.js router
  useEffect(() => {
    const handleRouteChange = (url) => {
      // If drawer is open and we're navigating back, close the drawer
      if (isMobile && open) {
        // Check if this is a back navigation
        const isBackNavigation = url === window.location.pathname;
        if (isBackNavigation) {
          setOpen(false);
        }
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [isMobile, open, router]);

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 10,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open &&
      !isMobile && {
        marginRight: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
  }));

  const toggleDrawer = () => {
    const newOpenState = !open;
    setOpen(newOpenState);
    
    // When opening drawer on mobile, push a new state to handle back button
    if (isMobile && newOpenState) {
      // Push a new history state so that back button will trigger our handler
      window.history.pushState({ drawerOpen: true }, '', window.location.pathname);
    }
  };

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "fixed",
      right: 0,
      top: 0,
      height: "100vh",
      width: isMobile ? "100%" : drawerWidth,
      whiteSpace: "nowrap",
      boxSizing: "border-box",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      ...(open
        ? {}
        : {
            overflowX: "hidden",
            width: 0,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }),
    },
  }));

  return (
    <>
      <AppBar style={{ background: "#b92a31" }} position="absolute" open={open}>
        <Toolbar>
          {/* Profile picture on the left */}
          <Box sx={{ flexGrow: 0, mr: 2 }}>
            <ProfilePicker img={profileImage} size={50} />
          </Box>

          {/* Center title */}
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {data.name} {data.family} | {data.phone}
          </Typography>

          {/* Menu button on the right */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label={open ? "close drawer" : "open drawer"}
            onClick={toggleDrawer}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer that opens from right */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            right: 0,
            left: "auto",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronRightIcon />
          </IconButton>
          <a
            href="/panel/profile"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            "{data.realstate}" املاک
          </a>
        </Toolbar>
        <Divider />
        <List component="nav">
          <MainListItems
            onCloseMenu={() => setOpen(false)}
            onGrabClicked={(value) => {
              console.log(
                "clicked from mainlist item and trigered in parent controll",
                value
              );
              setOpen(false);
            }}
          />
        </List>
      </Drawer>
    </>
  );
};

export default Header;