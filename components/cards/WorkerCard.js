import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CameraIndoorIcon from "@mui/icons-material/CameraIndoor";
import CollectionsIcon from "@mui/icons-material/Collections";
import Cookies from "js-cookie";
import { Box, Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { parseISO, differenceInDays } from "date-fns";
import Styles from "../styles/WorkerCard.module.css";

export default function ImgMediaCard({ worker }) {
  const [properties, setProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState("off");

  useEffect(() => {
    setProperties(JSON.parse(worker.json_properties || "[]"));
  }, [worker.json_properties]);

  useEffect(() => {
    const favorited = Cookies.get("favorited");
    if (!favorited) return;
    const productToBeSaved = worker.id;
    const newProduct = JSON.parse(favorited) || [];
    if (newProduct.includes(productToBeSaved)) {
      setIsFavorite("on");
    }
  }, [worker.id]);

  const handleFavoriteToggle = () => {
    const favorited = Cookies.get("favorited");
    const productToBeSaved = worker.id;
    const newProduct = JSON.parse(favorited) || [];
    if (isFavorite === "on") {
      const updated = newProduct.filter((id) => id !== productToBeSaved);
      Cookies.set("favorited", JSON.stringify(updated));
      setIsFavorite("off");
    } else {
      const updated = [...newProduct, productToBeSaved].slice(-20);
      Cookies.set("favorited", JSON.stringify(updated));
      setIsFavorite("on");
    }
  };

  const calculateDaysPast = (createdAt) => {
    if (!createdAt) return "امروز در آجر";
    try {
      const createdDate = parseISO(createdAt);
      const daysPast = differenceInDays(new Date(), createdDate);
      return daysPast < 1 ? "امروز در آجر" : `${daysPast} روز در آجر`;
    } catch {
      return "امروز در آجر";
    }
  };

  const short = (name, amount) =>
    name ? (name.length > amount ? name.substring(0, amount) + " ..." : name) : "";

  const renderNeighborHoodRibbon = () => {
    if (worker.neighbourhood) {
      return (
        <div className={Styles["card-inside-bottom"]}>
          <p style={{ fontSize: 13, color: "#222", display: "flex" }}>
            {worker.neighbourhood}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderHeart = () => (
    <div onClick={handleFavoriteToggle} className={Styles["card-inside-heart"]}>
      {isFavorite === "on" ? (
        <FavoriteIcon style={{ color: "#b92a31" }} />
      ) : (
        <FavoriteBorderIcon />
      )}
    </div>
  );

  const renderDate = () => (
    <div className={Styles["card-inside-date"]}>
      تاریخ: {calculateDaysPast(worker.updated_at)}
    </div>
  );

  const renderPrice = () => {
    const price = properties.find((p) => p.name === "قیمت");
    const perM2 = properties.find((p) => p.name === "قیمت هر متر");
    const rentFront = properties.find((p) => p.name === "پول پیش");
    const rentPerMonth = properties.find((p) => p.name === "اجاره ماهیانه");

    if (price) {
      return (
        <p style={{ direction: "rtl" }}>
          <strong style={{ fontSize: "17px", color: "#111" }}>
            {String(price.value).replace(/(.)(?=(\d{3})+$)/g, "$1,")} تومان
          </strong>
          {perM2 && (
            <> | متری {String(perM2.value).replace(/(.)(?=(\d{3})+$)/g, "$1,")} تومان</>
          )}
        </p>
      );
    } else if (rentFront) {
      const front = String(rentFront.value).replace(/(.)(?=(\d{3})+$)/g, "$1,");
      const month = rentPerMonth
        ? String(rentPerMonth.value).replace(/(.)(?=(\d{3})+$)/g, "$1,")
        : "0";

      return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
          {month !== "0" ? (
            <p style={{ direction: "rtl", paddingRight: 4 }}>
              <strong style={{ fontSize: "16px" }}>{month} اجاره</strong>
            </p>
          ) : (
            <p style={{ direction: "rtl", paddingRight: 4 }}>
              <strong style={{ fontSize: "16px" }}>کامل</strong>
            </p>
          )}
          <p style={{ direction: "rtl" }}>
            <strong style={{ fontSize: "16px" }}>{front} رهن</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderAddress = () => {
    if (worker.formatted) return <div style={{ direction: "rtl" }}>{short(worker.formatted, 40)}</div>;
    if (worker.neighbourhood) return <p>{short(worker.neighbourhood, 40)}</p>;
    if (worker.region) return <div>{short(worker.region, 40)}</div>;
    return null;
  };

  const renderProperties = () => (
    <div className={Styles["properties-wrapper"]}>
      {properties.map(
        (pr) =>
          pr.special === "1" &&
          !["قیمت", "پول پیش", "اجاره ماهیانه", "قیمت هر متر"].includes(pr.name) && (
            <span key={pr.name}>
              | {pr.name} {String(pr.value).replace(/(.)(?=(\d{3})+$)/g, "$1,")}
            </span>
          )
      )}
    </div>
  );

  const renderQuickHint = () => (
    <div className={Styles["properties-hint"]}>
      {properties.map(
        (pr, index) =>
          pr.special === "1" &&
          pr.kind === 2 && (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "row",
                width: 100,
                justifyContent: "space-around",
              }}
            >
              {pr.value == 1 && (
                <Chip
                  label={
                    <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                      {pr.name}
                      <CheckIcon sx={{ fontSize: 13, color: "white", ml: 0.5 }} />
                    </Box>
                  }
                  sx={{
                    px: 0.5,
                    py: 0,
                    m: 0,
                    bgcolor: "#b9272e",
                    color: "white",
                    borderRadius: 1,
                    width: 90,
                    fontSize: 13,
                    height: 24,
                    "& .MuiChip-label": { px: 0.5 },
                  }}
                />
              )}
            </Box>
          )
      )}
    </div>
  );

  const renderVideoOrImageIcon = () => (
    <>
      {worker.video_count > 0 && (
        <div className={Styles["card-top-icon-wrapper"]}>
          <CameraIndoorIcon />
        </div>
      )}
      {worker.image_count > 0 && (
        <div className={Styles["card-top-icon-wrapper"]}>
          {worker.image_count} <CollectionsIcon />
        </div>
      )}
    </>
  );

  return (
    <Card sx={{ maxHeight: 300, height: 300 }} className={Styles["card-wrapper"]}>
      {renderNeighborHoodRibbon()}
      {renderHeart()}
      {renderDate()}
      <CardMedia
        component="img"
        alt={worker.name}
        height="190"
        className="notailwind"
        image={worker.thumb}
      />
      <div className={Styles["card-inside-top"]}>
        <p className={Styles["inside-top-left"]}>{renderVideoOrImageIcon()}</p>
        <div className={Styles["inside-top-right"]}>
          <p>{worker.name}</p>
        </div>
      </div>
      <CardContent>
        <div className={Styles["price-wrapper"]}>{renderPrice()}</div>
        {renderAddress()}
        {renderProperties()}
        {renderQuickHint()}
      </CardContent>
    </Card>
  );
}
