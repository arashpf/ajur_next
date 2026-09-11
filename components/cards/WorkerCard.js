import React, { useState, useEffect, useRef } from "react";
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
import { Box, Chip } from "@mui/material"; // ← removed Typography
import CheckIcon from "@mui/icons-material/Check";
import { parseISO, differenceInDays } from "date-fns";

import Styles from "../styles/WorkerCard.module.css";

export default function ImgMediaCard(props) {
  const worker = props.worker;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [properties, set_properties] = useState([]);
  const [hasQuickHints, setHasQuickHints] = useState(false);

  const [isfavorite, set_isfavorite] = useState("off");

  useEffect(() => {
    set_properties(JSON.parse(worker.json_properties));
  }, [worker.json_properties]);

  useEffect(() => {
    const hints = properties.filter(
      (pr) => pr.special === "1" && pr.kind === 2 && pr.value == 1
    );
    setHasQuickHints(hints.length > 0);
  }, [properties]);

  useEffect(() => {
    var faviorited = Cookies.get("favorited");

    if (!faviorited) {
      return;
    }

    const productToBeSaved = worker.id;

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
        <div className={Styles["card-inside-neighbor"]}>
          <p style={{ fontSize: 13, color: "#222", display: "flex" }}>
            {worker.neighbourhood} {worker.city}
          </p>
        </div>
      );
    }
  };

  const calculateDaysPast = (createdAt) => {
    if (!createdAt) return 0;

    try {
      const createdDate = parseISO(createdAt);
      const daysPast = differenceInDays(new Date(), createdDate);

      return daysPast < 1
        ? "امروز در آجر"
        : `${daysPast} روز در آجر`;
    } catch {
      return "امروز در آجر";
    }
  };

  const renderDate = (worker) => {
    return (
      <div className={Styles["card-inside-date"]}>
        تاریخ : {calculateDaysPast(worker.updated_at)}
      </div>
    );
  };

  const renderHeart = () => {
    const handleUnfavoriteClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onPressMakeWorkerUnfavorite(worker);
    };

    const handleFavoriteClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onPressMakeWorkerfavorite(worker);
    };

    if (isfavorite == "on") {
      return (
        <div
          onClick={handleUnfavoriteClick}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleUnfavoriteClick(e);
          }}
          role="button"
          tabIndex={0}
          className={Styles["card-inside-heart"]}
        >
          <FavoriteIcon style={{ color: "#b92a31" }} />
        </div>
      );
    } else if (isfavorite == "off") {
      return (
        <div
          onClick={handleFavoriteClick}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleFavoriteClick(e);
          }}
          role="button"
          tabIndex={0}
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

      const priceInner = (
        <p style={{ direction: "rtl" }}>
          <strong style={{ fontSize: "17px", color: "#111" }}>
            {String(price_no_format).replace(/(.)(?=(\d{3})+$)/g, "$1,")} تومان |
          </strong>
          {" "}
          متری {String(price_per_m2).replace(/(.)(?=(\d{3})+$)/g, "$1,")} تومان
        </p>
      );

      return <PriceBubble>{priceInner}</PriceBubble>;
    } else if (rent_front[0]) {
      var rent_front_no_format = rent_front[0].value;
      var rent_per_mounth_no_format = rent_per_mounth[0].value;

      const rentInner = (
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
                {String(rent_per_mounth_no_format).replace(
                  /(.)(?=(\d{3})+$)/g,
                  "$1,"
                )}{" "}
                اجاره
              </strong>
            </p>
          ) : (
              <strong style={{ fontSize: "16px" }}>
                <p style={{ direction: "rtl", paddingRight: 4 }}>کامل</p>
              </strong>
            )}

          <p style={{ direction: "rtl" }}>
            <strong style={{ fontSize: "16px" }}>
              {String(rent_front_no_format).replace(/(.)(?=(\d{3})+$)/g, "$1,")}
              {" "}
              رهن
            </strong>
          </p>
        </div>
      );

      return <PriceBubble>{rentInner}</PriceBubble>;
    }
  };

  const PriceBubble = ({ children }) => {
    const summaryRef = useRef(null);
    const [truncated, setTruncated] = useState(false);

    useEffect(() => {
      const el = summaryRef.current;
      if (!el) return;

      const check = () => {
        setTruncated(el.scrollWidth > el.clientWidth + 1);
      };

      check();
      const ro = new ResizeObserver(check);
      ro.observe(el);
      window.addEventListener("resize", check);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", check);
      };
    }, [children]);

    return (
      <div
        className={`${Styles["price-container"]} ${truncated ? "has-overflow" : ""
          }`}
      >
        <div ref={summaryRef} className={Styles["price-summary"]}>
          {children}
        </div>
        {truncated && (
          <div className={Styles["price-bubble"]}>{children}</div>
        )}
      </div>
    );
  };

  const rednerProperties = () => {
    return properties.map((pr) => (
      <React.Fragment key={pr.id}>
        {pr.special == "1" && renderPropertiesCustomized(pr)}
      </React.Fragment>
    ));
  };

  const renderPropertiesCustomized = (pr) => {
    if (pr.name == "قیمت") return;
    if (pr.name == "پول پیش") return;
    if (pr.name == "اجاره ماهیانه") return;

    if (pr.name == "قیمت هر متر") return;

    if (pr.kind == 1) {
      // ⬇️ CHANGED: outer <div> → <span> so it can live safely inside its parent row
      return (
        <span key={pr.id}>
          {" "}
          <span>
            | {pr.name}{" "}
            {String(pr.value).replace(/(.)(?=(\d{3})+$)/g, "$1,")}
          </span>
          {"."}
        </span>
      );
    }
  };

  const renderVideoOrImageIcon = () => {
    return (
      <>
        {worker.video_count > 0 && (
          <span className={Styles["card-top-icon-wrapper"]}>
            <CameraIndoorIcon />
          </span>
        )}

        {worker.image_count > 0 && (
          <span className={Styles["card-top-icon-wrapper"]}>
            {worker.image_count} <CollectionsIcon />
          </span>
        )}
      </>
    );
  };

  const short = (name, amount) => {
    if (name.length > amount) {
      var shortname = name.substring(0, amount) + " ...";
      return shortname;
    } else {
      return name;
    }
  };

  const d = () => {
    if (worker.formatted) {
      return <div style={{ direction: "rtl" }}>{short(worker.formatted, 40)}</div>;
    } else if (worker.neighbourhood) {
      return <p>{short(worker.neighbourhood, 40)}</p>;
    } else if (worker.region) {
      return <div>{short(worker.region, 40)}</div>;
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
      const hints = properties
        .map(
          (pr, index) =>
            pr.special === "1" && renderQickHintCustomized(pr, index)
        )
        .filter(Boolean);

      return hints.length > 0 ? hints : null;
    }
    return null;
  };

  const renderWorkercategory = () => {
    if (worker.category_name) {
      return <p style={{ fontSize: 16 }}>{worker.category_name}</p>;
    }
  };

  return (
    <div>
      <Card
        sx={{ width: "100%", borderRadius: "10px" }}
        className={`notailwind 
  ${Styles["card-wrapper"]} 
  ${worker.is_special ? Styles["card-wrapper-special"] : ""} 
  ${worker.is_urgent ? Styles["card-wrapper-urgent"] : ""}
`}
      >
        {renderNeighborHoodRibbon()}
        {renderHeart(worker)}
        {/* {renderDate(worker)} */}
        {/* Todo: maybe we need time and date back to card later */}

        {/* IMAGE WITH URGENT RIBBON */}
        <div style={{ position: "relative" }}>
          {worker.is_urgent && (
            <div className={Styles["urgent-ribbon"]}>
              <p>فوری</p>
            </div>
          )}

          {!imageLoaded && (
            <div
              className={Styles["image-skeleton"]}
              aria-hidden="true"
            />
          )}

          <CardMedia
            component="img"
            alt={worker.name}
            className={`notailwind ${Styles["card-media"]} card-media-global`}
            image={worker.thumb}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        </div>

        <div className={Styles["card-inside-top"]}>
          {/* ⬇️ CHANGED: was <p> wrapping <div>s → now a <div> */}
          <div className={Styles["inside-top-left"]}>
            {renderVideoOrImageIcon()}
          </div>

          <div className={Styles["inside-top-right"]}>
            <p className={Styles["worker-title"]}>
              {worker.name}

              {worker.is_special && (
                <span className={Styles["ad-badge"]}> آگهی </span>
              )}
            </p>
          </div>
        </div>

        <CardContent className={Styles["card-content"]}>
          <div className={Styles["price-wrapper"]}>
            {rednerPrice()}
          </div>
          <div className={Styles["properties-wrapper"]}>
            {rednerProperties()}
          </div>

          <div
            className={`${Styles["properties-hint"]} ${!hasQuickHints ? Styles["no-hints"] : ""
              }`}
          >
            {hasQuickHints && renderQuickHint()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}