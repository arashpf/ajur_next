import React, { useState, useEffect } from "react";
import PanelLayout from "../../components/layouts/PanelLayout";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MainListItems from "../../components/panel/listItems";
import Chart from "../../components/panel/Chart";
import Deposits from "../../components/panel/Deposits";
import Orders from "../../components/panel/Orders";
import SpinnerLoader from "../../components/panel/SpinnerLoader";
import SpeedDial from "../../components/panel/SpeedDial";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import CategoryForm from "../../components/panel/new/CategoryForm";
import MainForm from "../../components/panel/new/MainForm";
import dynamic from "next/dynamic";
import Header from "../../components/panel/parts/Header";
const LocationForm = dynamic(
  () => import("../../components/panel/new/LocationForm"),
  { ssr: false }
);
import { useRouter } from "next/router";

import axios from "axios";
import Cookies from "js-cookie";
const steps = ["اطلاعات عمومی", "فیلدها", "نقشه"];

const theme = createTheme();

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://ajur.app">
        Ajur.app
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 250;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(0),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(0),
      },
    }),
  },
}));

const mdTheme = createTheme();

//start of the main functin

const New = (props) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [loading, set_loading] = useState(true);
  const [data, set_data] = useState([]);
  const [realstateImage, set_realstateImage] = useState("");
  const [profileImage, set_profileImage] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [cat, set_cat] = React.useState([]);
  const [basecategories, set_basecategories] = useState([]);
  const [returnedWorker, set_returnedWorker] = useState([]);
  const [edit_id, set_edit_id] = useState(null);
  const [edit_cat_id, set_edit_cat_id] = useState(null);

  useEffect(() => {
    console.log("this is a edit one not a brand new file !!!!!!");

    if (router.query.edit_id !== undefined) {
    }
  }, []);

  useEffect(() => {
    console.log("this is a edit one not a brand new file !!!!!!");

    if (router.query.edit_id !== undefined) {
      set_edit_id(router.query.edit_id);
      set_edit_cat_id(router.query.edit_cat_id);
    }
  }, [router.query.edit_id]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const grabSavedPostData = (value) => {
    // try to attach locations specific data to post and finalize it with changing its status to 2
    // for appearing in admin confirmation section
    console.log(
      "there is grabed post data sended with axios in child componet and here"
    );
    console.log(value.value.worker);
    set_returnedWorker(value.value.worker);
    setActiveStep(activeStep + 1);
  };

  function getStepContent(step) {
    const onClickSingleCategory = (cat) => {
      console.log("cat clicked");
      console.log(cat);
      set_cat(cat);
      setActiveStep(activeStep + 1);
    };

    switch (step) {
      case 0:
        return (
          <CategoryForm
            edit_id={edit_id}
            edit_cat_id={edit_cat_id}
            onClickSingleCategory={(value) => {
              console.log("your value -->", value);
              onClickSingleCategory(value);
            }}
          />
        );
      case 1:
        return (
          <MainForm
            edit_id={edit_id}
            cat={cat}
            grabSavedPostData={(value) => {
              console.log(
                "the posted data with status 3 in parent section   -->",
                value
              );
              grabSavedPostData(value);
            }}
          />
        );
      case 2:
        return (
          <LocationForm edit_id={edit_id} returnedWorker={returnedWorker} />
        );
      default:
        throw new Error("Unknown step");
    }
  }

  useEffect(() => {
    var token = Cookies.get("id_token");
    if (!token) {
      console.log("you have to login");
      router.push("/panel/auth/login");
    } else {
      console.log("you are currently loged in and enjoy");
      console.log(token);
    }

    axios({
      method: "get",
      url: "https://api.ajur.app/api/get-user",
      params: {
        token: token,
      },
    }).then(function (response) {
      console.log("the response from the get-user");
      console.log(response.data);

      set_data(response.data.user);
      set_profileImage(response.data.user.profile_url);
      set_realstateImage(response.data.user.realstate_url);

      if (response.data.user.is_realstate == 0) {
        router.push("/panel/agent_agreement");
      }
      set_loading(false);
    });

    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  //function called from the CategoryForm

  //end of the function called from CategoryForm

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOpenUserMenu = () => {
    console.log("user avatar clicked");
  };

  if (loading) {
    return <SpinnerLoader />;
  } else {
    return (
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Header data={data} open={open} profileImage={profileImage} />

          {/* start of the componet inside seciotn  */}

          <Container component="main" maxWidth="md" sx={{ mb: 4  }}>
            <Paper
              variant="outlined"
              sx={{ my: { xs: 5, md: 6 }, p: { xs: 3, md: 3 } }}
            >
              <p style={{ textAlign: "center" }}> ثبت ملک جدید</p>
              <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    Thank you for your order.
                  </Typography>
                  <Typography variant="subtitle1">
                    Your order number is #2001539. We have emailed your order
                    confirmation, and will send you an update when your order
                    has shipped.
                  </Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>{getStepContent(activeStep)}</React.Fragment>
              )}
            </Paper>
            <Copyright />
          </Container>

          {/* end of the componet inside section  */}
        </Box>
      </ThemeProvider>
    );
  }
};

export default New;
New.getLayout = function (page) {
  return <PanelLayout>{page}</PanelLayout>;
};
