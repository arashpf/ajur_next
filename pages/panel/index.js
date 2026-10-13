// pages/panel/index.js
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
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
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

// ------------------------------------------------------------------
// Tab labels (Persian display names for the status tabs)
// ------------------------------------------------------------------
const TAB_LABELS = {
  all: "همه",
  special: "ویژه",
  urgent: "فوری",
  expired: "منقضی",
  pending: "در انتظار",
  disapproved: "رد شده",
};

// ------------------------------------------------------------------
// Search helper — score-based matching
// ------------------------------------------------------------------
//   title match         → 100
//   description match   → 60
//   city match          → 40
//   neighbourhood       → 40
//   region              → 30
//   formatted address   → 20
//   category name       → 15
//   properties (values) → 10
// Higher score = better match. Used to sort the results.
// ------------------------------------------------------------------
const scoreWorkerAgainstQuery = (worker, query) => {
  if (!query) return 0;

  const q = query.trim().toLowerCase();
  if (!q) return 0;

  // Normalize Persian/Arabic digits → Latin for numeric matches
  const normalizeDigits = (s) =>
    String(s).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

  const qNorm = normalizeDigits(q);

  const scoreField = (field, weight) => {
    if (!field) return 0;
    const f = normalizeDigits(String(field).toLowerCase());
    return f.includes(qNorm) ? weight : 0;
  };

  let score = 0;

  // 1. title / name — highest priority
  score += scoreField(worker.name, 100);
  score += scoreField(worker.title, 100);

  // 2. description
  score += scoreField(worker.description, 60);

  // 3. city
  score += scoreField(worker.city, 40);

  // 4. neighbourhood
  score += scoreField(worker.neighbourhood, 40);

  // 5. region
  score += scoreField(worker.region, 30);

  // 6. formatted address
  score += scoreField(worker.formatted, 20);

  // 7. category name
  score += scoreField(worker.cat_name, 15);
  score += scoreField(worker.category_name, 15);

  // 8. json_properties values (price, area, etc.)
  if (worker.json_properties) {
    try {
      const props =
        typeof worker.json_properties === "string"
          ? JSON.parse(worker.json_properties)
          : worker.json_properties;
      if (Array.isArray(props)) {
        for (const p of props) {
          score += scoreField(p.name, 5);
          score += scoreField(p.value, 10);
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return score;
};

const DashboardContent = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [loading, set_loading] = useState(true);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
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

  // FILTER STATES
  const [filter, setFilter] = useState("all");
  const [categoryFilteredWorkers, setCategoryFilteredWorkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    })
      .then((response) => {
        set_workers(response.data.workers);
        set_all_workers(response.data.workers);
        set_subcategories(response.data.subcategories);
        set_nopost(response.data.workers.length === 0);
        setLoadingWorkers(false);
      })
      .catch((err) => {
        console.error("realstate-workers fetch error:", err);
        setLoadingWorkers(false);
      });
  }, []);

  // When category filter updates → update categoryFilteredWorkers
  useEffect(() => {
    setCategoryFilteredWorkers(workers);
  }, [workers]);

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

  // Handler for successful delete — removes from every derived list
  const handleDeleteSuccess = (id) => {
    set_workers((prev) => prev.filter((w) => w.id !== id));
    set_all_workers((prev) => prev.filter((w) => w.id !== id));
    setCategoryFilteredWorkers((prev) => prev.filter((w) => w.id !== id));
  };

  // RENDER workers
  const renderWorkers = () => {
    // 1. Still loading → show spinner
    if (loadingWorkers) {
      return (
        <Grid
          container
          spacing={3}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            minHeight: 260,
          }}
        >
          <Grid item>
            <SpinnerLoader />
          </Grid>
        </Grid>
      );
    }

    // 2. Loaded but no workers at all → empty state
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

    // 3. Apply search filter (score-based, sorted by relevance)
    const trimmedQuery = searchQuery.trim();
    let result = [...categoryFilteredWorkers];

    if (trimmedQuery) {
      const scored = result
        .map((w) => ({ w, score: scoreWorkerAgainstQuery(w, trimmedQuery) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);
      result = scored.map((entry) => entry.w);
    }

    // 4. Apply status filter
    if (filter === "special") {
      result = result.filter((w) => w.is_special);
    } else if (filter === "urgent") {
      result = result.filter((w) => w.is_urgent);
    } else if (filter === "expired") {
      result = result.filter((w) => w.status === "5");
    } else if (filter === "pending") {
      result = result.filter((w) => w.status === "2");
    } else if (filter === "disapproved") {
      result = result.filter((w) => w.status === "4");
    }

    // 5. Sort by created_at (unless in search mode)
    const sortedWorkers = trimmedQuery
      ? result
      : result.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

    // 6. Empty after filters/search
    if (sortedWorkers.length === 0) {
      // How many would we get if the user switched to "همه"?
      const wouldMatchAll = trimmedQuery
        ? categoryFilteredWorkers.filter(
            (w) => scoreWorkerAgainstQuery(w, trimmedQuery) > 0
          ).length
        : 0;

      const showSwitchHint =
        trimmedQuery && filter !== "all" && wouldMatchAll > 0;

      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", py: 5, color: "#666" }}>
              {showSwitchHint ? (
                <>
                  <Typography
                    sx={{
                      fontFamily: "iransans, Arial, sans-serif",
                      fontSize: 15,
                      mb: 1.5,
                    }}
                  >
                    هیچ فایلی با «{trimmedQuery}» در «{TAB_LABELS[filter]}» پیدا
                    نشد
                  </Typography>

                  <Box
                    onClick={() => setFilter("all")}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 2,
                      py: 0.75,
                      borderRadius: "10px",
                      border: "1px solid #1976d2",
                      color: "#1976d2",
                      fontFamily: "iransans, Arial, sans-serif",
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                      },
                    }}
                  >
                    همه را ببینید ({wouldMatchAll} مورد)
                  </Box>
                </>
              ) : (
                <Typography
                  sx={{
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 15,
                  }}
                >
                  {trimmedQuery
                    ? `نتیجه‌ای برای «${trimmedQuery}» یافت نشد`
                    : "موردی با این فیلتر یافت نشد"}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      );
    }

    // 7. Render list
    return (
      <LazyLoader
        items={sortedWorkers}
        itemsPerPage={8}
        delay={800}
        renderItem={(worker) => (
          <Grid item md={4} xs={12} key={worker.id}>
            <PanelWorkerCard
              worker={worker}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </Grid>
        )}
        loadingComponent={
          <p style={{ textAlign: "center" }}>در حال بارگذاری...</p>
        }
        endComponent={
          <p style={{ textAlign: "center" }}>همه فایل‌ها بارگذاری شدند✅</p>
        }
        grid={true}
        gridProps={{ spacing: 3 }}
      />
    );
  };

  // Render Personal tab
  const renderPersonalTab = () => {
    if (loadingWorkers) {
      return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
          >
            <SpinnerLoader />
          </Box>
        </Container>
      );
    }

    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 3 }}>
        <Grid container spacing={2}>
          {/* -------- SEARCH BOX -------- */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`جستجو در فایل های ${
                  TAB_LABELS[filter] || "همه"
                } (عنوان، توضیحات، محله، منطقه، قیمت...)`}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#999" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery("")}
                        edge="end"
                      >
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  maxWidth: 640,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 14,
                    backgroundColor: "#fff",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                  "& .MuiInputBase-input": {
                    textAlign: "right",
                    direction: "rtl",
                    fontFamily: "iransans, Arial, sans-serif",
                    padding: "12px 8px",
                  },
                }}
              />
            </Box>
          </Grid>

          {/* -------- WORKER FILTER (category dropdown etc.) -------- */}
          <Grid item xs={12}>
            <WorkerFilter
              workers={workers}
              onFilteredWorkersChange={setCategoryFilteredWorkers}
              enableLocalCategoryFilter={true}
              availableCategories={subcategories}
            />
          </Grid>

          {/* -------- STATUS TABS -------- */}
          <Grid item xs={12}>
            <WorkerTypesInformation
              workers={workers}
              selected={filter}
              onFilterChange={setFilter}
            />
          </Grid>

          {/* -------- LIST -------- */}
          <Grid item xs={12}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {renderWorkers()}
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    );
  };

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