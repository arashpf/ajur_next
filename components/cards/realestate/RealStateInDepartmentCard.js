import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Stars from "../../others/Stars";
import Styles from "../../styles/department/RealStateInDepartmentCard.module.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import CallIcon from "@mui/icons-material/Call";
import MessageIcon from "@mui/icons-material/Message";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from 'next/router';

import DepartmentEditRealestate from "../DepartmentEditRealestate";
import SpinnerLoader from "../..//panel/SpinnerLoader";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});
const RealStateInDepartmentCard = (props) => {
  const realstate = props.realstate;
  const department = props.department;

  const router = useRouter();
  const [loading, set_loading] = useState(false);
  const [open_alert, setOpenAlert] = React.useState(false);
  const [problem, setProblem] = useState("username_test_problem");
  const [vertical, set_vertical] = useState("top");
  const [horizontal, set_horizontal] = useState("center");
  const [alert_type, set_alert_type] = useState("success");

  console.log("the real estate in RealStateInDepartmentCard is :  ");
  console.log(realstate);

  function handleClose() {
    setOpenAlert(false);
    console.log("close snack is cliked");
  }

  const onClickCall = () => {
    console.log("call button clicked");
  };

  const formatedDate = () => {
    return new Date(realstate.created_at).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const confrimAgentFinal = (realstate)=> {

    var token = Cookies.get("id_token");
    axios({
      method: "post",
    
      url: "https://api.ajur.app/api/department-join-request-verify",

      params: {
        token: token,
        department_user_id : realstate.user_id
      },
    }).then(function (response) {
      
      if (response.data.status == 200) {

        setProblem("مشاور با موفقیت به دپارتمان اضافه شد");
        set_alert_type('success');
        setOpenAlert(true);

        
        router.replace("/panel").then(() => router.reload());
        
      } else {
        setProblem("مشکلی پیش آمده ، لطفا مجددا اقدام کنید ");
        set_alert_type('warning');
        setOpenAlert(true);


      }
      set_loading(false);
    });




   
  }

  const declineAgentFinal = (realstate)=> {
    
    var token = Cookies.get("id_token");

    axios({
      method: "post",
    
      url: "https://api.ajur.app/api/department-join-request-decline",

      params: {
        token: token,
        department_user_id : realstate.user_id
      },
    }).then(function (response) {
      

      if (response.data.status == 200) {

        setProblem("مشاور درخواست مشاور را با موفقیت رد کردید");
        set_alert_type('success');
        setOpenAlert(true);

        
        router.replace("/panel").then(() => router.reload());
        
      } else {
        setProblem("مشکلی پیش آمده ، لطفا مجددا اقدام کنید ");
        set_alert_type('warning');
        setOpenAlert(true);


      }
      set_loading(false);
    });
  }

  const renderContactOrConfirm = () => {
    if (realstate.status == 1) {
      return (
        <div className={Styles["row-wrapper-full"]}>
          {/* <Stack spacing={1} direction="row"> */}
            <Button
              variant="outlined"
              href={`tel:${realstate ? realstate.phone : details.cellphone}`}
              endIcon={<CallIcon style={{ marginRight: 10, color: "green" }} />}
            >
              تماس
            </Button>

            <Button
              href={`sms:${realstate ? realstate.phone : details.cellphone}`}
              variant="outlined"
              endIcon={
                <MessageIcon style={{ marginRight: 10, color: "green" }} />
              }
            >
              پیام
            </Button>
            
            <Link href={`/realestates/${realstate.user_id}?slug=${realstate.slug}`}>
              <Button variant="contained">
                <strong style={{fontSize:16}}>
                فایل ها {"("} {realstate.worker_amount} {")"}
                  
                </strong>
               
              </Button>
            </Link>
          {/* </Stack> */}
        </div>
      );
    } else if (realstate.status == 0) {

     

        return(
          <div className={Styles["row-wrapper-full"]}>
           
                <Button variant="contained"
                onClick={()=> confrimAgentFinal(realstate)}
                >
                   تایید 
                </Button>
             
  
              <Button
                variant="outlined"
                href={`tel:${realstate ? realstate.phone : details.cellphone}`}
                endIcon={<CallIcon style={{ marginRight: 10, color: "green" }} />}
              >
                تماس
              </Button>
  
              
                <Button variant="contained" style={{background:'red'}}
                onClick={()=> declineAgentFinal(realstate)}
                >
                  رد درخواست
                </Button>
              
          </div>
        )

     

      
      
    }
  };

  const renderstatus = () => {
    if (realstate.status == 1) {
      return <p style={{ color: "green" }}>فعال</p>;
    } else if (realstate.status == 0) {
      return <p style={{ color: "orange" }}>در انتظار</p>;
    } else if (realstate.status == 2) {
      return <p style={{ color: "red" }}>رد شده</p>;
    }
  };
  return (

    

      loading ?
       <SpinnerLoader />

       :

       <div className={` ${Styles["profile-card"]} 'pe-2' `}>
      <div className={Styles["profile-info"]}>
        <img
          className={Styles["profile-pic"]}
          src={realstate.profile_url}
          alt={realstate.name + realstate.family}
        />

        <h2 className={Styles["hvr-underline-from-center"]}>
          {realstate.name} {realstate.family}
          <span>
            <Stars amount={realstate.stars} />
          </span>
        </h2>
        <div className={Styles["profile-description"]}>
          <p className={Styles["show-on-hover"]}>{realstate.description}</p>
        </div>
        <div className={Styles["profile-contacts-wrapper"]}>
          <a
            onClick={onClickCall}
            className={Styles["show-on-hover"]}
            href={
              "https://api.whatsapp.com/send?phone=" +
              realstate.phone +
              "&text=سلام"
            }
          >
            <i className="fa fa-whatsapp fa-2x"></i>
          </a>
          <a
            className={Styles["show-on-hover"]}
            target="_blank"
            rel="noreferrer"
            href={"tel:" + realstate.phone}
          >
            <i className="fa fa-phone fa-2x "></i>
          </a>
        </div>
        <div className={Styles["row-wrappers"]}>
          <div className={Styles["row-single"]}>
            <div className={Styles["row-wrapper"]}>
              <p>| </p>
              <p>{realstate.role}</p>
            </div>

            <div className={Styles["row-wrapper"]}>
              <p></p>
              <p>{realstate.phone}</p>
            </div>
          </div>

          <div className={Styles["row-single"]}>
            <div className={Styles["row-wrapper"]}>
              <p>| بازدید کل  </p>
              <p>{realstate.total_view}</p>
            </div>
            <div className={Styles["row-wrapper"]}>
              <p>وضعیت</p>
              {renderstatus()} 
            </div>
          </div>

          <div className={Styles["row-single"]}>
            <div className={Styles["more-button-wrapper"]}>
              {/* <Button
                variant="text"
                style={{fontSize:25}}
               
               
              >
                ...
              </Button> */}
              <DepartmentEditRealestate department={department} realestate={realstate}   />
            </div>

            {/* <div className={Styles["row-wrapper"]}>
              <p>وضعیت</p>
              {renderstatus()}
            </div> */}
          </div>

          {renderContactOrConfirm()}
        </div>
      </div>
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
    </div>

    
    
    
  );
};

export default RealStateInDepartmentCard;
