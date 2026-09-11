import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import CallCharts from "../../../components/panel/charts/CallCharts";
import SpecialCharts from "../../../components/panel/charts/SpecialCharts";
import UrgentCharts from "../../../components/panel/charts/UrgentCharts";

import CallDetails from "../../../components/panel/details/CallDetails";
import UrgentDetails from "../../../components/panel/details/UrgentDetails";
import SpecialDetails from "../../../components/panel/details/SpecialDetails";

import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Paper
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";

export default function BoostPage() {
  const router = useRouter();
  const { worker_id } = router.query;

  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState(null);
  const [modalPlan, setModalPlan] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showFreeModal, setShowFreeModal] = useState(false);


  // Independent selections
  const [selectedUrgent, setSelectedUrgent] = useState(null);
  const [selectedSpecial, setSelectedSpecial] = useState(null);
  const [selectedCalls, setSelectedCalls] = useState(null);

  useEffect(() => {
    if (!worker_id) return;
    async function loadData() {
      try {
        const res = await axios.get("https://api.ajur.app/api/upgrade-plans", {
          params: { worker_id },
        });

        console.log('------------------------000000-------------------------');
        console.log(JSON.stringify(res.data.data));
        setWorker(res.data.data);
      } catch (err) {
        setError("Cannot load worker info.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [worker_id]);

  const urgentPlans = [
    {
      id: "urgent_7",
      type: "urgent",
      days: 7,
      price: 29000,
      color: "#f57c00",
      label: "فوری",
      desc: "نمایش بالای آگهی‌های عادی",
      modalDesc:
        "با انتخاب پلن فوری ۷ روزه، آگهی شما به مدت ۷ روز در بالای تمام آگهی‌های عادی نمایش داده می‌شود. این پلن برای جذب سریع مشتری مناسب است.",
    },
    {
      id: "urgent_14",
      type: "urgent",
      days: 14,
      price: 49000,
      color: "#f57c00",
      label: "فوری",
      desc: "افزایش بازدید برای ۱۴ روز",
      modalDesc:
        "پلن فوری ۱۴ روزه به شما امکان می‌دهد آگهی‌تان را برای دو هفته در صدر نتایج نگه دارید و بازدید بیشتری دریافت کنید.",
    },
    {
      id: "urgent_30",
      type: "urgent",
      days: 30,
      price: 89000,
      color: "#f57c00",
      label: "فوری",
      desc: "بیشترین نمایش برای ۳۰ روز",
      modalDesc:
        "بهترین گزینه برای نمایش طولانی‌مدت. آگهی شما یک ماه کامل در بالای لیست فوری‌ها قرار می‌گیرد و بیشترین دیده شدن را خواهید داشت.",
    },
  ];

  const specialPlans = [
    {
      id: "special_7",
      type: "special",
      days: 7,
      price: 49000,
      color: "#8e24aa",
      label: "ویژه",
      desc: "نمایش در بالای لیست",
      modalDesc:
        "آگهی ویژه ۷ روزه آگهی شما را با برچسب ویژه در بالاترین موقعیت لیست نمایش می‌دهد و توجه کاربران را بیشتر جلب می‌کند.",
    },
    {
      id: "special_14",
      type: "special",
      days: 14,
      price: 89000,
      color: "#8e24aa",
      label: "ویژه",
      desc: "نمایش در بالای لیست",
      modalDesc:
        "با پلن ویژه ۱۴ روزه، آگهی شما دو هفته در جایگاه ویژه قرار می‌گیرد. مناسب برای کسانی که به دنبال نتیجه پایدارتر هستند.",
    },
    {
      id: "special_30",
      type: "special",
      days: 30,
      price: 169000,
      color: "#8e24aa",
      label: "ویژه",
      desc: "نمایش در بالای لیست",
      modalDesc:
        "پلن ویژه ۳۰ روزه کامل‌ترین گزینه برای نمایش ویژه است. یک ماه حضور مداوم در صدر لیست با بیشترین نرخ تبدیل.",
    },
  ];

  const callPlans = [
    {
      id: "calls_10",
      type: "calls",
      calls: 10,
      price: 99000,
      color: "#1565c0",
      label: "تماسی",
      desc: "10 تماس بیشتر",
      modalDesc:
        "با این بسته ۱۰ تماس اضافه به حساب شما افزوده می‌شود. مناسب برای آگهی‌هایی که تازه منتشر شده‌اند.",
    },
    {
      id: "calls_30",
      type: "calls",
      calls: 30,
      price: 219000,
      color: "#1565c0",
      label: "تماسی",
      desc: "30 تماس بیشتر",
      modalDesc:
        "بسته ۳۰ تماسی برای آگهی‌هایی که بازدید بالایی دارند ایده‌آل است. با این بسته می‌توانید پاسخگوی تماس‌های بیشتری باشید.",
    },
    {
      id: "calls_50",
      type: "calls",
      calls: 50,
      price: 299000,
      color: "#1565c0",
      label: "تماسی",
      desc: "50 تماس بیشتر",
      modalDesc:
        "بهترین ارزش برای پرتقاضاترین آگهی‌ها. ۵۰ تماس اضافه با کمترین هزینه به ازای هر تماس.",
    },
  ];

  const totalPrice =
    (selectedUrgent?.price || 0) +
    (selectedSpecial?.price || 0) +
    (selectedCalls?.price || 0);

  async function handleCheckout() {
    if (!selectedUrgent && !selectedSpecial && !selectedCalls) {
      return alert("لطفاً حداقل یک پلن انتخاب کنید.");
    }

    try {
      const payload = {
        worker_id,
        plans: [],
        total_price: totalPrice,
      };

      if (selectedUrgent) {
        payload.plans.push({
          type: "urgent",
          plan_id: selectedUrgent.id,
          days: selectedUrgent.days,
          price: selectedUrgent.price,
        });
      }

      if (selectedSpecial) {
        payload.plans.push({
          type: "special",
          plan_id: selectedSpecial.id,
          days: selectedSpecial.days,
          price: selectedSpecial.price,
        });
      }

      if (selectedCalls) {
        payload.plans.push({
          type: "calls",
          plan_id: selectedCalls.id,
          calls: selectedCalls.calls,
          price: selectedCalls.price,
        });
      }

      const res = await axios.post(
        "https://api.ajur.app/api/post-upgrade",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Laravel response:", res.data);

      if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
        return;
      }

      alert("خرید با موفقیت انجام شد");
      router.push("/success");
    } catch (err) {
      console.error("Checkout error:", err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("خطا در پردازش خرید. لطفاً دوباره تلاش کنید.");
      }
    }
  }

  if (loading)
    return (
      <Box p={5} textAlign="center">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box p={5} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );

  // Diagonal corner ribbon
  const DiagonalRibbon = ({ label, color }) => (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderWidth: "0 64px 64px 0",
        borderColor: `transparent ${color} transparent transparent`,
        zIndex: 1,
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          top: 6,
          right: -58,
          color: "white",
          fontSize: "10px",
          fontWeight: "bold",
          transform: "rotate(45deg)",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  // Section title row - title on right, info button on left
  const SectionTitle = ({ title, sectionDesc, sectionDesc2, sectionColor }) => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb={2}
      direction="rtl"
    >
      <p variant="h6" fontWeight="bold" sx={{ fontSize: 18 }}>
        {title}
      </p>

      <IconButton
        size="small"
        onClick={() =>
          setModalPlan({
            label: title,
            modalDesc: sectionDesc,
            modalDesc2: sectionDesc2,
            color: sectionColor,
          })
        }
        sx={{ color: sectionColor, gap: 0.4, borderRadius: "8px", px: 0.5 }}
      >
        <InfoOutlinedIcon fontSize="small" />
        <Typography fontSize={12} color={"gray"} fontWeight="500">
          توضیحات بیشتر
        </Typography>
      </IconButton>
    </Box>
  );


  const renderFreePlanSection = () => (
    <Box mt={3} mb={2} textAlign="center">
      <Button
        variant="text"
        onClick={() => setShowFreeModal(true)}
        sx={{
          color: "text.secondary",
          fontSize: 13,
          textDecoration: "underline",
          fontFamily: "iransans",
          "&:hover": { backgroundColor: "transparent", color: "#555" },
        }}
      >
        ادامه رایگان بدون خرید اشتراک
      </Button>
  
      <Dialog
        open={showFreeModal}
        onClose={() => setShowFreeModal(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            direction: "rtl",
            px: 1,
            minWidth: { xs: "85vw", sm: 400 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography fontWeight="bold" fontSize={17}>
            ادامه رایگان
          </Typography>
        </DialogTitle>
  
        <DialogContent>
          <Typography fontSize={14} color="text.secondary" lineHeight={2}>
            تمام امکانات پایه آجر به صورت رایگان برای آگهی شما فعال میشود ، هر
            زمان که نیاز داشتید میتوانید از پنل خود برای ارتقاع این آگهی و جذب
            تماس و بازدید بیشتر اقدام کنید
          </Typography>
        </DialogContent>
  
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => router.push("/panel")}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#388e3c" },
            }}
          >
            متوجه شدم
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  


  // Urgent section
  const renderUrgentSection = () => (
    <Box mb={4}>
      <SectionTitle
        title="آگهی فوری"
        sectionDesc="آگهی فوری باعث می‌شود آگهی شما بالای تمام آگهی‌های عادی نمایش داده شود و با ریبون فوری متمایز گردد. مناسب برای جذب سریع مشتری."
        sectionColor="#f57c00"
        sectionDesc2="متمایز شدن رنگ آگهی و ریبون فوری باعث میشود تا چند برابر آگهی عادی بازدید بگیرید"
      />

      <Grid container spacing={1.5}>
        {urgentPlans.map((p) => (
          <Grid item xs={4} key={p.id}>
            <Card
              onClick={() =>
                setSelectedUrgent(selectedUrgent?.id === p.id ? null : p)
              }
              sx={{
                cursor: "pointer",
                border:
                  selectedUrgent?.id === p.id
                    ? `2px solid ${p.color}`
                    : "1px solid #ddd",
                borderRadius: "12px",
                position: "relative",
                minHeight: 170,
                display: "flex",
                flexDirection: "column",
                transition: "0.2s",
                direction: "rtl",
                overflow: "visible",
                clipPath: "inset(0 0 0 0 round 12px)",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
              }}
            >
              <DiagonalRibbon label={p.label} color={p.color} />

              <CardContent
                sx={{
                  pt: 3,
                  pb: "8px !important",
                  textAlign: "right",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.8}
                    mb={0.5}
                    justifyContent="center"
                  >
                    <p>{p.days} روز</p>
                  </Box>

                  <Divider
                    sx={{ my: 1, borderColor: "#ccc", borderWidth: 1.5 }}
                  />

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.8}
                    mb={1}
                    justifyContent="center"
                  >
                    <p>{p.price.toLocaleString()} تومان</p>
                  </Box>
                </Box>

                <Typography
                  fontSize={11}
                  color="text.secondary"
                  textAlign="center"
                >
                  {p.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Special section
  const renderSpecialSection = () => (
    <Box mb={4}>
      <SectionTitle
        title="آگهی ویژه"
        sectionDesc="آگهی ویژه آگهی شما را در جایگاه برتر لیست به مدت خریداری شده قرار می‌دهد و با برچسب ویژه توجه کاربران را بیشتر جلب می‌کند."
        sectionDesc2="در این پلن تعداد تماس های دریافتی تاثیری ندارد ، و فقط  در صورت پایان مدت زمان خریداری شده آگهی به حالت عادی برمیگردد "
        sectionColor="#8e24aa"
      />

      <Grid container spacing={1.5}>
        {specialPlans.map((p) => (
          <Grid item xs={4} key={p.id}>
            <Card
              onClick={() =>
                setSelectedSpecial(selectedSpecial?.id === p.id ? null : p)
              }
              sx={{
                cursor: "pointer",
                border:
                  selectedSpecial?.id === p.id
                    ? `2px solid ${p.color}`
                    : "1px solid #ddd",
                borderRadius: "12px",
                position: "relative",
                minHeight: 170,
                display: "flex",
                flexDirection: "column",
                transition: "0.2s",
                direction: "rtl",
                overflow: "visible",
                clipPath: "inset(0 0 0 0 round 12px)",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
              }}
            >
              <DiagonalRibbon label={p.label} color={p.color} />

              <CardContent
                sx={{
                  pt: 3,
                  pb: "8px !important",
                  textAlign: "right",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.8}
                    mb={0.5}
                    justifyContent="center"
                  >
                    <p fontWeight="bold" fontSize={15}>
                      {p.days} روز
                    </p>
                  </Box>

                  <Divider
                    sx={{ my: 3, borderColor: "#ccc", borderWidth: 1.5 }}
                  />

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.8}
                    mb={1}
                    justifyContent="center"
                  >
                    <p fontWeight="bold" fontSize={13}>
                      {p.price.toLocaleString()} تومان
                    </p>
                  </Box>
                </Box>

                <Typography
                  fontSize={11}
                  color="text.secondary"
                  textAlign="center"
                >
                  {p.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Calls section
  const renderCallsSection = () => (
    <Box mb={4}>
      <SectionTitle
        title="بسته‌های افزایش تماس"
        sectionDesc="با خرید بسته افزایش تماس، آگهی شما در جایگاه ویزه در بالای دسته بندی قرار میگیرد.
        و تا زمانی که به تعداد مشخص تماس خریداری شده توسط مشتری نرسید آگهی به حالت عادی بر نمیگردد"
        sectionDesc2="در این پلن شما فقط زمانی هزینه پرداخت میکنید که مشتری با شماره تماس متصل به آگهی شما تماس
        برقرار کند"
        sectionColor="#1565c0"
      />

      <Grid container spacing={1.5}>
        {callPlans.map((p) => (
          <Grid item xs={4} key={p.id}>
            <Card
              onClick={() =>
                setSelectedCalls(selectedCalls?.id === p.id ? null : p)
              }
              sx={{
                cursor: "pointer",
                border:
                  selectedCalls?.id === p.id
                    ? `2px solid ${p.color}`
                    : "1px solid #ddd",
                borderRadius: "12px",
                position: "relative",
                minHeight: 170,
                display: "flex",
                flexDirection: "column",
                transition: "0.2s",
                direction: "rtl",
                overflow: "visible",
                clipPath: "inset(0 0 0 0 round 12px)",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
              }}
            >
              <DiagonalRibbon label={p.label} color={p.color} />

              <CardContent
                sx={{
                  pt: 3,
                  pb: "8px !important",
                  textAlign: "right",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.8}
                    mb={0.5}
                    justifyContent="center"
                  >
                    <p fontWeight="bold" fontSize={15}>
                      {p.calls} تماس 
                    </p>
                  </Box>

                  <Divider
                    sx={{ my: 3, borderColor: "#ccc", borderWidth: 1.5 }}
                  />

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.8}
                    mb={1}
                    justifyContent="center"
                  >
                    <p fontWeight="bold" fontSize={13}>
                      {p.price.toLocaleString()} تومان
                    </p>
                  </Box>
                </Box>

                <Typography
                  fontSize={11}
                  color="text.secondary"
                  textAlign="center"
                >
                  {p.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography
        fontSize={12}
        color="text.secondary"
        textAlign="center"
        mt={1.5}
      >
        افزایش تماس‌های هدفمند . نمایش آمار تماس
      </Typography>
    </Box>
  );

  // Active plans analytics section
  const renderActivePlansTab = () => (
    <Box>
      {worker?.upgrade_stats ? (
        <>
          {/* Calls Section */}
          {worker.upgrade_stats.calls && (
            <Box mb={4}>
               <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                <CallDetails data={worker.upgrade_stats.calls} />
                </Grid>
                <Grid item xs={12} md={6}>
                  
                  <CallCharts data={worker.upgrade_stats.calls} />
                  
                </Grid>
              </Grid>
              </Paper>
            </Box>
          )}

          {/* Special Section */}
          {worker.upgrade_stats.special && (
            <Box mb={4}>
              <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                <SpecialDetails data={worker.upgrade_stats.special} />
                  
                </Grid>
                <Grid item xs={12} md={6}>
                <SpecialCharts data={worker.upgrade_stats.special} />
                </Grid>
              </Grid>
              </Paper>
            </Box>
          )}

          {/* Urgent Section */}
          {worker.upgrade_stats.urgent && (
            <Box mb={4}>
              <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                <UrgentDetails data={worker.upgrade_stats.urgent} />
                </Grid>
                <Grid item xs={12} md={6}>
                  
                  <UrgentCharts data={worker.upgrade_stats.urgent} />
                </Grid>
              </Grid>
              </Paper>
            </Box>
          )}
        </>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography color="text.secondary" fontSize={15}>
            هیچ پلن فعالی وجود ندارد
          </Typography>
        </Box>
      )}
    </Box>
  );

  // Purchase plans section
  const renderPurchasePlansTab = () => (
    <Box>
      {renderCallsSection()}
      <Divider sx={{ my: 3, borderColor: "#ccc", borderWidth: 1.5 }} />

      {renderSpecialSection()}
      <Divider sx={{ my: 3, borderColor: "#ccc", borderWidth: 1.5 }} />

      {renderUrgentSection()}
      {renderFreePlanSection()}
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f0f0f5",
        direction: "rtl",
        pb: activeTab === 0 ? "90px" : "20px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          px: { xs: 2, sm: 3, md: 6, lg: 10 },
          py: 3,
          boxSizing: "border-box",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          {/* Worker Thumbnail */}
          <Box
            component="img"
            src={worker.thumb}
            alt={worker.name}
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #f57c00",
              mb: 1.5,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />

          {/* Page Title */}
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            sx={{
              fontSize: { xs: 20, sm: 24 },
              fontFamily: "iransans",
              color: "#222",
            }}
          >
            ارتقای آگهی
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontFamily: "iransans",
              color: "#555",
              mb: 0.5,
              fontSize: { xs: 13, sm: 14 },
            }}
          >
            {worker.name}
          </Typography>
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              "& .MuiTab-root": {
                fontFamily: "iransans",
                fontSize: { xs: 14, sm: 16 },
                fontWeight: "bold",
                minWidth: { xs: 120, sm: 160 },
              },
              "& .Mui-selected": {
                color: "#f57c00",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#f57c00",
              },
            }}
          >
            <Tab label="خرید پلن" />
            <Tab label="پلن های فعال" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && renderPurchasePlansTab()}
        {activeTab === 1 && renderActivePlansTab()}
      </Box>

      {/* Fixed footer - only show on purchase tab */}
      {activeTab === 0 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            boxShadow: "0 -2px 12px rgba(0,0,0,0.15)",
            px: { xs: 2, sm: 3, md: 6, lg: 10 },
            py: 1.5,
            boxSizing: "border-box",
            zIndex: 99999,
          }}
        >
          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{
              backgroundColor: "green",
              color: "white",
              fontWeight: "bold",
              py: 1.6,
              fontSize: { xs: 16, sm: 18 },
              borderRadius: "12px",
              "&:hover": { backgroundColor: "#c62828" },
              "&.Mui-disabled": { backgroundColor: "#ef9a9a", color: "white" },
            }}
            disabled={totalPrice === 0}
            onClick={handleCheckout}
          >
            تکمیل خرید • {totalPrice.toLocaleString()} تومان
          </Button>
        </Box>
      )}

     {/* Info Modal */}
<Dialog
  open={!!modalPlan}
  onClose={() => setModalPlan(null)}
  PaperProps={{
    sx: {
      borderRadius: "16px",
      direction: "rtl",
      px: 1,
      minWidth: { xs: "85vw", sm: 400 },
    },
  }}
>
  <DialogTitle
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      pb: 1,
    }}
  >
    <Typography fontWeight="bold" fontSize={17} sx={{ color: modalPlan?.color }}>
      {modalPlan?.label}
    </Typography>

    <IconButton size="small" onClick={() => setModalPlan(null)}>
      <CloseIcon fontSize="small" />
    </IconButton>
  </DialogTitle>

  <DialogContent>
    <Typography fontSize={14} color="text.secondary" lineHeight={2}>
      {modalPlan?.modalDesc}
    </Typography>

    <Divider sx={{ my: 1, borderColor: "#ccc", borderWidth: 1.5 }} />
    
    <Typography fontSize={14} color="text.secondary" lineHeight={2}>
      {modalPlan?.modalDesc2}
    </Typography>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => setModalPlan(null)}
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: modalPlan?.color,
        color: "white",
        fontWeight: "bold",
        borderRadius: "8px",
        "&:hover": { opacity: 0.9 },
      }}
      >
        متوجه شدم
      </Button>
    </DialogActions>
  </Dialog>
        </Box>
     
    );
  }
  
