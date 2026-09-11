import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Styles from "../styles/panel/PanelWorkerCard.module.css";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import Stars from "../others/Stars";
import ShareIcon from "@mui/icons-material/Share";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import SpinnerModalLoader from "../panel/SpinnerModalLoader";
import axios from "axios";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Stack from "@mui/material/Stack";
import CallIcon from "@mui/icons-material/Call";
import MessageIcon from "@mui/icons-material/Message";
import CancelIcon from "@mui/icons-material/Cancel";
import TourOutlinedIcon from "@mui/icons-material/TourOutlined";

import ImageSlider from "../sliders/ImageSlider";
import VideoSlider from "../sliders/VideoSlider";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
const LocationNoSsr = dynamic(() => import("../map/Location"), { ssr: false });

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});

export default function DepartmentEditRealestate(props) {
  const theme = useTheme();
  const router = useRouter();
  const realestate = props.realestate;
  const department = props.department;

  const [open, setOpen] = React.useState(false);
  const [modal_type, set_modal_type] = React.useState(false);
  const [loading, set_loading] = React.useState(false);

  const [role, set_role] = React.useState(props.realestate.role);
  const [status, set_status] = React.useState(props.realestate.status);

  const [open_alert, setOpenAlert] = React.useState(false);
  const [problem, setProblem] = useState("username_test_problem");
  const [vertical, set_vertical] = useState("top");
  const [horizontal, set_horizontal] = useState("center");
  const [alert_type, set_alert_type] = useState("success");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  function handleCloseAlert() {
    setOpenAlert(false);
    console.log("close snack is cliked");
  }

  const handleChangeRole = (event) => {
    set_role(event.target.value);
  };

  const handleChangeStatus = (event) => {
    set_status(event.target.value);
  };

  const onClickCall = () => {
    console.log("call button clicked");
  };

  const renderstatus = () => {
    if (realestate.status == 1) {
      return <p style={{ color: "green" }}>فعال</p>;
    }
  };

  const renderStatusBox = () => {
    if (1) {
      return (
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">وضعیت</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              onChange={handleChangeStatus}
            >
              <MenuItem value={"1"}>فعال</MenuItem>
              <MenuItem value={"2"}>غیر فعال</MenuItem>
            </Select>
          </FormControl>
        </Box>
      );
    }
  };

  const onPopstateFuction = () => {
    history.pushState(null, "", router.asPath);
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      history.pushState(null, "/", router.asPath);
      window.addEventListener("popstate", onPopstateFuction);
    }
    return () => {
      window.removeEventListener("popstate", onPopstateFuction);
    };
  }, [open]);

  const onClickCard = () => {
    console.log("on click card , expect to open the modal");
    setOpen(true);
    set_loading(false);
  };

  const formatedDate = () => {
    return new Date(realestate.created_at).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const sendChangeAgent = () => {
    // set_loading(true);

    // setProblem("todo");
    // set_alert_type("success");
    // setOpenAlert(true);

    set_loading(true);
    var token = Cookies.get("id_token");
    axios({
      method: "post",

      url: "https://api.ajur.app/api/edit-department-agent",

      params: {
        token: token,
        department_user_id: realestate.user_id,
        department_id: department.id,
        status: status,
        role: role,
      },
    }).then(function (response) {
      if (response.data.status == 200) {
        setProblem("تغییرات با موفقیت انجام شد");
        set_alert_type("success");
        setOpenAlert(true);

        set_loading(false);
        router.replace("/panel").then(() => router.reload());
      }else if (response.data.status == 405) {
        set_loading(false);
        setProblem("شما اجازه این تغییرات را ندارید");
        set_alert_type("warning");
        setOpenAlert(true);

        // router.replace("/panel").then(() => router.reload());
      }else if (response.data.status == 406) {
        set_loading(false);
        setProblem("مدیر نمیتواند وضعیت رییس را تغییر دهد");
        set_alert_type("warning");
        setOpenAlert(true);

        // router.replace("/panel").then(() => router.reload());
      }else if (response.data.status == 407) {
        set_loading(false);
        setProblem("مدیر نمیتواند رییس انتخاب کند");
        set_alert_type("warning");
        setOpenAlert(true);

        // router.replace("/panel").then(() => router.reload());
      }
      
      else {
        setProblem("مشکلی پیش آمده ، لطفا مجددا اقدام کنید ");
        set_alert_type("warning");
        setOpenAlert(true);
      }
      set_loading(false);
    });
  };

  const renderSubmit = () => {
    if (1) {
      return (
        <div className={Styles["contact-wrapper"]}>
          <Box
            component="div"
            sx={{
              p: 2,
              border: "1px dashed grey",
              margin: "5px",
              textAlign: "center",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={6} md={6}>
                <Button
                  fullWidth
                  className={Styles["worker-detail-button"]}
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleClose}
                >
                  انصراف
                </Button>
              </Grid>
              <Grid item xs={6} md={6}>
                <Button
                  fullWidth
                  className={Styles["worker-detail-button"]}
                  variant="contained"
                  onClick={sendChangeAgent}
                >
                  {" ثبت تغییرات"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      );
    }
  };

  const rednerModalContents = () => {
    if (loading) {
      return <SpinnerModalLoader />;
    }

    const renderRoleSelect = () => {
      if (1) {
        return (
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">سمت</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                onChange={handleChangeRole}
              >
                <MenuItem value={"مدیر"}>مدیر</MenuItem>
                <MenuItem value={"مشاور"}>مشاور</MenuItem>
                <MenuItem value={"مدیر رنج فروش"}>مدیر رنج فروش</MenuItem> 
                <MenuItem value={"مدیر رنج اجاره"}>میدر رنج اجاره</MenuItem> 
                <MenuItem value={"رییس"}>رییس</MenuItem> 
              </Select>
            </FormControl>
          </Box>
        );
      }
    };

    return (
      <div>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} lg={5} style={{ textAlign: "center" }}>
            <div className={Styles["profile-info"]}>
              <img
                className={Styles["profile-pic"]}
                src={realestate.profile_url}
                alt={realestate.name + realestate.family}
              />

              <h2 className={Styles["hvr-underline-from-center"]}>
                {realestate.name} {realestate.family}
                <span>
                  <Stars amount={realestate.stars} />
                </span>
              </h2>
            </div>
          </Grid>

          <Grid item xs={12} md={5} lg={5}>
            <div className={Styles["profile-description"]}>
              <p className={Styles["show-on-hover"]}>
                {realestate.description}
              </p>
            </div>
            <div className={Styles["profile-contacts-wrapper"]}>
              <a
                onClick={onClickCall}
                className={Styles["show-on-hover"]}
                href={
                  "https://api.whatsapp.com/send?phone=" +
                  realestate.phone +
                  "&text=سلام"
                }
              >
                <i className="fa fa-whatsapp fa-2x"></i>
              </a>
              <a
                className={Styles["show-on-hover"]}
                target="_blank"
                rel="noreferrer"
                href={"tel:" + realestate.phone}
              >
                <i className="fa fa-phone fa-2x "></i>
              </a>
            </div>
            <div className={Styles["row-wrappers"]}>
              {/* <div className={Styles["row-single"]}>
                <div className={Styles["row-wrapper"]}>
                  <p>| </p>
                  <p>{realestate.role}</p>
                </div>

                <div className={Styles["row-wrapper"]}>
                  <p></p>
                  <p>{realestate.phone}</p>
                </div>
              </div> */}

              {/* <div className={Styles["row-single"]}>
            <div className={Styles["row-wrapper"]}>
              <p>| تعداد فایل </p>
              <p>{realestate.worker_amount}</p>
            </div>
            <div className={Styles["row-wrapper"]}>
              <p>وضعیت</p>
              <p>فعال</p>
            </div>
          </div> */}

              <div className={Styles["row-single"]}>
                <div className={Styles["more-button-wrapper"]}>
                  <Button
                    variant="text"
                    style={{ fontSize: 25 }}
                    onClick={handleClose}
                  >
                    X
                  </Button>
                </div>

                {/* <div className={Styles["row-wrapper"]}>
                  <p>تاریخ عضویت</p>
                  {formatedDate()}
                </div> */}
              </div>

              <div className={Styles["row-wrapper-full"]}>
                <div className={Styles["row-wrapper"]}>
                  <p>وضعیت مشاور</p>
                  {renderStatusBox()}
                </div>
              </div>

              <div className={Styles["row-wrapper-full"]}>
                <div className={Styles["row-wrapper"]}>
                  <p>سمت مشاور</p>

                  {renderRoleSelect()}
                </div>
              </div>

              <div className={Styles["row-wrapper-full"]}>
                <div className={Styles["row-wrapper"]}>
                  <p>تاریخ عضویت</p>
                  {formatedDate()}
                </div>
              </div>

              {renderSubmit()}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  };

  const renderModal = () => {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <Box sx={style} className={Styles['modal_wrapper']}> */}
        <Box sx={Styles["modal_wrapper"]} className={Styles["modal_wrapper"]}>
          {/* {renderModalContent()} */}
          {rednerModalContents()}
        </Box>
      </Modal>
    );
  };

  return (
    <>
      <Button
        variant="text"
        style={{ fontSize: 25 }}
        onClick={() => onClickCard()}
      >
        ...
      </Button>

      {renderModal()}

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open_alert}
        autoHideDuration={10000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert_type}
          sx={{ width: "100%" }}
        >
          {problem}
        </Alert>
      </Snackbar>
    </>
  );
}

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '80%',

//   bgcolor: 'background.paper',
//   overflow:'scroll',
//   boxShadow: 24,
//   maxHeight: '80vh',
//   // display:'block',
//   p: 4,
// };
