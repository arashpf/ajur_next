import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Styles from "../../../styles/department/DepartmentPersonCard.module.css";
const DepartmentPersonCard = (props) => {
  const user = props.user;
  const department = props.department;
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={2} xs={0}></Grid>
        <Grid item md={8} xs={12}>
          <div className={Styles["wrapper"]}>
          <p>{department.role}</p>
            <p>
              {user.name} {user.family}
            </p>
            
          </div>
        </Grid>
        <Grid item md={2} xs={0}></Grid>
      </Grid>
    </div>
  );
};

export default DepartmentPersonCard;
