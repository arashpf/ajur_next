import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Styles from "../styles/CatCard.module.css";

const iconsImages = {
  gps: require("../assets/icons/touch-in.png"),
  home: require("../assets/icons/home.png"),
  office: require("../assets/icons/office.png"),
  inductry: require("../assets/icons/inductry.png"),
  land: require("../assets/icons/land.png"),
  sport: require("../assets/icons/sport.png"),
  vacations: require("../assets/icons/vacations.png"),
  wedding: require("../assets/icons/wedding.png")
};

function CatCard(props) {
  const cat = props.cat;
  return (
    <figure className={Styles["snip1578"]}>
      <figcaption>
        <h3>
          {cat.name}
        </h3>
      </figcaption>
      <Image
        className={Styles["snip-image"]}
        src={iconsImages[cat.avatar]}
        alt={cat.avatar}
        width={30}
        height={30}
      />
    </figure>
  );
}

export default CatCard;
