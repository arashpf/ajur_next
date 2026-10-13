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
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import ElevatorIcon from "@mui/icons-material/Elevator";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StorageIcon from "@mui/icons-material/Storage";

import TourDialog from "../dialogs/TourDialog";
import WorkerRealstateCard from "../cards/realestate/WorkerRealstateCard";
import RealstateSkeleton from "../skeleton/RealstateSkeleton";
import Statistics from "../others/Statistics";
import axios from "axios";

import { trackEvent } from "../../lib/track";

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

  const getFeatureValue = (key) => {
    const property = properties.find((p) => p.key === key);
    return property ? property.value : null;
  };

  // Get main features
  const area = getFeatureValue("متراژ کل") || getFeatureValue("مساحت");
  const rooms = getFeatureValue("تعداد اتاق") || getFeatureValue("اتاق");
  const yearMade = getFeatureValue("سال ساخت") || getFeatureValue("ساخت");
  const price = getFeatureValue("قیمت");
  const price_per_m = getFeatureValue("قیمت هر متر");

  const deposit = getFeatureValue("پول پیش") || getFeatureValue("پیش پرداخت");
  const monthlyRent =
    getFeatureValue("اجاره ماهیانه") || getFeatureValue("اجاره");

  // -------- Amenities (type === "2") --------
  // The API returns these as `{ key, value: "0" | "1", type: "2" }`
  // We look up each key fragment and return:
  //   "yes" | "no" | null (not present)
  const lookupAmenity = (fragments) => {
    const found = properties.find(
      (p) =>
        p.type === "2" &&
        fragments.some((f) => p.key?.includes(f))
    );
    if (!found) return null;
    return String(found.value) === "1" ? "yes" : "no";
  };

  const elevatorState = lookupAmenity(["آسانسور"]);
  const parkingState = lookupAmenity(["پارکینگ"]);
  const storageState = lookupAmenity(["انباری", "انبار", "ذخیره"]);

  // Show the amenities row if at least one of the fields exists
  const shouldRenderAmenities =
    elevatorState !== null ||
    parkingState !== null ||
    storageState !== null;

  // -------- Render helpers for property list types --------
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
    // Only render positive ticks here; negatives are handled by the highlights row
    if ((pro.type == "2" || pro.kind == "2") && String(pro.value) === "1") {
      return (
        <Button
          className={Styles["worker-properties-button"]}
          variant="outlined"
          color="success"
          startIcon={<DoneIcon />}
        >
          {pro.key || pro.name}
        </Button>
      );
    }
  }

  function renderPropertiesKinds3(pro) {
    if (pro.type == "3" || pro.kind == "3") {
      return (
        <div className={Styles["worker-properties-list"]}>
          <div className={Styles["worker-properties-list-left"]}>
            <p>{pro.key || pro.name}</p>
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
      .filter(
        (pro) =>
          !excludeKeys.some((key) => (pro.key || pro.name)?.includes(key))
      )
      .map((pro) => (
        <Grid key={pro.id} xs={12} md={12}>
          {renderPropertiesKinds1(pro)}
        </Grid>
      ));
  };

  const renderProperties2 = () => {
    const excludeKeys = ["آسانسور", "پارکینگ", "انبار", "انباری", "ذخیره"];
    return properties
      .filter(
        (pro) =>
          !excludeKeys.some((key) => (pro.key || pro.name)?.includes(key))
      )
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
          <WorkerRealstateCard realstate={realstate} />
        </Link>
      );
    } else {
      return <RealstateSkeleton />;
    }
  };

  // -------- Amenity item renderer --------
  const renderAmenityItem = (Icon, label, state) => {
    if (state === null) return null;
  
    const isYes = state === "yes";
  
    return (
      <div
        className={`${Styles["amenity-item"]} ${
          isYes ? Styles["active"] : Styles["inactive"]
        }`}
        aria-label={`${label} ${isYes ? "دارد" : "ندارد"}`}
      >
        <div className={Styles["amenity-icon-wrapper"]}>
          <Icon
            style={{
              width: "26px",
              height: "26px",
              fontSize: "26px",
              opacity: isYes ? 1 : 0.45,
            }}
          />
          <span
            className={`${Styles["amenity-badge"]} ${
              isYes ? Styles["amenity-badge-yes"] : Styles["amenity-badge-no"]
            }`}
          >
            {isYes ? (
              <DoneIcon style={{ fontSize: "10px" }} />
            ) : (
              <CloseIcon style={{ fontSize: "10px" }} />
            )}
          </span>
        </div>
        <span>{label}</span>
      </div>
    );
  };

  const renderHighlights = () => {
    const hasMainFeatures =
      (area && area !== "0") ||
      (rooms && rooms !== "0") ||
      (yearMade && yearMade !== "0");

    if (!hasMainFeatures && !shouldRenderAmenities) {
      return null;
    }

    return (
      <div className={Styles["highlights-section"]}>
        {/* Main Features Row */}
        {hasMainFeatures && (
          <div className={Styles["highlights-row"]}>
            {area && area !== "0" && (
              <div className={Styles["highlight-item"]}>
                <span className={Styles["highlight-label"]}>متراژ</span>
                <span className={Styles["highlight-value"]}>{area}</span>
              </div>
            )}
            {rooms && rooms !== "0" && (
              <div className={Styles["highlight-item"]}>
                <span className={Styles["highlight-label"]}>اتاق</span>
                <span className={Styles["highlight-value"]}>{rooms}</span>
              </div>
            )}
            {yearMade &&
              yearMade !== "0" &&
              details.category_name !== "رهن و اجاره" && (
                <div className={Styles["highlight-item"]}>
                  <span className={Styles["highlight-label"]}>سال ساخت</span>
                  <span className={Styles["highlight-value"]}>{yearMade}</span>
                </div>
              )}
          </div>
        )}

        {/* Amenities Row — only for fields that exist in the data */}
        {shouldRenderAmenities && (
          <div className={Styles["amenities-row"]}>
            {renderAmenityItem(ElevatorIcon, "آسانسور", elevatorState)}
            {renderAmenityItem(DirectionsCarIcon, "پارکینگ", parkingState)}
            {renderAmenityItem(StorageIcon, "انباری", storageState)}
          </div>
        )}
      </div>
    );
  };

  const handlePropertyCall = async () => {


    const phone = realstate?.phone || details.cellphone;
    const workerId = details.id;


    trackEvent(
      "listing_call",
      {
        listing_id: details.id,
        phone: phone || null,
        realstate_id: realstate?.id || null,
        source: "worker-page-detail",
      },
      props.__clientIp
    );

    try {
      await axios.post("https://api.ajur.app/api/track/worker-call", {
        worker_id: workerId,
      });
    } catch (error) {
      console.error("Worker call tracking failed:", error);
    }

    window.location.href = `tel:${phone}`;
  };

  return (
    <div className={Styles["worker-details-wrapper"]}>
      <div className={Styles["worker-header-section"]}>
        <h1 className={Styles["worker-detail-header"]}>{details.name}</h1>
        <p className={Styles["worker-detail-subtitle"]}>
          {getTimeAgo(details.created_at)} در {details.neighbourhood} / شهر{" "}
          {details.city}
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
            handlePropertyCall();
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
            fontSize: "20px",
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
          disabled
        >
          چت (به زودی)
        </button>
      </div>

     

      {/* Price/Rent Section */}
      {(price || monthlyRent) && (
  <div
    style={{
      marginBottom: "24px",
      marginTop: "24px",
      padding: "16px",
      background: "#f9f9f9",
      borderRadius: "12px",
      textAlign: "right",
      direction: "rtl",
    }}
  >
    {price && (
      <>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#222",
            marginBottom: "12px",
          }}
        >
          قیمت : {Number(price).toLocaleString("en-US")} تومان
        </div>
        {price_per_m && (
          <div
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#666",
              marginBottom: "4px",
            }}
          >
            قیمت هر متر :{" "}
            {parseInt(price_per_m).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </div>
        )}
      </>
    )}

    {monthlyRent && (
      <>
        {deposit && (
          <div
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#222",
              marginBottom: "12px",
            }}
          >
            پول پیش: {Number(deposit).toLocaleString("en-US")} تومان
          </div>
        )}
        <div
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#666",
          }}
        >
          اجاره ماهیانه: {Number(monthlyRent).toLocaleString("en-US")} تومان
        </div>
      </>
    )}
  </div>
)}

 {/* Highlights Section */}
 {renderHighlights()}

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
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        textAlign: "right",
        direction: "rtl",
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

WorkerDetails.propTypes = {
  details: PropTypes.object,
  properties: PropTypes.array,
  realstate: PropTypes.object,
};

export default WorkerDetails;