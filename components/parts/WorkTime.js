import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/WorkTime.module.css";
import "font-awesome/css/font-awesome.min.css";
// TODO: mui grid version 2 is still unsable at moment of implementing
// but i decide to use it for now
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/system/Unstable_Grid";
import Image from "next/image";

const WorkTime = (props) => {
  return (
    <div className={styles["work-time-wrapper"]}>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <div className={styles["box-wrapper"]}>
            <div className={styles["box-left"]}>
              <p>7:30 am | 8 pm</p>
            </div>
            <div className={styles["box-right"]}>
              <p>جمعه </p>
            </div>
          </div>
        </Grid>
        <Grid xs={12} md={6}>
          <div className={styles["box-wrapper"]}>
            <div className={styles["box-left"]}>
              <p>7:30 am | 10 pm</p>
            </div>
            <div className={styles["box-right"]}>
              <p>شنبه تا پنج شنبه </p>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default WorkTime;
