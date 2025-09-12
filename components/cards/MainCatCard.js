import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Styles from "../styles/CatCard.module.css";
import styled from "@emotion/styled";

const iconsImages = {
  home: require("../assets/cat/home.jpg"),
  land: require("../assets/cat/land.jpg"),
  office: require("../assets/cat/office.jpg"),
  industry: require("../assets/cat/industry.jpg"),
  renthome: require("../assets/cat/renthome.jpg"),
  rentoffice: require("../assets/cat/rentoffice.jpg"),
  rentindustry: require("../assets/cat/rentindustry.jpg") // اصلاح شد
};

function MainCatCard(props) {
  const cat = props.cat;
  return (
    <Image
      style={{ borderRadius: "8px" }}
      src={iconsImages[cat.avatar]}
      alt={cat.name}
      width={600}
      height={980}
      loading="lazy"
    />
  );
}

export default MainCatCard;
