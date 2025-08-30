import React, { useState, useEffect } from "react";
import Styles from "../styles/FileRequest.module.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TourOutlinedIcon from "@mui/icons-material/TourOutlined";
import CallIcon from "@mui/icons-material/Call";
import Modal from "@mui/material/Modal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Form from "react-bootstrap/Form";
import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FileRequest = () => {
  const [modal_show, set_modal_show] = useState(false);
  const [modal_level, set_modal_level] = useState(1);
  const [loading, set_loading] = useState(false);
  const [name, set_name] = useState("");
  const [request_type_value, set_request_type_value] = useState("");
  const [cities, set_cities] = useState([]);
  const [selected_city, set_selected_city] = useState("");
  const [description, set_description] = useState("");
  const [request_type, set_request_type] = useState("not set");
  const [request_persian_type, set_request_persian_type] = useState(
    "انتخاب نشده"
  );
  const [problem, setProblem] = useState("problem here");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [phone, set_phone] = useState("");
  const [digits, set_digits] = useState("");
  const [property_request_id, set_property_request_id] = useState(0);

  useEffect(() => {
    axios.get("https://api.ajur.app/api/search-cities").then(response => {
      set_cities(response.data.items);
    });
  }, []);

  const onclickRequestModal = () => set_modal_show(!modal_show);
  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackBar(false);
  };
  const handleClose = () => set_modal_show(false);

  const onSelectingType = ({ type, persian_type }) => {
    set_request_type(type);
    set_request_persian_type(persian_type);
    set_modal_level(2);
  };

  const whatKindDescription = () => {
    if (request_type === "buy") return "مثلا : آپارتمان دو خوابه";
    if (request_type === "sell") return "مثلا : زمین ۵۰۰ متری";
    if (request_type === "for_rent") return "مثلا : آپارتمان ۸۰ متری";
    if (request_type === "need_rent")
      return "مثلا : سالن حدود ۳۰ متر برای آرایشگاه";
  };

  const renderDescriptionHint = () => {
    if (request_type === "buy")
      return "مثلا : حدود یک میلیارد تومن پول دارم و دنبال خونه دوخوابه میگردم";
    if (request_type === "sell")
      return "مثلا : یه باغچه هزار متری دارم با سند تک برگ، آب و برق داره نزدیک جاده اصلیه";
    if (request_type === "for_rent")
      return "مثلا : یه واحد ۱۰۰ متری دارم فقط به خانواده میدم، پیش سیصد ماهی ۵ تومن، تبدیلم نمیکنم";
    if (request_type === "need_rent")
      return "مثلا : دنبال سالن میگردم برا کار ناخن، یه ماه وقت دارم جا بجا بشم، ۳۰۰ میتونم رهن بدم، ترجیجا دیگه اجاره ندم";
  };

  const handleChangeCity = ct => set_selected_city(ct.target.value);
  const renderTheCities = () =>
    cities.map(city =>
      <MenuItem key={city.id} value={city.id}>
        {city.title}
      </MenuItem>
    );

  const onClickSubmit = () => {
    if (!name || name.length < 3) {
      setProblem(
        !name ? "نام خود را وارد کنید" : "نام حد اقل باید سه حرف باشد"
      );
      setOpenSnackBar(true);
      return;
    }
    if (!request_type_value) {
      setProblem("نوع ملک را بنویسد");
      setOpenSnackBar(true);
      return;
    }
    if (!selected_city) {
      setProblem("ابتدا شهر را انتخاب کنید");
      setOpenSnackBar(true);
      return;
    }
    if (!description) {
      setProblem("لطفا کمی در بخش توضیحات برایمان بنویسد");
      setOpenSnackBar(true);
      return;
    }
    set_modal_level(3);
  };

  const handleChangeInput = e => set_phone(e.target.value);
  const handleChangeInput2 = e => set_digits(e.target.value);

  const onClickSendCode = () => {
    if (!phone || phone.length !== 11) {
      setProblem(
        !phone
          ? "شماره موبایل را وارد کنید"
          : "شماره موبایل را صحیح و یازده رقمی وارد کنید"
      );
      setOpenSnackBar(true);
      return;
    }
    set_loading(true);
    axios
      .post("https://api.ajur.app/webauth/property-request-register", null, {
        params: {
          phone,
          name,
          city_id: selected_city,
          request_type_value,
          description,
          type: request_type,
          persian_type: request_persian_type
        }
      })
      .then(response => {
        set_property_request_id(response.data.property_request_id);
        set_modal_level(4);
        set_loading(false);
      });
  };

  const onClickFinish = () => {
    if (!digits || digits.length !== 5) {
      setProblem(
        !digits
          ? "ابتدا کد دریافتی از اس ام اس را وارد کنید"
          : "کد تایید باید ۵ رقم باشد"
      );
      setOpenSnackBar(true);
      return;
    }
    axios
      .post("https://api.ajur.app/webauth/property-request-verify", null, {
        params: {
          phone,
          code: parseInt(digits),
          password: "ddr007",
          property_request_id
        }
      })
      .then(response => {
        if (response.data.status === "success") set_modal_level(5);
        else
          setProblem(
            response.data.status === "useless"
              ? "! کد تایید شما دارای اعتبار نیست"
              : "! کد تاییید شما درست نیست"
          );
        setOpenSnackBar(true);
      });
  };

  const resetFormAndCloseModal = () => {
    set_modal_level(1);
    set_modal_show(false);
  };

  const renderModalBredcrumb = () => {
    if (modal_level === 2)
      return (
        <ArrowBackIcon
          onClick={() => set_modal_level(1)}
          sx={{ cursor: "pointer", mb: 2 }}
        />
      );
    if (modal_level === 3)
      return (
        <ArrowBackIcon
          onClick={() => set_modal_level(2)}
          sx={{ cursor: "pointer", mb: 2 }}
        />
      );
    if (modal_level === 4)
      return (
        <ArrowBackIcon
          onClick={() => set_modal_level(3)}
          sx={{ cursor: "pointer", mb: 2 }}
        />
      );
  };

  const renderModalBody = () => {
    switch (modal_level) {
      case 1:
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1
            }}
          >
            <img
              src="/img/marketing/invite_realestate.jpg"
              alt="دعوت مشاورین"
              style={{ width: "80%", marginBottom: 20 }}
            />
            {["buy", "sell", "for_rent", "need_rent"].map((type, idx) =>
              <Button
                key={idx}
                fullWidth
                variant="outlined"
                color="success"
                sx={{ fontSize: 11, py: 0.8 }}
                onClick={() =>
                  onSelectingType({
                    type,
                    persian_type:
                      type === "buy"
                        ? "میخواهم بخرم"
                        : type === "sell"
                          ? "میخواهم بفروشم"
                          : type === "for_rent"
                            ? "میخواهم اجاره بدم"
                            : "میخوام اجاره کنم"
                  })}
              >
                {type === "buy"
                  ? "میخواهم بخرم"
                  : type === "sell"
                    ? "میخواهم بفروشم"
                    : type === "for_rent"
                      ? "میخواهم اجاره بدم"
                      : "میخوام اجاره کنم"}
              </Button>
            )}
          </Box>
        );
      case 2:
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2
            }}
          >
            <TextField
              fullWidth
              label="نام و نام خانوادگی"
              value={name}
              onChange={e => set_name(e.target.value)}
            />
            <TextField
              fullWidth
              label={"چه ملکی " + request_persian_type}
              value={request_type_value}
              onChange={e => set_request_type_value(e.target.value)}
              placeholder={whatKindDescription()}
            />
            <FormControl fullWidth>
              <InputLabel>شهر</InputLabel>
              <Select value={selected_city} onChange={handleChangeCity}>
                {renderTheCities()}
                <MenuItem value={0}>سایر شهرها</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="توضیحات"
              multiline
              minRows={3}
              maxRows={10}
              value={description}
              onChange={e => set_description(e.target.value)}
              placeholder={renderDescriptionHint()}
            />
            <Button fullWidth variant="contained" onClick={onClickSubmit}>
              ثبت درخواست
            </Button>
          </Box>
        );
      case 3:
        return (
          <Form>
            <Form.Group>
              <Form.Label>شماره موبایل خود را وارد کنید</Form.Label>
              <Form.Control
                type="number"
                placeholder="09********"
                onChange={handleChangeInput}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={onClickSendCode}
                sx={{ mt: 1 }}
              >
                ثبت درخواست
              </Button>
            </Form.Group>
          </Form>
        );
      case 4:
        return (
          <Form>
            <Form.Group>
              <Form.Label>
                کد تایید ۵ رقمی ارسال شده به شماره {phone}
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="- - - - -"
                onChange={handleChangeInput2}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={onClickFinish}
                sx={{ mt: 1 }}
              >
                تایید و ثبت نهایی
              </Button>
            </Form.Group>
          </Form>
        );
      case 5:
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2
            }}
          >
            <img
              src="/img/marketing/invite_realestate.jpg"
              alt="موفقیت"
              style={{ width: "80%", marginBottom: 10 }}
            />
            <p style={{ color: "green", textAlign: "center" }}>
              درخواست شما با موفقیت ثبت شد
            </p>
            <p style={{ textAlign: "center" }}>
              در بعضی موارد ممکن است تا ۴۸ ساعت طول بکشد تا درخواست بررسی شود،
              لطفا شماره {phone} روشن باشد.
            </p>
            <Button
              fullWidth
              variant="contained"
              onClick={resetFormAndCloseModal}
            >
              بستن این صفحه
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      className={Styles.wrapper}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        p: 3,
        border: "2px solid #ccc",
        borderRadius: 6,
        maxWidth: 600,
        minHeight: 420,
        mx: "auto",
        gap: 2
      }}
    >
      <img
        src="/img/marketing/property_request.jpg"
        alt="سیستم یکپارچه فایل درخواستی آجر"
        style={{ width: "80%", maxWidth: 500 }}
      />
      <p style={{ fontSize: 13 }}>
        فایل مورد نظرتان را پیدا نکردید و یا موردی برای سپردن به آجر دارید
      </p>
      <p style={{ fontSize: 14 }}>
        با سیستم یکپارچه مشاورین ما در منطقه، یک بار بسپارید بقیش با آجر
      </p>

      <Box
        sx={{
          display: "flex",
          width: "80%", // همون اندازه تصویر
          maxWidth: 500, // حداکثر عرض تصویر
          mx: "auto", // مرکز کردن نسبت به صفحه
          gap: 2
        }}
      >
        <Button
          onClick={onclickRequestModal}
          variant="contained"
          startIcon={<TourOutlinedIcon />}
          sx={{
            flex: 1, // تقسیم مساوی فضای موجود
            fontSize: 10.5,
            py: 0.7,
            borderRadius: "4px" // گوشه‌های سمت چپ گرد
          }}
        >
          ثبت درخواست
        </Button>
        <Button
          href={"tel:+989124161970"}
          variant="outlined"
          startIcon={<CallIcon />}
          sx={{
            flex: 1,
            fontSize: 10.5,
            py: 0.7,
            borderRadius: "4px" // گوشه‌های سمت راست گرد }}
          }}
        >
          09124161970
        </Button>
      </Box>

      <Modal open={modal_show} onClose={handleClose}>
        <Box sx={{ ...style, width: "90%", maxWidth: 550 }}>
          {renderModalBredcrumb()}
          {renderModalBody()}
        </Box>
      </Modal>

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
    </Box>
  );
};

export default FileRequest;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto"
};
