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
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";
import dynamic from "next/dynamic";
const LocationForm = dynamic(
  () => import("../../components/panel/new/LocationForm"),
  { ssr: false }
);

import ProfilePicker from "../../components/pickers/ProfilePicker";
import DepartmentProfilePicker from "../../components/pickers/DepartmentProfilePicker";
import Stars from "../../components/others/Stars";

var token = Cookies.get("id_token");

import axios from "axios";
import Cookies from "js-cookie";
import Header from "../../components/panel/parts/Header";
// import Alerter from "../../components/alerts/Alerter";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/router";
import department from "../../components/panel/department";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});
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

const NewDepartment = (props) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [open_alert, setOpenAlert] = React.useState(false);

  const [loading, set_loading] = useState(true);
  const [data, set_data] = useState([]);
  const [departmentImage, set_departmentImage] = useState("");
  const [profileImage, set_profileImage] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [cat, set_cat] = React.useState([]);
  const [basecategories, set_basecategories] = useState([]);
  const [returnedWorker, set_returnedWorker] = useState([]);
  const [department, set_department] = useState([]);
  const [realstate, set_realstate] = useState([]);
  const [department_name, set_department_name] = useState("");
  const [department_id, set_department_id] = useState("");
  const [name, set_name] = useState("");
  const [family, set_family] = useState("");
  const [description, set_description] = useState("");
  const [rules, set_rules] = useState("");

  const [problem, setProblem] = useState("username_test_problem");
  const [vertical, set_vertical] = useState("top");
  const [horizontal, set_horizontal] = useState("center");
  const [alert_type, set_alert_type] = useState("success");

  // Add all the functions here that the child can call.

  function handleClose() {
    setOpenAlert(false);
    console.log("close snack is cliked");
  }

  useEffect(() => {
    var token = Cookies.get("id_token");
    if (!token) {
      console.log("you have to login");
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
      set_realstate(response.data.user);
      set_profileImage(response.data.user.profile_url);
      if(response.data.department){

        set_department(response.data.department);

        if(response.data.department.role == 'رییس'){
         
          setProblem("خوش اومدی رییس");
          set_alert_type("success");
          setOpenAlert(true);
        }else{

          setProblem("شما از قبل عضو "+response.data.department.name + 'هستید');
          set_alert_type("warning");
          setOpenAlert(true);

          router.push("/panel");
        }
        set_department_name(response.data.department.name);
        set_department_id(response.data.department.id);
        set_description(response.data.department.description);
        set_rules(response.data.department.rules);
        set_departmentImage(response.data.department.avatar);
      }
      
      set_name(response.data.user.name);
      set_family(response.data.user.family);
      
      
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

  const onclickEdit = () => {
    console.log("edit clicked");

    // const [realstate_name, set_realstate_name] = useState("agency");
    // const [name, set_name] = useState("arash");
    // const [family, set_family] = useState("pf");
    // const [description, set_description] = useState("description");
    if (!name) {
      setProblem("نام دپارتمان  را وارد کنید");
      set_alert_type("warning");
      setOpenAlert(true);
      return;
    }

    if (!family) {
      setProblem("فامیلی  را وارد کنید");
      set_alert_type("warning");
      setOpenAlert(true);
      return;
    }
    if (name.length < 3) {
      setProblem("نام حد اقل باید ۳ حرف باشد");
      set_alert_type("warning");
      setOpenAlert(true);
      return;
    } else if (family.length < 3) {
      setProblem("فامیلی  حد اقل باید ۳ حرف باشد");
      set_alert_type("warning");
      setOpenAlert(true);
      return;
    }


    if(department){

      // if(department.role !== 'رییس'){
        
      //   set_alert_type("warning");
      //   setProblem("فقط رییس میتواند دپارتمان را ویرایش کند"); 
      //   setOpenAlert(true);
      // return;
      // }

    }
    

    axios({
      method: "post",
      url: "https://api.ajur.app/api/edit-department",
      params: {
        token: token,
        name: name,
        family: family,
        department_name: department_name,
        department_id:department_id,
        description: description,
        rules:rules
      },
    }).then(function (response) {
      console.log("the response from the edit-department");
      console.log(response.data);
      if (response.data.status == 200) {
        console.log("edited successfully");

        if(response.data.kind == 'new'){
            set_alert_type("success");
            setProblem("دپارتمان جدید با موفقیت ایجاد شد");
        }

        else if(response.data.kind == 'edit'){
            set_alert_type("success");
            setProblem("دپارتمان  با موفقیت ویرایش شد"); 
        }
        

        router.push("/panel");
        setOpenAlert(true);
      }else if (response.data.status == 504){

        set_alert_type("warning");
        setProblem("فقط ریاست میتواند دپارتمان را ویرایش کند"); 
        setOpenAlert(true);

      } else {
        console.log("something wrong with edit-realestate");
        setProblem("خطایی رخ داده");
        setOpenAlert(true);
      }
    });
  };

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

          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper
              variant="outlined"
              sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            >
              {/* <h3 style={{textAlign:'right',fontSize:18,paddingTop:20}}>  پروفایل مشاور   {data.realstate}</h3> */}

              {/* <Button style={{marginTo:20,marginBottom:20,fontSize:20}} variant="contained" color="success">وضعیت : فعال</Button> */}

              <Grid container spacing={3} sx={{ my: { xs: 0 } }}>
                <Grid
                  item
                  xs={12}
                  md={12}
                  style={{ textAlign: "center", margin: 10 }}
                >
                  <DepartmentProfilePicker department_id={department_id} img={department.avatar} size={120} />
                  <Stars amount={department.stars} />
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ my: { xs: 0 } }}>
                <Grid item xs={12} md={12}>
                  <TextField
                    required
                    id="Name"
                    label="نام دپارتمان"
                    fullWidth
                    autoComplete="cc-name"
                    value={department_name}
                    variant="standard"
                    onChange={(title) => set_department_name(title.target.value)}
                    style={{ textAlign: "right", direction: "rtl" }}
                  />
                </Grid>

                <Grid item xs={6} md={6}>
                  <TextField
                    required
                    disabled
                    id="Name"
                    label="فامیلی رییس دپارتمان"
                    fullWidth
                    value={family}
                    autoComplete="cc-name"
                    variant="standard"
                    onChange={(title) => set_family(title.target.value)}
                    style={{ textAlign: "right", direction: "rtl" }}
                  />
                </Grid>

                <Grid item xs={6} md={6}>
                  <TextField
                    required
                    disabled
                    id="Name"

                    label="نام رییس دپارتمان"
                    fullWidth
                    autoComplete="cc-name"
                    value={name}
                    variant="standard"
                    onChange={(title) => set_name(title.target.value)}
                    style={{ textAlign: "right", direction: "rtl" }}
                  />
                </Grid>
              </Grid>

              <TextField
                required
                id="Name"
                label="درباره دپارتمان "
                fullWidth
                multiline={true}
                minRows={3}
                maxRows={10}
                inputProps={{ maxLength: 3000 }}
                placeholder="کمی درباره فعالیت دپارتمان املاک"
                value={description}
                autoComplete="cc-name"
                variant="outlined"
                onChange={(description) =>
                  set_description(description.target.value)
                }
                style={{ textAlign: "right", marginTop: 40 }}
              />

              <TextField
                required
                id="Name"
                label="قوانین دپارتمان"
                fullWidth
                multiline={true}
                minRows={3}
                maxRows={10}
                inputProps={{ maxLength: 3000 }}
                placeholder="مثلا درصد پورسانت مشاورین و ساعت های کار در صورت حضور فیزیکی در دپارتمان"
                value={rules}
                autoComplete="cc-name"
                variant="outlined"
                onChange={(rl) =>
                  set_rules(rl.target.value)
                }
                style={{ textAlign: "right", marginTop: 40 }}
              />
            </Paper>

            <ButtonGroup aria-label="outlined primary button group" fullWidth>
              <Button
                style={{ fontSize: 18 }}
                onClick={onclickEdit}
                variant="contained"
                color="success"
              >
                ثبت تغییرات
              </Button>
              {/* <Button variant="outlined" color="warning">بازگشت به خانه</Button> */}
            </ButtonGroup>

            <Copyright />
          </Container>

          {/* end of the componet inside section  */}
        </Box>
        <SpeedDial />
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open_alert}
          autoHideDuration={10000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={alert_type}
            sx={{ width: "100%" }}
          >
            {problem}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    );
  }
};

export default NewDepartment;
NewDepartment.getLayout = function (page) {
  return <PanelLayout>{page}</PanelLayout>;
};
