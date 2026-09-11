import React from "react";
import PropTypes from "prop-types";
import Styles from "../styles/WorkerDetails.module.css";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CallIcon from "@mui/icons-material/Call";
import TourOutlinedIcon from "@mui/icons-material/TourOutlined";
import DoneIcon from "@mui/icons-material/Done";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import DialogTitle from "@mui/material/DialogTitle";
import Avatar from "@mui/material/Avatar";
import { blue } from "@mui/material/colors";
import ElevatorIcon from "@mui/icons-material/Elevator";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StorageIcon from "@mui/icons-material/Storage";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import ApartmentIcon from "@mui/icons-material/Apartment";

import TourDialog from "../dialogs/TourDialog";
import WorkerRealstateCard from "../cards/realestate/WorkerRealstateCard";
import RealstateSkeleton from "../skeleton/RealstateSkeleton";
import Statistics from "../others/Statistics";
import axios from "axios";

const emails = ["username@gmail.com", "user02@gmail.com"];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function SimpleDialog(props) {
  const { onClose, selectedValue, open, details, realstate } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <TourDialog
        realstate={realstate}
        details={details}
        handleClose={handleClose}
      />
    </Dialog>
  );
}

function WorkerDetails(props) {
  let details = props.details;
  let properties = props.properties;
  let realstate = props.realstate;

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  // Function to calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "لحظاتی پیش";
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    if (diffDays === 1) return "دیروز";
    if (diffDays < 7) return `${diffDays} روز پیش`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} هفته پیش`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ماه پیش`;
    return `${Math.floor(diffDays / 365)} سال پیش`;
  };

  // Extract key features from properties
  // const getFeatureValue = (key) => {
  //   const property = properties.find((p) => p.key?.includes(key));
  //   return property ? property.value : null;
  // };


  const getFeatureValue = (key) => {
    const property = properties.find((p) => p.key === key);
    return property ? property.value : null;
  };

  // Get main features
  const area = getFeatureValue("متراژ کل") || getFeatureValue("مساحت");
  const rooms = getFeatureValue("اتاق") || getFeatureValue("خواب");
  const yearMade = getFeatureValue("سال ساخت") || getFeatureValue("ساخت");
  const price = getFeatureValue("قیمت");
  const price_per_m = getFeatureValue("قیمت هر متر");


  const deposit = getFeatureValue("پول پیش") || getFeatureValue("پیش پرداخت");
  const monthlyRent =
    getFeatureValue("اجاره ماهیانه") || getFeatureValue("اجاره");

  // Get amenities (type 2 properties which are checkmarks)
  const amenities = properties.filter((p) => p.type === "2");
  const hasElevator = amenities.some((a) => a.key?.includes("آسانسور"));
  const hasParking = amenities.some((a) => a.key?.includes("پارکینگ"));
  const hasStorage = amenities.some(
    (a) => a.key?.includes("انبار") || a.key?.includes("ذخیره")
  );

  function renderPropertiesKinds1(pro) {
    if (pro.type == "1") {
      return (
        <div className={Styles["worker-properties-list"]}>
          <div className={Styles["worker-properties-list-left"]}>
            <p>{pro.key}</p>
          </div>
          <div className={Styles["worker-properties-list-right"]}>
            <p>{pro.value}</p>
          </div>
        </div>
      );
    }
  }

  function renderPropertiesKinds2(pro) {
    if (pro.type == "2") {
      return (
        <Button
          className={Styles["worker-properties-button"]}
          variant="outlined"
          color="success"
          startIcon={<DoneIcon />}
        >
          {pro.key}
        </Button>
      );
    }
  }

  function renderPropertiesKinds3(pro) {
    if (pro.type == "3") {
      return (
        <div className={Styles["worker-properties-list"]}>
          <div className={Styles["worker-properties-list-left"]}>
            <p>{pro.key}</p>
          </div>
          <div className={Styles["worker-properties-list-right"]}>
            <p>{pro.value}</p>
          </div>
        </div>
      );
    }
  }

  const renderProperties1 = () => {
    const excludeKeys = [
      "متراژ",
      "مساحت",
      "اتاق",
      "خواب",
      "سال ساخت",
      "ساخت",
      "قیمت",
      "price",
      "قیمت هر متر",
      "پول پیش",
      "پیش پرداخت",
      "اجاره ماهیانه",
      "اجاره",
    ];
    return properties
      .filter((pro) => !excludeKeys.some((key) => pro.key?.includes(key)))
      .map((pro) => (
        <Grid key={pro.id} xs={12} md={12}>
          {renderPropertiesKinds1(pro)}
        </Grid>
      ));
  };

  const renderProperties2 = () => {
    const excludeKeys = ["آسانسور", "پارکینگ", "انبار", "ذخیره"];
    return properties
      .filter((pro) => !excludeKeys.some((key) => pro.key?.includes(key)))
      .map((pro) => <div key={pro.id}>{renderPropertiesKinds2(pro)}</div>);
  };

  const renderProperties3 = () => {
    return properties.map((pro) => (
      <Grid key={pro.id} xs={12} md={12}>
        {renderPropertiesKinds3(pro)}
      </Grid>
    ));
  };

  const renderRealstate = () => {
    if (realstate.id) {
      return (
        <Link
          href={`/realestates/${realstate.id}?slug=${realstate.slug}`}
          key={realstate.id}
        >
          {/* <a> */}
          <WorkerRealstateCard realstate={realstate} />
          {/* </a> */}
        </Link>
      );
    } else {
      return <RealstateSkeleton />;
    }
  };

  const renderHighlights = () => {
    return (
      <div className={Styles["highlights-section"]}>
        {/* Main Features Row */}
        <div className={Styles["highlights-row"]}>
          {area && (
            <div className={Styles["highlight-item"]}>
              <span className={Styles["highlight-label"]}>متراژ</span>
              <span className={Styles["highlight-value"]}>{area}</span>
            </div>
          )}
          {rooms && (
            <div className={Styles["highlight-item"]}>
              <span className={Styles["highlight-label"]}>اتاق</span>
              <span className={Styles["highlight-value"]}>{rooms}</span>
            </div>
          )}
          {yearMade && details.category_name !== "رهن و اجاره" && (
            <div className={Styles["highlight-item"]}>
              <span className={Styles["highlight-label"]}>سال ساخت</span>
              <span className={Styles["highlight-value"]}>{yearMade}</span>
            </div>
          )}
        </div>

        {/* Amenities Row */}
        <div className={Styles["amenities-row"]}>
          <div
            className={`${Styles["amenity-item"]} ${hasElevator ? Styles["active"] : Styles["inactive"]
              }`}
          >
            <ElevatorIcon
              style={{ width: "44px", height: "44px", fontSize: "44px" }}
            />
            <span>آسانسور</span>
          </div>
          <div
            className={`${Styles["amenity-item"]} ${hasParking ? Styles["active"] : Styles["inactive"]
              }`}
          >
            <DirectionsCarIcon
              style={{ width: "44px", height: "44px", fontSize: "44px" }}
            />
            <span>پارکینگ</span>
          </div>
          <div
            className={`${Styles["amenity-item"]} ${hasStorage ? Styles["active"] : Styles["inactive"]
              }`}
          >
            <StorageIcon
              style={{ width: "44px", height: "44px", fontSize: "44px" }}
            />
            <span>انبار</span>
          </div>
        </div>
      </div>
    );
  };

  const handlePropertyCall = async () => {


    


    const phone = realstate?.phone || details.cellphone
    const workerId = details.id; // adjust if needed

    try {
      await axios.post("https://api.ajur.app/api/track/worker-call", {
        worker_id: workerId,
      });
    } catch (error) {
      console.error("Worker call tracking failed:", error);
    }

    // Always start the call
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className={Styles["worker-details-wrapper"]}>
      <div className={Styles["worker-header-section"]}>
        <h1 className={Styles["worker-detail-header"]}>{details.name}</h1>
        <p className={Styles["worker-detail-subtitle"]}>
          {getTimeAgo(details.created_at)} در {details.neighbourhood} / شهر {details.city}
        </p>
      </div>

      {/* Action Buttons Section */}
      <div
        className={Styles["action-buttons-section"]}
        style={{
          display: "flex",
          gap: "12px",
          direction: "rtl",
          marginBottom: "24px",
        }}
      >
        <a
          href={`tel:${realstate?.phone || details.cellphone}`}
          onClick={(e) => {
            e.preventDefault();
            handlePropertyCall(
              realstate?.phone || details.cellphone,
              realstate?.id || details.id
            );
          }}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            textDecoration: "none",
            textAlign: "center",
            fontWeight: "600",
            color: "#222",
            fontSize: "26px",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#f9f9f9";
            e.currentTarget.style.borderColor = "#bbb";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#ddd";
          }}
        >

          {realstate?.phone || details.cellphone}

          {/* <CallIcon style={{ fontSize: "20px" }} /> */}

          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#a92b31",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CallIcon style={{ fontSize: "18px", color: "#fff" }} />
          </div>
        </a>

        <button
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontWeight: "600",
            color: "#999",
            fontSize: "16px",
            cursor: "not-allowed",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#f9f9f9";
            e.currentTarget.style.borderColor = "#bbb";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#ddd";
          }}
          disabled
        >
          چت (به زودی)
        </button>
      </div>

      {/* Highlights Section */}
      {renderHighlights()}

      {/* Price/Rent Section */}
      {(price || monthlyRent) && (
        <div
          style={{
            marginBottom: "32px",
            marginTop: "24px",
            textAlign: "right",
            direction: "rtl",
          }}
        >
          {/* Buy Price */}
          {price && (
            <>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: "700",
                  color: "#222",
                  marginBottom: "12px",
                }}
              >
                قیمت: {Number(price).toLocaleString("en-US")} تومان
              </div>
              {price_per_m && (
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#666",
                    marginBottom: "24px",
                  }}
                >
                  قیمت هر متر:{" "}
                  {(parseInt(price_per_m)).toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
                </div>
              )}
            </>
          )}

          {/* Rent Info */}
          {monthlyRent && (
            <>
              {deposit && (
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: "700",
                    color: "#222",
                    marginBottom: "12px",
                    marginRight: "25px",
                  }}
                >
                  پول پیش: {Number(deposit).toLocaleString("en-US")} تومان
                </div>
              )}
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#666",
                  marginRight: "25px",
                }}
              >
                اجاره ماهیانه: {Number(monthlyRent).toLocaleString("en-US")}{" "}
                تومان
              </div>
            </>
          )}
        </div>
      )}

      <Box component="div">{renderProperties1()}</Box>

      <Box component="div" sx={{ p: 2 }}>
        <Grid
          className={Styles["worker-details-property-grid"]}
          container
          spacing={2}
        >
          {renderProperties2()}
        </Grid>
      </Box>

      <Box component="div">{renderProperties3()}</Box>

      <Statistics
        total_view={details.total_view}
        total_day={details.total_day}
      />

      {/* Description Section */}
      {details.description && (
        <div
          style={{
            marginBottom: "24px",
            padding: "16px",
            background: "#f9f9f9",
            borderRadius: "12px",
            textAlign: "right",
            direction: "rtl",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#888",
              fontWeight: "500",
              marginBottom: "8px",
            }}
          >
            توضیحات
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "#444",
              lineHeight: "1.8",
              margin: "0",
            }}
          >
            {details.description}
          </p>
        </div>
      )}

      {/* Address Section */}
      {details.formatted && (
        <div
          style={{
            marginBottom: "24px",
            padding: "16px",
            background: "#f9f9f9",
            borderRadius: "12px",
            textAlign: "right",
            direction: "rtl",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#888",
              fontWeight: "500",
              marginBottom: "8px",
            }}
          >
            آدرس
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "#444",
              margin: "0",
              lineHeight: "1.8",
            }}
          >
            {details.formatted}
          </p>
        </div>
      )}

      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        realstate={realstate}
        details={details}
      />
    </div>
  );
}

export default WorkerDetails;
