import React, { useState, useEffect } from "react";
import Styles from "../styles/FileRequest.module.css";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import Box from "@mui/material/Box";
import { Typography, Skeleton, Stack } from "@mui/material";
import TourOutlinedIcon from "@mui/icons-material/TourOutlined";
import CallIcon from "@mui/icons-material/Call";
import Modal from "@mui/material/Modal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Form from "react-bootstrap/Form";
import axios from "axios";
import FileRequestAnimation from "../animations/FileRequestAnimation";
import { useRouter } from "next/router";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const FileRequest = (props) => {
  const [modal_show, set_modal_show] = useState(false);
  const [modal_level, set_modal_level] = useState(1);

  const [loading, set_loading] = React.useState(false);
  const [name, set_name] = useState();
  const [request_type_value, set_request_type_value] = useState();
  const [cities, set_cities] = useState([]);
  const [selected_city, set_selected_city] = useState();
  const [description, set_description] = useState();
  const [request_type, set_request_type] = useState("not set");
  const [request_persian_type, set_request_persian_type] =
    useState("انتخاب نشده");
  const [problem, setProblem] = useState("problem here");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [phone, set_phone] = React.useState();
  const [digits, set_digits] = React.useState();
  const [property_request_id, set_property_request_id] = React.useState(0);

  const router = useRouter();

  const onClickRequestPage = () => {
    router.push("/file-request");
  }

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.ajur.app/api/search-cities",
    }).then(function (response) {
      set_cities(response.data.items);
      console.log("-------the cities is ---------");
      console.log(response.data);
    });
  }, []);

  const onclickRequestModal = () => {
    set_modal_show(!modal_show);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleClose = () => set_modal_show(false);

  function onSelectingType({ type, persian_type }) {
    set_request_type(type);
    set_request_persian_type(persian_type);
    set_modal_level(2);
  }

  function whatKindDescription() {
    if (request_type == "buy") {
      return "مثلا : آپارتمان دو خوابه";
    } else if (request_type == "sell") {
      return "مثلا : زمین ۵۰۰ متری ";
    } else if (request_type == "for_rent") {
      return "مثلا : آپارتمان ۸۰ متری ";
    } else if (request_type == "need_rent") {
      return "مثلا :  سالن حدود ۳۰ متر برای آرایشگاه  ";
    }
  }

  function renderDescriptionHint() {
    if (request_type == "buy") {
      return "مثلا :  حدود یک میلیارد تومن پول دارم و دنبال خونه دوخوابه میگردم";
    } else if (request_type == "sell") {
      return "مثلا : یه باغچه هزار متری دارم با سند تک برگ ، آب و برق داره نزدیک جاده اصلیه ";
    } else if (request_type == "for_rent") {
      return "مثلا : یه واحد ۱۰۰ متری دارم فقط به خانواده میدم ، پیش سیصد ماهی ۵ تومن ، تبدیلم نمیکنم ";
    } else if (request_type == "need_rent") {
      return "مثلا :دنبال سالن میگردم برا کار ناخن ، یه ماه وقت دارم جا بجا بشم، ۳۰۰ میتونم رهن بدم ، ترجیجا دیگه اجاره ندم  ";
    }
  }

  const renderModalBredcrumb = () => {
    if (modal_level == 2) {
      return (
        <div onClick={() => set_modal_level(1)}>
          {" "}
          <p>
            {" "}
            <ArrowBackIcon onClick={() => set_modal_level(1)} />{" "}
            {request_persian_type}
          </p>{" "}
        </div>
      );
    } else if (modal_level == 3) {
      return (
        <div onClick={() => set_modal_level(2)}>
          {" "}
          <p>
            {" "}
            <ArrowBackIcon onClick={() => set_modal_level(2)} /> بازگشت به صفحه
            قبل
          </p>{" "}
        </div>
      );
    } else if (modal_level == 4) {
      return (
        <div onClick={() => set_modal_level(3)}>
          {" "}
          <p>
            {" "}
            <ArrowBackIcon onClick={() => set_modal_level(3)} /> بازگشت به صفحه
            قبل
          </p>{" "}
        </div>
      );
    }
  };

  const handleChangeCity = (ct) => {
    set_selected_city(ct.target.value);
  };

  const renderTheCities = () => {
    return cities.map((city) => (
      <MenuItem value={city.id}>{city.title}</MenuItem>
    ));
  };

  const onClickSubmit = () => {
    if (!name) {
      setProblem("نام خود را وارد کنید");
      setOpenSnackBar(true);
      return;
    } else if (name.length < 3) {
      setProblem("نام حد اقل باید سه حرف باشد");
      setOpenSnackBar(true);
      return;
    } else if (!request_type_value) {
      setProblem("نوع ملک را بنویسد");
      setOpenSnackBar(true);
    } else if (!selected_city) {
      setProblem("ابتدا شهر را انتخاب کنید");
      setOpenSnackBar(true);
    } else if (!description) {
      setProblem("لطفا کمی در بخش توضیحات برایمان بنویسد");
      setOpenSnackBar(true);
    } else {
      set_modal_level(3);
    }
  };

  const handleChangeInput = (e) => {
    console.log("form changed");
    console.log(e.target.value);
    if (e.target.value) {
      var phone = e.target.value;
      set_phone(phone);
    } else {
    }
  };

  const handleChangeInput2 = (e) => {
    console.log("digits now is");
    console.log(e.target.value);
    if (e.target.value) {
      var digits = e.target.value;
      set_digits(digits);
    } else {
    }
  };

  const onClickSendCode = () => {
    if (!phone) {
      setProblem("شماره موبایل را وارد کنید");

      setOpenSnackBar(true);
      return;
    } else if (phone.length !== 11) {
      setProblem("شماره موبایل را صحیح و یازده رقتی وارد کنید");

      setOpenSnackBar(true);
      return;
    }


    set_loading(true);

    axios({
      method: "post",
      // url:'https://irabist.ir/api/register-login',
      url: "https://api.ajur.app/webauth/property-request-register",

      params: {
        phone: phone,
        name: name,
        city_id: selected_city,
        request_type_value: request_type_value,
        description: description,
        type: request_type,
        persian_type: request_persian_type
      },
    }).then(function (response) {
      console.log("sms sended ");
      console.log(response.data);

      set_property_request_id(response.data.property_request_id);
      if (response.status == 200) {
        console.log("sms sended successfully");
        set_modal_level(4);
      } else {
        console.log("something wrong with sms sending");
      }
      set_loading(false);
    });
  };

  const onClickFinish = () => {
    var code = parseInt(digits);
    console.log("the code in finish part is:::");
    console.log(code);

    if (!digits) {
      console.log("the digits must be 5 number");
      setProblem("ابتدا کد دریافتی از اس ام اس را وارد کنید");

      setOpenSnackBar(true)
      return;
    } else if (digits.length != 5) {
      console.log("the digits must be 5 number");
      setProblem("کد تایید باید ۵ رقم باشد");

      setOpenSnackBar(true);
    } else {


      axios({
        method: "post",
        url: "https://api.ajur.app/webauth/property-request-verify",
        params: {
          phone: phone,
          code: code,
          password: "ddr007",
          property_request_id: property_request_id
        },
      }).then(function (response) {
        console.log('testing response');
        console.log(response.data.status);


        if (response.data.status == "success") {

          console.log("code is right and thanks");
          set_modal_level(5);
        } else if (response.data.status == "useless") {
          console.log("your code is useless");
          setProblem("! کد تایید شما دارای اعتبار نیست");
          setOpenSnackBar(true);
        } else {
          console.log("your code is wrong");
          setProblem("! کد تایید شما درست نیست");
          setOpenSnackBar(true);
        }
      });
    }
  };

  const resetFormAndCloseModal = () => {
    set_modal_level(1);
    set_modal_show(false);
  }

  const renderModalBody = () => {
    if (modal_level == 1) {
      return (

        <Grid container spacing={3}>
          <Grid item xs={0} md={3} lg={3}></Grid>
          <Grid item xs={12} md={6} lg={6}>
            <img
              src="/img/marketing/invite_realestate.jpg"
              alt="دعوت مشاورین املاک به آجر"
              // width={1000}
              // height={667}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Button
              fullWidth
              onClick={() =>
                onSelectingType({ type: "buy", persian_type: "میخواهم بخرم" })
              }
              variant="outlined"
              color="success"
              startIcon={<DoneIcon />}
            >
              میخواهم بخرم
            </Button>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Button
              fullWidth
              onClick={() =>
                onSelectingType({
                  type: "sell",
                  persian_type: "میخواهم بفروشم",
                })
              }
              variant="outlined"
              color="success"
              startIcon={<DoneIcon />}
            >
              میخواهم بفروشم
            </Button>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Button
              fullWidth
              onClick={() =>
                onSelectingType({
                  type: "for_rent",
                  persian_type: "میخواهم اجاره بدم",
                })
              }
              variant="outlined"
              color="success"
              startIcon={<DoneIcon />}
            >
              میخواهم اجاره بدم
            </Button>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Button
              onClick={() =>
                onSelectingType({
                  type: "need_rent",
                  persian_type: "میخوام اجاره کنم",
                })
              }
              fullWidth
              variant="outlined"
              color="success"
              startIcon={<DoneIcon />}
            >
              میخواهم اجاره کنم
            </Button>
          </Grid>
        </Grid>
      );
    } else if (modal_level == 2) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Grid item xs={12} md={12}>
              <TextField
                required
                id="Name"
                label="نام و نام خانوادگی"
                placeholder="نام خود را وارد کنید"
                fullWidth
                autoFocus={true}
                variant="standard"
                value={name}
                onChange={(name) => set_name(name.target.value)}
                style={{
                  textAlign: "center",
                  direction: "rtl",
                  backgroundColor: "#f8f8f8",
                }}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              required
              id="Name"
              label={"چه ملکی" + " " + request_persian_type}
              placeholder={whatKindDescription()}
              fullWidth
              variant="standard"
              value={request_type_value}
              onChange={(rq) => set_request_type_value(rq.target.value)}
              style={{
                textAlign: "right",
                direction: "rtl",
                backgroundColor: "#f8f8f8",
              }}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <p style={{ textAlign: "right" }}>
              لطفا شهر مورد نظرتان را انتخاب کنید
            </p>
            <FormControl sx={{ m: 0, minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-helper-label"> شهر</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={selected_city}
                label="شهر"
                onChange={(ct) => handleChangeCity(ct)}
              >
                {/* <MenuItem value="">
                  <em>همه شهرها</em>
                </MenuItem> */}
                {renderTheCities()}

                <MenuItem value={0}>سایر شهرها</MenuItem>
              </Select>
              {/* <FormHelperText>With label + helper text</FormHelperText> */}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12}>
            <p style={{ textAlign: "right" }}>کمی برای ما توضیح بنویسید</p>
            <p style={{ textAlign: "right", fontSize: 12, color: "gray" }}>
              هرچه قدر توضیحات کامل تری بنویسد ما توانایی بیشتری در انجام
              هماهنگی ها و انتخاب مشاورین با تخصص مناسب برای معامله شما خواهیم
              داشت
            </p>
            <TextField
              id="Name"
              label={<p>توضیحات</p>}
              fullWidth
              multiline={true}
              minRows={3}
              maxRows={10}
              inputProps={{ maxLength: 3000 }}
              placeholder={renderDescriptionHint()}
              autoComplete="cc-name"
              variant="outlined"
              value={description}
              onChange={(description) =>
                set_description(description.target.value)
              }
              style={{
                textAlign: "right",
                direction: "rtl",
                paddingTop: 20,
                paddingBottom: 20,
              }}
            />
          </Grid>

          <Button onClick={onClickSubmit} fullWidth variant="contained">
            ثبت درخواست
          </Button>
        </Grid>
      );
    } else if (modal_level == 3) {
      return (
        <div>
          <Form>
            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>شماره موبایل خود را وارد کنید</Form.Label>
              <Form.Control
                type="number"
                placeholder="09********"
                onChange={handleChangeInput}
                style={{ marginBottom: 20 }}
              // value= {phone}
              />
              <Form.Text className="text-muted">
                با وارد کردن شماره شما اجازه تماس از سمت همکاران آجر را خواهید
                داد
              </Form.Text>
              <Button onClick={onClickSendCode} fullWidth variant="contained">
                ثبت درخواست
              </Button>
            </Form.Group>
          </Form>
        </div>
      );
    } else if (modal_level == 4) {
      return (
        <div>

          <Form.Group className="mb-3" controlId="formvalidationCode">
            <Form.Label>
              <p>   کد تایید ۵ رقمی ارسال شده به شماره  {phone}  خود را وارد کنید</p>

            </Form.Label>
            <Form.Control
              type="number"
              placeholder="- - - - -"

              onChange={handleChangeInput2}

              style={{ marginBottom: 20 }}
            />
            <Form.Text className="text-muted"></Form.Text>
            <Button onClick={onClickFinish} fullWidth variant="contained">
              تایید و ثبت نهایی
            </Button>
          </Form.Group>

        </div>
      );
    } else if (modal_level == 5) {
      return (
        <div>

          <Grid container spacing={3}>
            <Grid item xs={0} md={3} lg={3}></Grid>
            <Grid item xs={12} md={6} lg={6}>
              <img
                src="/img/marketing/invite_realestate.jpg"
                alt="دعوت به مشارکت در بازاریابی آجر"
                // width={1000}
                // height={667}
                style={{ width: "100%" }}
              />
              <p style={{ textAlign: "center", color: 'green', paddingTop: 20 }}>درخواست شما با موفقیت ثبت شد</p>
              <p style={{ textAlign: "right", fontSize: 12, color: "gray" }}>
                در بعضی موارد به خاطر حجم بالای درخواست ها ممکن است تا ۴۸ ساعت زمان نیاز داشته باشیم
                تا درخواست شما را برسی کنیم ،لطفا شماره
                {' '}  {phone}  {' '}

                را روشن و در دسترس داشته باشید
              </p>

              <p style={{ textAlign: 'center' }}>با تشکر از اعتماد شما ، تیم برسی فایل آجر</p>
            </Grid>

            <Button onClick={resetFormAndCloseModal} fullWidth variant="contained">بستن این صفحه</Button>
          </Grid>


        </div>
      );
    }
  };

  const renderModalContent = () => {
    if (1) {
      return (
        <div>
          {renderModalBredcrumb()}
          {renderModalBody()}
        </div>
      );
    }
  };

  const renderModal = () => {
    return (
      <div>
        <Modal
          open={modal_show}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>{renderModalContent()}</Box>
        </Modal>
      </div>
    );
  };

  return (
    <div className={Styles["wrapper"]}>
      <Box
        component="div"
        sx={{
          p: { xs: 3, md: 5 },
          border: "1px dashed #ccc",
          borderRadius: 3,
          my: 6,
          textAlign: "center",
          backgroundColor: "#fff",
          fontFamily: `"IranYekan", "Segoe UI", "sans-serif"`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{fontFamily:'iransans',textAlign:'center'}}  
        >
          فایل موردنظر خود را پیدا نکردید؟
        </h2>

        <Box sx={{ maxWidth: 400, mx: "auto", mb: 3 }}>
          <InViewAnimationWrapper />
        </Box>

        <p style={{textAlign:'right',padding:12}} >
          هنوز فایل دلخواهتان را نیافتید یا موردی برای سپردن دارید؟
           فقط کافیه درخواست خودتون رو اینجا ثبت کنید  از اینجا به بعدش با آجر
        </p>

        

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              onClick={onClickRequestPage}
              variant="contained"
              startIcon={<TourOutlinedIcon />}
              sx={{
                backgroundColor: "#bc323a",
                color: "#fff",
                py: 1.4,
                fontWeight: 600,
                fontSize: 17,
                fontFamily:'iransans',
                "&:hover": {
                  backgroundColor: "#a72b32",
                },
              }}
            >
              ثبت درخواست
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              href="tel:+989382740488"
              variant="outlined"
              startIcon={<CallIcon />}
              sx={{
                borderColor: "#bc323a",
                color: "#bc323a",
                py: 1.4,
                fontWeight: 600,
                fontSize: 15,
                "&:hover": {
                  backgroundColor: "#fef0f1",
                  borderColor: "#a72b32",
                  color: "#a72b32",
                },
              }}
            >
              {/* ۰۹۱۲۴۱۶۱۹۷۰ */}
              09382740488
            </Button>
          </Grid>
        </Grid>
      </Box>



      {renderModal()}

      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {problem}
        </Alert>
      </Snackbar>
    </div >
  );
};


export default FileRequest;

// Simple Intersection Observer wrapper for animation
function InViewAnimationWrapper() {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    let observer;
    if ("IntersectionObserver" in window) {
      observer = new window.IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { threshold: 0.2 }
      );
      observer.observe(ref.current);
    } else {
      // If IntersectionObserver is not supported (very old browsers / SSR),
      // we keep `inView` false so the component renders a skeleton and
      // reserves space — this avoids hydration/layout jumps.
    }
    return () => {
      if (observer && ref.current) observer.unobserve(ref.current);
    };
  }, []);

  // Reserve an explicit height that matches the animation and surrounding
  // text/buttons to avoid layout jumps when swapping skeleton -> animation.
  const reservedHeight = 260; // animation (180) + text/buttons spacing

  // Outer container always reserves the same height to avoid any jump.
  // Inside, we absolutely layer the skeleton and animation and toggle
  // opacity. This prevents any reflow when switching visuals and should
  // eliminate even 1px jumps.
  return (
    <div ref={ref}>
      <Box sx={{ width: '100%', minHeight: reservedHeight, position: 'relative' }}>
        {/* Skeleton layer (visible when not in view) */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 200ms ease',
            opacity: inView ? 0 : 1,
            pointerEvents: inView ? 'none' : 'auto',
          }}
        >
          <Stack spacing={1} alignItems="center">
            <Skeleton variant="rectangular" width={180} height={180} />
            <Skeleton variant="text" width={180} height={28} />
            <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'center', mt: 1 }}>
              <Skeleton variant="rectangular" width={140} height={40} />
              <Skeleton variant="rectangular" width={140} height={40} />
            </Stack>
          </Stack>
        </Box>

        {/* Animation layer (visible when in view). We only mount the
            Lottie component after the element becomes visible so autoplay
            happens at the right moment. When not mounted we render an
            empty same-size container to avoid layout shifts. */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 200ms ease',
            opacity: inView ? 1 : 0,
            pointerEvents: inView ? 'auto' : 'none',
          }}
        >
          {/* Constrain animation to same size as skeleton */}
          {inView ? (
            <Box sx={{ width: 180, height: 180 }}>
              <FileRequestAnimation />
            </Box>
          ) : (
            <Box sx={{ width: 180, height: 180 }} aria-hidden />
          )}
        </Box>
      </Box>
    </div>
  );
}

const style = {
  position: "absolute",

  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
