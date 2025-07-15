import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Styles from "../../../styles/department/DepartmentHead.module.css";
import Stars from "../../../others/Stars";
import DepartmentShare from "./DepartmentShare";
import QrCodeGenerator from "../../../others/QrCodeGenerator.jsx";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function DepartmentHead(props) {
  const department = props.department;
  const slug = props.slug;

  return (
    <Grid container spacing={1}>
      <Grid item md={2} xs={0}></Grid>

      <Grid item md={8} xs={12}>
        <div className={Styles["worker-realstate-card-wrapper"]}>
          <CardHeader
            avatar={
              <Avatar
                alt={department.name}
                src={department.avatar}
                sx={{ width: 100, height: 100 }}
              />
            }
            title={department.name}
            subheader={department.description}
          />
          <Stars amount={department.stars} />
          <div className={Styles["worker-realstate-stars-and-shares"]}>
            <div style={{ paddingTop: 30 }}>
              <DepartmentShare department={department} slug={slug} />
            </div>
            <div style={{ padding: 10 }}>
              <QrCodeGenerator
                url={
                  "https://ajur.app/department/" +
                  department.id +
                  "?slug=" +
                  slug
                }
                title="اسکن کنید"
              />
            </div>
          </div>
        </div>
      </Grid>

      <Grid item md={2} xs={0}></Grid>
    </Grid>
  );
}
