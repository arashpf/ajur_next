import React, { useState, useEffect } from "react";
import PanelLayout from "../../components/layouts/PanelLayout";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Phone, Edit, Verified } from "@mui/icons-material";

import SpinnerLoader from "../../components/panel/SpinnerLoader";
import SpeedDial from "../../components/panel/SpeedDial";
import ProfilePicker from "../../components/pickers/ProfilePicker";
import Header from "../../components/panel/parts/Header";

import axios from "axios";
import Cookies from "js-cookie";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});

const primaryColor = "#a92b21";
const primaryDark = "#700000";
const backgroundColor = "#f8f9fa";
const cardColor = "#7fa5bbff";

const customTheme = createTheme({
  direction: "rtl",
  palette: {
    primary: { main: primaryColor, dark: primaryDark },
    background: { default: backgroundColor },
  },
  typography: {
    fontFamily: "IRANSans, sans-serif",
  },
});

const ProfileCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${cardColor} 0%, #2c3e50 100%)`,
  color: "white",
  borderRadius: "16px",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: "0 8px 32px rgba(52, 73, 85, 0.3)",
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: primaryColor,
  color: "white",
  borderRadius: "8px",
  padding: "10px 24px",
  fontWeight: "bold",
  fontFamily: "IRANSans, sans-serif",
  "&:hover": {
    backgroundColor: primaryDark,
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px rgba(169, 43, 33, 0.4)`,
  },
}));

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3, textAlign: "right" }}>{children}</Box>}
    </div>
  );
}

const RTLTextField = ({ label, value, onChange, placeholder, multiline = false, rows = 1 }) => (
  <Box sx={{ display: "flex", flexDirection: "column", mb: 3, textAlign: "right" }}>
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#333", textAlign: "right" }}>
      {label}
    </Typography>
    {multiline ? (
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          fontSize: "1rem",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "2px solid #e0e0e0",
          fontFamily: "IRANSans, sans-serif",
          resize: "vertical",
          minHeight: "120px",
          width: "100%",
          transition: "all 0.3s ease",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = primaryColor;
          e.target.style.boxShadow = `0 0 0 2px ${primaryColor}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e0e0e0";
          e.target.style.boxShadow = "none";
        }}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          fontSize: "1rem",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "2px solid #e0e0e0",
          fontFamily: "IRANSans, sans-serif",
          width: "100%",
          transition: "all 0.3s ease",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = primaryColor;
          e.target.style.boxShadow = `0 0 0 2px ${primaryColor}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e0e0e0";
          e.target.style.boxShadow = "none";
        }}
      />
    )}
  </Box>
);

const Profile = () => {
  const [open_alert, setOpenAlert] = useState(false);
  const [loading, set_loading] = useState(true);
  const [data, set_data] = useState([]);
  const [profileImage, set_profileImage] = useState(false);
  const [realstate, set_realstate] = useState([]);
  const [realstate_name, set_realstate_name] = useState("");
  const [name, set_name] = useState("");
  const [family, set_family] = useState("");
  const [verified, set_verified] = useState(false);
  const [description, set_description] = useState("");
  const [problem, setProblem] = useState("");
  const [alert_type, set_alert_type] = useState("success");
  const [tabValue, setTabValue] = useState(0);

  function handleClose() {
    setOpenAlert(false);
  }

  useEffect(() => {
    const token = Cookies.get("id_token");
    if (!token) return;

    axios.get("https://api.ajur.app/api/get-user", { params: { token } }).then((res) => {
      set_data(res.data.user);
      set_realstate(res.data.user);
      set_profileImage(res.data.user.profile_url);
      set_realstate_name(res.data.user.realstate);
      set_name(res.data.user.name);
      set_family(res.data.user.family);
      set_verified(Number(res.data.user.verified));
      set_description(res.data.user.description);
      set_loading(false);
    });
  }, []);

  const onclickEdit = () => {
    if (!name || !family) {
      setProblem(!name ? "نام را وارد کنید" : "فامیلی را وارد کنید");
      set_alert_type("warning");
      setOpenAlert(true);
      return;
    }
    if (name.length < 3 || family.length < 3) {
      setProblem(name.length < 3 ? "نام حداقل باید ۳ حرف باشد" : "فامیلی حداقل باید ۳ حرف باشد");
      set_alert_type("warning");
      setOpenAlert(true);
      return;
    }
    const token = Cookies.get("id_token");
    axios.post("https://api.ajur.app/api/edit-realestate", null, {
      params: { token, name, family, realstate: realstate_name, description },
    }).then((response) => {
      if (response.status === 200) {
        set_alert_type("success");
        setProblem("پروفایل با موفقیت بروز شد");
        setOpenAlert(true);
      } else {
        setProblem("خطایی رخ داده");
        setOpenAlert(true);
      }
    });
  };

  const handleTabChange = (e, v) => setTabValue(v);

  if (loading) return <SpinnerLoader />;

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header data={data} open={false} onToggle={() => {}} drawerWidth={250} profileImage={profileImage} />

        <Box component="main" sx={{ flexGrow: 1, py: 10, backgroundColor, minHeight: "100vh", marginTop: 6 }}>
          <Container maxWidth="lg">
            {/* بخش پروفایل */}
            <ProfileCard>
              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{
                  flexDirection: { xs: "column-reverse", md: "row" },
                  justifyContent: "flex-end",
                  textAlign: "right",
                }}
              >
                {/* نوشته‌ها کنار عکس */}
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    mb: { xs: 2, md: 0 },
                    mr: { md: 2 },
                    gap: "4px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {name} {family}
                    </Typography>
                    {verified && <Verified sx={{ fontSize: 28, color: "#1976d2" }} />}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                    <Phone sx={{ fontSize: 20, color: "white" }} />
                    <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
                      {data.phone || "۰۹۱۲XXX‌۳۴۵"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                    <Rating
                      value={parseFloat(realstate.stars) || 0}
                      readOnly
                      precision={0.5}
                      sx={{ "& .MuiRating-iconFilled": { color: "#ffd700" }, direction: "ltr" }}
                    />
                    <Typography variant="body2" sx={{ color: "white", opacity: 0.8 }}>
                      ({realstate.clients || realstate.rating_count || 0} نظر)
                    </Typography>
                  </Box>
                </Grid>

                {/* عکس پروفایل */}
                <Grid item xs="auto" sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <ProfilePicker img={realstate.profile_url} size={100} />
                </Grid>
              </Grid>
            </ProfileCard>

            {/* Tabs و فرم‌ها */}
            <Paper sx={{ mt: 3, borderRadius: "12px", overflow: "hidden", textAlign: "right" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  direction: "rtl",
                  "& .MuiTab-root": { fontWeight: "bold", fontFamily: "IRANSans, sans-serif", textAlign: "right" },
                  "& .Mui-selected": { color: `${primaryColor} !important` },
                  "& .MuiTabs-indicator": { backgroundColor: primaryColor },
                }}
              >
                <Tab label="اطلاعات شخصی" />
                <Tab label="فعالیت‌ها" />
              </Tabs>

              {/* اطلاعات شخصی */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ textAlign: "right", direction: "rtl" }}>
                  <RTLTextField
                    label="نام مشاور املاک"
                    value={realstate_name}
                    onChange={(e) => set_realstate_name(e.target.value)}
                    placeholder="نام دفتر یا شرکت املاک"
                  />
                  <RTLTextField label="نام" value={name} onChange={(e) => set_name(e.target.value)} placeholder="نام خود را وارد کنید" />
                  <RTLTextField label="نام خانوادگی" value={family} onChange={(e) => set_family(e.target.value)} placeholder="نام خانوادگی خود را وارد کنید" />
                  <RTLTextField
                    label="درباره من"
                    value={description}
                    onChange={(e) => set_description(e.target.value)}
                    multiline
                    rows={4}
                    placeholder="کمی درباره فعالیت خود توضیح دهید"
                  />
                  <PrimaryButton fullWidth startIcon={<Edit sx={{ mr: 1.5 }} />} onClick={onclickEdit} sx={{ mt: 3, py: 1.5 }}>
                    ثبت تغییرات
                  </PrimaryButton>
                </Box>
              </TabPanel>

              {/* فعالیت‌ها */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ textAlign: "right", direction: "rtl" }}>
                  <Typography variant="h6" sx={{ py: 4 }}>
                    فعالیت‌های اخیر شما اینجا نمایش داده می‌شود
                  </Typography>
                </Box>
              </TabPanel>
            </Paper>
          </Container>
        </Box>

        <SpeedDial />
        <Snackbar
          open={open_alert}
          autoHideDuration={10000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity={alert_type} sx={{ width: "100%" }}>
            {problem}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;

Profile.getLayout = function (page) {
  return <PanelLayout>{page}</PanelLayout>;
};
