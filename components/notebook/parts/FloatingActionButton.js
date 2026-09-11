import React from "react";
import { IoSearch, IoAdd } from "react-icons/io5";
import styles from "./styles.module.css";

const FloatingActionButton = ({ onPress, style, icon }) => {
  const getIcon = () => {
    if (icon === "search") {
      return <IoSearch size={24} color="white" />;
    }
    // Default to add icon
    return <IoAdd size={24} color="white" />;
  };

  return (
    <button
      type="button"
      className={`${styles.fab} ${style || ""}`}
      onClick={onPress}
    >
      {getIcon()}
    </button>
  );
};

export default FloatingActionButton;
