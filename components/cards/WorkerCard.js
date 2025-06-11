import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import CameraIndoorIcon from "@mui/icons-material/CameraIndoor";
import CollectionsIcon from "@mui/icons-material/Collections";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Cookies from "js-cookie";
import { Box, Typography, Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { parseISO, differenceInDays } from 'date-fns';

import Styles from "../styles/WorkerCard.module.css";

export default function ImgMediaCard(props) {
  const worker = props.worker;
  const [properties, set_properties] = useState([]);

  const [isfavorite, set_isfavorite] = useState("off");

  useEffect(() => {
    // set_properties( JSON.stringify(worker.json_properties[0]));
    set_properties(JSON.parse(worker.json_properties));
  }, [worker.json_properties]);

  useEffect(() => {}, [properties]);

  useEffect(() => {
    var faviorited = Cookies.get("favorited");

    if (!faviorited) {
      return;
    }

    const productToBeSaved = worker.id;

    // const newProduct = JSON.parse(faviorited);
    var newProduct = JSON.parse(faviorited);
    if (!newProduct) {
      newProduct = [];
    }

    var length = newProduct.length;

    if (length > 20) {
      newProduct = newProduct.slice(length - 20, length);
    }
    var filterProduct = newProduct.filter(function (item) {
      return item == productToBeSaved;
    });

    if (filterProduct.length > 0) {
      set_isfavorite("on");
    }
  }, []);

  const onPressMakeWorkerfavorite = () => {
    var faviorited = Cookies.get("favorited");

    const productToBeSaved = worker.id;

    if (faviorited) {
      var newProduct = JSON.parse(faviorited);
    } else {
      var newProduct = [];
    }

    // if (!newProduct) {
    //   newProduct = [];
    // }

    const length = newProduct.length;

    if (length > 20) {
      newProduct = newProduct.slice(length - 20, length);
    }

    const filterProduct = newProduct.filter(function (item) {
      return item !== productToBeSaved;
    });
    filterProduct.push(productToBeSaved);

    Cookies.set("favorited", JSON.stringify(filterProduct));

    set_isfavorite("on");
  };

  const onPressMakeWorkerUnfavorite = () => {
    var faviorited = Cookies.get("favorited");

    const productToBeSaved = worker.id;

    if (faviorited) {
      var newProduct = JSON.parse(faviorited);
    } else {
      var newProduct = [];
    }

    const length = newProduct.length;

    if (length > 20) {
      newProduct = newProduct.slice(length - 20, length);
    }
    const filterProduct = newProduct.filter(function (item) {
      return item !== productToBeSaved;
    });

    Cookies.set("favorited", JSON.stringify(filterProduct));

    set_isfavorite("off");
  };

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
  };

  const calculateDaysPast = createdAt => {
    if (!createdAt) return 0;

    try {
      const createdDate = parseISO(createdAt);
      const daysPast = differenceInDays(new Date(), createdDate);
      
      return daysPast < 1 
        ? 'امروز در آجر' 
        : `${daysPast} روز در آجر`;
    } catch {
      return 'امروز در آجر';
    }
  };

  const renderDate = (worker) => {
    if (1) {
      return (
        // <View style={styles.dateWrapper}>
        //   {showDistance(worker.distance)}

        //   <Text>{calculateDaysPast(worker.updated_at)} </Text>
        //   <Icon
        //     name="access-time"
        //     size={18}
        //     color="gray"
        //     style={{marginLeft: 2}}
        //   />
        // </View>

        <div
          
          className={Styles["card-inside-date"]}
        >
          {/* <FavoriteIcon style={{ color: "#b92a31" }} /> */}
             تاریخ  :  {calculateDaysPast(worker.updated_at)}
        </div>
      );
    }
  };

  const renderHeart = () => {
    if (isfavorite == "on") {
      return (
        <div
          onClick={() => onPressMakeWorkerUnfavorite(worker)}
          className={Styles["card-inside-heart"]}
        >
          <FavoriteIcon style={{ color: "#b92a31" }} />
        </div>
      );
    } else if (isfavorite == "off") {
      return (
        <div
          onClick={() => onPressMakeWorkerfavorite(worker)}
          className={Styles["card-inside-heart"]}
        >
          <FavoriteBorderIcon />
        </div>
      );
    }
  };

  const rednerPrice = () => {
    var price_per_m2 = properties.filter((item) => item.name == "قیمت هر متر");
    var price_item = properties.filter((item) => item.name == "قیمت");

    var rent_front = properties.filter((item) => item.name == "پول پیش");
    var rent_per_mounth = properties.filter(
      (item) => item.name == "اجاره ماهیانه"
    );

    if (price_item[0]) {
      var price_no_format = price_item[0].value;
      var price_per_m2 = price_per_m2[0].value;

      return (
        <p style={{ direction: "rtl" }}>
          <strong style={{ fontSize: "17px", color: "#111" }}>
            {" "}
            {String(price_no_format).replace(/(.)(?=(\d{3})+$)/g, "$1,")}{" "}
            {"تومان"}
            {" | "}
          </strong>
          {" متری "}
          {String(price_per_m2).replace(/(.)(?=(\d{3})+$)/g, "$1,")} {"تومان"}{" "}
        </p>
      );
    } else if (rent_front[0]) {
      var rent_front_no_format = rent_front[0].value;
      var rent_per_mounth_no_format = rent_per_mounth[0].value;

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          {rent_per_mounth_no_format != 0 ? (
            <p style={{ direction: "rtl", paddingRight: 4 }}>
              <strong style={{ fontSize: "16px" }}>
                {" "}
                {String(rent_per_mounth_no_format).replace(
                  /(.)(?=(\d{3})+$)/g,
                  "$1,"
                )}{" "}
                {" اجاره "}{" "}
              </strong>
            </p>
          ) : (
            <strong style={{ fontSize: "16px" }}>
              <p style={{ direction: "rtl", paddingRight: 4 }}> {"کامل"} </p>
            </strong>
          )}

          <p style={{ direction: "rtl" }}>
            <strong style={{ fontSize: "16px" }}>
              {" "}
              {String(rent_front_no_format).replace(
                /(.)(?=(\d{3})+$)/g,
                "$1,"
              )}{" "}
              {" رهن  "}{" "}
            </strong>
          </p>
        </div>
      );
    }
  };

  const rednerProperties = () => {
    if (1) {
      return properties.map((pr) => (
        <>{pr.special == "1" && renderPropertiesCustomized(pr)}</>
      ));
    }
  };

  const renderPropertiesCustomized = (pr) => {
    if (pr.name == "قیمت") return;
    if (pr.name == "پول پیش") return;
    if (pr.name == "اجاره ماهیانه") return;

    if (pr.name == "قیمت هر متر") return;

    // var norama = properties.filter((item) => item.name == "قیمت");
    if (pr.kind == 1) {
      return (
        <>
          <span>&nbsp; </span>
          <p>
            | {pr.name} {String(pr.value).replace(/(.)(?=(\d{3})+$)/g, "$1,")}
          </p>
          {"."}
        </>
      );
    }
  };

  const renderVideoOrImageIcon = () => {
    return (
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

    if (worker.video_count > 0) {
      return (
        <div className={Styles["card-top-icon-wrapper"]}>
          <CameraIndoorIcon />
        </div>
      );
    } else if (worker.image_count > 0) {
      return (
        <div className={Styles["card-top-icon-wrapper"]}>
          {worker.image_count} <CollectionsIcon />
        </div>
      );
    }
  };

  const short = (name, amount) => {
    if (name.length > amount) {
      var shortname = name.substring(0, amount) + " ...";
      return shortname;
    } else {
      return name;
    }
  };

  const rednerDate = () => {
    return <>test</>;
  };

  const renderAddress = () => {
    if (worker.formatted) {
      return (
        // <div> {short(worker.neighbourhood ,40)}   </div>
        <div style={{ direction: "rtl" }}> {short(worker.formatted, 40)} </div>
      );
    } else if (worker.neighbourhood) {
      return (
        // <div> {short(worker.neighbourhood ,40)}   </div>
        <p> {short(worker.neighbourhood, 40)} </p>
      );
    } else if (worker.region) {
      return <div> {short(worker.region, 40)} </div>;
    }
  };

  const renderQuickHintHumanRedableValue = (pr) => {
    if (pr.value == 1) {
      return (
        <Chip
          label={
            <Box
              component="span"
              sx={{ display: "flex", alignItems: "center" }}
            >
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
            "& .MuiChip-label": {
              px: 0.5,
            },
          }}
        />
      );
    }
    return null;
  };

  const renderQickHintCustomized = (pr, index) => {
    // Skip specific property names
    // if (
    //   pr.name !== "پارکینگ" ||
    //   pr.name !== "انباری"
    // ) {
    //   return null;
    // }

    if (pr.kind === 2) {
      return (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "row",
            width: 100,
            justifyContent: "space-around",
          }}
        >
          {renderQuickHintHumanRedableValue(pr)}
        </Box>
      );
    }

    return null;
  };

  const renderQuickHint = () => {
    if (properties) {
      return properties.map(
        (pr, index) => pr.special === "1" && renderQickHintCustomized(pr, index)
      );
    }
  };

  const renderWorkercategory = () => {
    if (worker.category_name) {
      return <p style={{ fontSize: 16 }}> {worker.category_name} </p>;
    }
  };
  return (
    <Card
      sx={{ maxHeight: 300, height: 300 }}
      className={Styles["card-wrapper"]}
    >
      {renderNeighborHoodRibbon()}
      {renderHeart(worker)}
      {renderDate(worker)}

      <CardMedia
        component="img"
        alt={worker.name}
        height="190"
        
        image={worker.thumb}
      ></CardMedia>
      <div className={Styles["card-inside-top"]}>
        <p className={Styles["inside-top-left"]}>{renderVideoOrImageIcon()}</p>
        <div className={Styles["inside-top-right"]}>
          <p>{worker.name}</p>
        </div>
      </div>

      <CardContent>
        <div className={Styles["price-wrapper"]}> {rednerPrice()} </div>
        <div className={Styles["properties-wrapper"]}>{rednerProperties()}</div>
        <div className={Styles["properties-hint"]}>{renderQuickHint()}</div>
        
      </CardContent>
    </Card>
  );
}
