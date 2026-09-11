import React, { useState, useEffect } from "react";
import PanelLayout from "../../components/layouts/PanelLayout";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import "animate.css";
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
import SpinnerLoader from "../../components/panel/SpinnerLoader";
import Footer from "../../components/parts/Footer";
import SpeedDial from "../../components/panel/SpeedDial";
import WorkerFilter from "../../components/WorkerFilter";
import CatCard2 from "../../components/cards/CatCard2";
import PanelWorkerCard from "../../components/cards/PanelWorkerCard";
import { useRouter } from "next/router";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HomeDial from "../../components/panel/HomeDial";
import styles from "../../components/styles/panel/index.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../../components/panel/parts/Header";
import Department from "../../components/panel/department";
import WorkerTypesInformation from "../../components/panel/WorkerTypesInformation";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import LazyLoader from "../../components/lazyLoader/Loading";

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

const DashboardContent = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [loading, set_loading] = useState(true);
  const [data, set_data] = useState([]);
  const [realstateImage, set_realstateImage] = useState("");
  const [profileImage, set_profileImage] = useState(false);
  const [workers, set_workers] = useState([]);
  const [all_workers, set_all_workers] = useState([]);
  const [selectedcat, set_selectedcat] = useState(0);
  const [subcategories, set_subcategories] = useState([]);
  const [nopost, set_nopost] = useState(false);
  const [key, setKey] = useState("personal");
  const [department, set_department] = useState([]);

  // NEW FILTER STATES
  const [filter, setFilter] = useState("all"); // special/urgent/expired/pending/all
  const [categoryFilteredWorkers, setCategoryFilteredWorkers] = useState([]);
  const [finalFilteredWorkers, setFinalFilteredWorkers] = useState([]);

  // Restore active tab from cookie
  useEffect(() => {
    var cookie_key = Cookies.get("cookie_key");
    if (cookie_key) setKey(cookie_key);
  }, []);

  useEffect(() => {
    Cookies.set("cookie_key", key, { expires: 200 });
  }, [key]);

  // Fetch user + workers
  useEffect(() => {
    var token = Cookies.get("id_token");
    if (!token) {
      router.push("/panel/auth/login");
      return;
    }

    axios({
      method: "get",
      url: "https://api.ajur.app/api/get-user",
      params: { token },
    }).then((response) => {
      set_data(response.data.user);
      set_department(response.data.department);
      set_profileImage(response.data.user.profile_url);
      set_realstateImage(response.data.user.realstate_url);
      set_loading(false);
    });

    axios({
      method: "get",
      url: "https://api.ajur.app/api/realstate-workers",
      params: {
        title: "title",
        lat: 35.12,
        long: 36.11,
        selectedcat: selectedcat,
        token: token,
        collect: "all",
      },
    }).then((response) => {
      set_workers(response.data.workers);
      set_all_workers(response.data.workers);
      set_subcategories(response.data.subcategories);
      set_nopost(response.data.workers.length === 0);
    });
  }, []);

  // When category filter updates → update categoryFilteredWorkers
  useEffect(() => {
    setCategoryFilteredWorkers(workers);
  }, [workers]);

  // Combine category + status filters
  useEffect(() => {
    applyCombinedFilters();
  }, [filter, categoryFilteredWorkers]);

  // Combined filtering
  const applyCombinedFilters = () => {
    let result = [...categoryFilteredWorkers];

    if (filter === "special") {
      result = result.filter((w) => w.is_special);
    } else if (filter === "urgent") {
      result = result.filter((w) => w.is_urgent);
    } else if (filter === "expired") {
      result = result.filter((w) => w.status === "5");
    } else if (filter === "pending") {
      result = result.filter((w) => w.status === "2");
    }

    setFinalFilteredWorkers(result);
  };

  const toggleDrawer = () => setOpen(!open);

  const onClickNew = () => router.push("/panel/new");

  const handleParentClick = (cat) => {
    set_selectedcat(cat.id);
    if (cat === "all") {
      set_workers(all_workers);
    } else {
      set_workers(all_workers.filter((item) => item.category_id == cat.id));
    }
  };

  // RENDER workers
  const renderWorkers = () => {
    if (workers.length === 0) {
      return (
        <Grid container spacing={3} className="animate__animated animate__zoomIn">
          <Grid item xs={2} md={3}></Grid>
          <Grid item xs={8} md={6}>
            <p style={{ textAlign: "center" }}>اولین فایل خود را ثبت کنید</p>
            <div onClick={onClickNew} className={styles.new_single_type_wrapper}>
              <div className={styles.single_icon}></div>
              <div className={styles.single_info}>
                <p>
                  <AddCircleIcon style={{ color: "green", fontSize: 50 }} />
                </p>
              </div>
            </div>
          </Grid>
        </Grid>
      );
    }

    const sortedWorkers = [...finalFilteredWorkers].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return (
      <LazyLoader
        items={sortedWorkers}
        itemsPerPage={8}
        delay={800}
        renderItem={(worker) => (
          <Grid item md={4} xs={12} key={worker.id}>
            <PanelWorkerCard worker={worker} />
          </Grid>
        )}
        loadingComponent={<p style={{ textAlign: "center" }}>در حال بارگذاری...</p>}
        endComponent={
          <p style={{ textAlign: "center" }}>همه فایل‌ها بارگذاری شدند✅</p>
        }
        grid={true}
        gridProps={{ spacing: 3 }}
      />
    );
  };

  // Render Personal tab
  const renderPersonalTab = () => (
    <Container
      maxWidth="lg"
      sx={{ mt: 7, mb: 4, paddingTop: 5, textAlign: "center" }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WorkerFilter
            workers={workers}
            onFilteredWorkersChange={setCategoryFilteredWorkers}
            enableLocalCategoryFilter={true}
            availableCategories={subcategories}
          />
        </Grid>

        <Grid item xs={12}>
          <WorkerTypesInformation
            workers={workers}
            selected={filter}
            onFilterChange={setFilter}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>{renderWorkers()}</Grid>
          </Box>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );

  // Render Department tab
  const renderDepartmentTab = () => {
    if (!department) return null;

    return (
      <Tab
        eventKey="department"
        title={<p>{department.name}</p>}
        className={styles["personal-tab"]}
      >
        <Container
          maxWidth="xlg"
          sx={{ mt: 7, mb: 4, paddingTop: 5, textAlign: "center" }}
        >
          <Grid container spacing={3} sx={{ paddingLeft: 3 }}>
            <Department department={department} user={data} />
          </Grid>
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Tab>
    );
  };

  // Tabs
  const rendertabs = () => (
    <Tabs
      fill
      variant="tabs"
      style={{
        position: "fixed",
        left: 0,
        right: open ? `${drawerWidth}px` : 0,
        width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
        background: "white",
        zIndex: 100,
        boxShadow: "0 4px 2px -2px gray",
      }}
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
    >
      <Tab
        eventKey="personal"
        title={<p>فایل ها ({all_workers.length})</p>}
        className={styles["personal-tab"]}
      >
        {renderPersonalTab()}
      </Tab>

      {renderDepartmentTab()}
    </Tabs>
  );

  if (loading) {
    return (
      <>
        <SpinnerLoader />
        <Footer />
      </>
    );
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header
          data={data}
          open={open}
          onToggle={toggleDrawer}
          drawerWidth={drawerWidth}
          profileImage={profileImage}
        />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[0]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            marginRight: open ? `${drawerWidth}px` : 0,
          }}
        >
          {rendertabs()}
        </Box>
      </Box>

      <SpeedDial open={open} drawerWidth={drawerWidth} />

      {typeof window !== "undefined" &&
        require("../../components/parts/Footer").default &&
        React.createElement(require("../../components/parts/Footer").default)}
    </ThemeProvider>
  );
};

export default DashboardContent;

DashboardContent.getLayout = function (page) {
  return <PanelLayout>{page}</PanelLayout>;
};
