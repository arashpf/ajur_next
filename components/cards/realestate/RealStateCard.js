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
import Styles from "../../styles/WorkerRealstate.module.css";
import Stars from "../../others/Stars";
import RealEstateShare from "./RealEstateShare";
import QrCodeGenerator from "../../others/QrCodeGenerator.jsx";

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

export default function RealstateCard(props) {
  const realstate = props.realstate;
  const slug = props.slug;

  return (
    <div className={Styles["worker-realstate-card-wrapper"]}>
      <CardHeader
        avatar={
          <Avatar
            alt={realstate.name}
            src={realstate.profile_url}
            sx={{ width: 70, height: 70 }}
          />
        }
        title={realstate.name + " " + realstate.family}
        subheader={realstate.description}
      />-
        <Stars amount={realstate.stars} />
      <div className={Styles["worker-realstate-stars-and-shares"]}>
        <div>
          <RealEstateShare realstate={realstate} slug={slug} />
        </div>
        <div style={{padding:10}}>
        <QrCodeGenerator  url={"https://ajur.app/realestates/" + realstate.id + "?slug=" + slug}  title='اسکن کنید'/>
        </div>
       
      </div>
      
      
      
    </div>
  );
}
