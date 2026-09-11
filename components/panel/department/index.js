import React, { useState, useEffect } from "react";
import DepartmentHead from "./parts/DepartmentHead";
import DepartmentPersonCard from "./parts/DepartmentPersonCard";
import DepartmentPanel from "./parts/DepartmentPanel";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import LazyLoader from "../../../components/lazyLoader/Loading";

const department = (props) => {
  const department = props.department;
  const user = props.user;
  // const slug = props.slug;

  const [status, set_staus] = useState(false);

  useEffect(() => {
    if (department.agent_status == 0) {
      set_staus(0);
    } else if (department.agent_status == 1) {
      set_staus(1);
    }
  }, []);
  return (
    <div style={{ width: "100%" }}>
      <Box sx={{ flexGrow: 0 }}>
        <Grid container spacing={0}>
          <Grid item xl={2} md={0} xs={0}></Grid>
          <Grid item xl={4} md={12} xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>{department.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {status == 1 && (
                  <DepartmentPersonCard department={department} user={user} />
                )}
                <DepartmentHead department={department} />
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xl={2} md={0} xs={0}></Grid>
        </Grid>
      </Box>

      {status == 1 ? (
        <>
          <DepartmentPanel
            department={department}
            user={user}
            role={department.role}
          />
        </>
      ) : (
        <div
          style={{ background: "#6b6bbb", textAlign: "center", padding: 30 }}
        >
          <p style={{ color: "white" }}>
            درخواست شما در دست برسی توسط {department.name} میباشد
          </p>

          <p style={{ color: "white" }}>لطفا منتظر تایید مدیریت باشید</p>

          <p style={{ color: "white" }}>
            {" "}
            شماره موسس دپارتمان {department.head_phone}
          </p>
        </div>
      )}
    </div>
  );
};

export default department;
