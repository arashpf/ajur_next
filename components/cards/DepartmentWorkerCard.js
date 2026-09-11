import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CameraIndoorIcon from "@mui/icons-material/CameraIndoor";
import CollectionsIcon from "@mui/icons-material/Collections";
import WorkerPanelDetails from "../workers/WorkerPanelDetails";
import WorkerPanelActions from "../workers/WorkerPanelActions";
import SpinnerModalLoader from "../panel/SpinnerModalLoader";
import WorkerShare from "../workers/WorkerShare";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import dynamic from "next/dynamic";
import axios from "axios";

import ImageSlider from "../sliders/ImageSlider";
import VideoSlider from "../sliders/VideoSlider";

const LocationNoSsr = dynamic(() => import("../map/Location"), { ssr: false });


// import Styles from "../styles/WorkerCard.module.css";
// import Styles from "../styles/PanelWorkerCard.module.css";
import Styles from "../styles/panel/PanelWorkerCard.module.css";

export default function ImgMediaCard(props) {
  const worker = props.worker;
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState("pics");
  const [loading, set_loading] = React.useState(false);
  const [images, set_images] = React.useState([]);
  const [videos, set_videos] = React.useState([]);
  const [details, set_details] = React.useState();
  const [properties, set_properties] = React.useState([]);
  const [modal_worker, set_modal_worker] = React.useState();


  const onPopstateFuction = () => {
    history.pushState(null, "/panel", router.asPath);
    setOpen(false);
  };

  useEffect(() => {
    // set_properties( JSON.stringify(worker.json_properties[0]));
    set_properties(JSON.parse(worker.json_properties));
  }, [worker.json_properties]);

  useEffect(() => {
    if (open) {
      history.pushState(null, "/panel", router.asPath); 
      window.addEventListener("popstate", onPopstateFuction);
    }
    return () => {
      window.removeEventListener("popstate", onPopstateFuction);
    };
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    set_modal_worker();
  };


  const imageorspinner = () => {
    if (loading) {
      return (
        <div className="spinnerImageView" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180 }}>
          <img src="/logo/ajour-gif.gif" alt="ajour logo" style={{ height: 180, width: 'auto', objectFit: 'contain' }} />
        </div>
      );
    } else {
      return <ImageSlider images={images} />;
    }
  };

  const renderNeighborHoodRibbon = () => {
    if (worker.neighbourhood) {
      return(
        <div className={Styles["card-inside-bottom"]}>
            <p style={{ fontSize: 13, color: "#222", display: "flex" }}>{worker.neighbourhood}</p>
        </div>
       
      )
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
        
        <p style={{direction:'rtl' }}>
          <strong style={{fontSize:'17px'}}>
          {" "}
          {String(price_no_format).replace(/(.)(?=(\d{3})+$)/g, "$1,")}{" "}
          {"تومان"}{" | "}
          </strong>

          {' متری '}
          {String(price_per_m2).replace(/(.)(?=(\d{3})+$)/g, "$1,")}{" "}
          {"تومان"}{" "}
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
              <strong style={{fontSize:'16px'}}>
              {" "}
              {String(rent_per_mounth_no_format).replace(
                /(.)(?=(\d{3})+$)/g,
                "$1,"
              )}{" "}
              {" اجاره "}{" "}
              </strong>
            </p>
          ) : (
            <p style={{ direction: "rtl", paddingRight: 4 }}> {"کامل"} </p>
          )}

          <p style={{ direction: "rtl" }}>
          <strong style={{fontSize:'16px'}}>
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

  const renderPropertiesCustomized = (pr) => {

    if(pr.name == "قیمت") return;
    if(pr.name == "پول پیش") return;
    if(pr.name == "اجاره ماهیانه") return;

    if(pr.name == "قیمت هر متر") return;


    


    

    // var norama = properties.filter((item) => item.name == "قیمت");
    if(pr.kind == 1){
      return(
        <>
        
        <span>&nbsp; </span>
        <p>
            |   {pr.name}   {String(pr.value).replace(/(.)(?=(\d{3})+$)/g, "$1,")}
            </p>
            {'.'}
            </>
      )
    }
  }

  const rednerProperties = () => {
    if (1) {
      return properties.map((pr) => (
        <>
          {pr.special == "1" && (
            renderPropertiesCustomized(pr)
          )}
        </>
      ));
    }
  };

  const renderWorkerStatus = () => {
    if (worker.status == 1) { 
      return (
        <p style={{ background: "green", padding: 5,margin:10, textAlign: "center" }}>
          فایل تایید شده
        </p>
      );
    } else if (worker.status == 2) {
      return (
        <p style={{ background: "gray", padding: 5,margin:10, textAlign: "center" }}>فایل در دست بررسی است</p>
      );
    }
  };

  const renderLocation = () => {
    return <LocationNoSsr details={details} />;
  };

  const renderVideos = () => {
    return <VideoSlider videos={videos} />;
  };

  const rednerModalContents = () => {
    if (loading) {
      return <SpinnerModalLoader />;
    }

    return (
      <div>
        <AppBar
          position="sticky"
          color="primary"
          sx={{ top:-20, bottom: "auto" }}
        >
          <Toolbar>
          <div className={Styles["modal-header-wrapper"]}>
          
          <div>
          {renderWorkerStatus()}
          
          </div>
            
         <div>
         {/* <WorkerPanelActions worker={worker} /> */}
         </div>
           
          
          </div>
          </Toolbar>
        </AppBar>
        

        <Grid container spacing={1}>
          <Grid item xs={12} md={5} lg={5}>
            <div className={Styles["image-slider-wrapper"]}>
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className={Styles["media-tabs"]}
              >
                {images.length > 0 ? (
                  <Tab
                    eventKey="pics"
                    title={<p>تصاویر</p>}
                    className={Styles["media-tab"]}
                  >
                    {imageorspinner()}
                  </Tab>
                ) : null}

                {videos.length > 0 ? (
                  <Tab
                    eventKey="videos"
                    title={<p>ویدیو</p>}
                    className={Styles["media-tab"]}
                  >
                    {renderVideos()}
                  </Tab>
                ) : null}
              </Tabs>
            </div>

            <WorkerShare details={details} slug={worker.slug} />

            
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            lg={7}
            style={{ textAlign: "center", paddingTop: 50 }}
          >
            <div className={Styles["worker-single-details"]}>
              <WorkerPanelDetails details={details} properties={properties} />
            </div>
            
          </Grid>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
        {renderLocation()}
        </Grid>
      </div>
    );
  };

  const fetchworker = (worker) => {
    console.log("try to fetch worker with the id of " + worker.id);
    axios({
      method: "get",
      url: `https://api.ajur.app/api/posts/${worker.id}`,
    }).then(function (response) {
      set_details(response.data.details);
      set_images(response.data.images);
      set_videos(response.data.videos);
      set_properties(response.data.properties);
      set_loading(false);
    });
  };


  const onClickCard = (worker) => {

    
    console.log("on click card , expect to open the modal");
    set_modal_worker(worker);
    console.log("the modal passed to worker is :-----------------");
    console.log(worker);
    setOpen(true);
    set_loading(true);
    fetchworker(worker);
  };

  const renderModal = () => {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <Box sx={style} className={Styles['modal_wrapper']}> */}
        <Box sx={Styles["modal_wrapper"]} className={Styles["modal_wrapper"]}>
          {/* {renderModalContent()} */}

          {rednerModalContents()}

          
        </Box>
      </Modal>
    );
  };

 
  const renderVideoOrImageIcon = () => {

    return(

      <>
      
       { worker.video_count > 0 &&
        <div className={Styles["card-top-icon-wrapper"]}>
          <CameraIndoorIcon />
        </div>
       }

       {worker.image_count > 0 &&
        <div className={Styles["card-top-icon-wrapper"]}>
        {worker.image_count} <CollectionsIcon />
        </div>
       }

        </>
        
    )



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

  const renderAddress = () => {

    if(worker.formatted){
      return (
        // <div> {short(worker.neighbourhood ,40)}   </div>
        <div style={{direction:'rtl'}}> {short(worker.formatted, 40)} </div>
      );

    }
    else if (worker.neighbourhood) {
      return (
        // <div> {short(worker.neighbourhood ,40)}   </div>
        <p > {short(worker.neighbourhood, 40)} </p>
      );
    } else if (worker.region) {
      return <div> {short(worker.region, 40)} </div>;
    }
  };

  const renderWorkercategory = () => {
    if(worker.category_name){
      return(<p style={{fontSize:16}}> {worker.category_name} </p>)
    }
    
  }
  return (
    <>
    <Card
      sx={{ maxHeight: 260, height: 260 }}
      className={Styles["card-wrapper"]}
      onClick={() => onClickCard(worker)}
    >
      {renderNeighborHoodRibbon()}
      <CardMedia
        component="img"
        alt="green iguana"
        height="180"
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
        <div className={Styles["properties-wrapper"]}>
         
          {rednerProperties()}
        </div>
        {/* <div className={Styles["specials-wrapper"]}>
          <div className={Styles["worker-card-row-special"]}>
            <div className={Styles["special-left"]}>
              {worker.specialvalue1}{" "}
            </div>
            <div className={Styles["special-right"]}>{worker.specialname1}</div>
          </div>
          <div className={Styles["worker-card-row-special"]}>
            <div className={Styles["special-left"]}>{worker.specialvalue2}</div>
            <div className={Styles["special-right"]}>{worker.specialname2}</div>
          </div>
        </div> */}

        {/* <div className={Styles["worker-address"]}>
          {" "}
          {renderAddress()} {renderWorkercategory()}{" "}
        </div> */}
      </CardContent>
    </Card>

    <Card>{renderModal()}</Card>
    </>
  );
}
