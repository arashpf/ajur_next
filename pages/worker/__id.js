import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Head from "next/head";

import ImageSlider from "../../components/sliders/ImageSlider";
import VideoSlider from "../../components/sliders/VideoSlider";
import WorkerCard from "../../components/cards/WorkerCard";
import dynamic from "next/dynamic";
const LocationNoSsr = dynamic(() => import("../../components/map/Location"), {
  ssr: false,
});
import WorkerDetails from "../../components/workers/WorkerDetails";
import WorkerShare from "../../components/workers/WorkerShare";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import axios from "axios";
import Styles from "../../components/styles/WorkerSingle.module.css";
import Image from "next/image";
import ReactPlayer from "react-player";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "@mui/material/Button";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import Cookies from 'js-cookie';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const WorkerSingle = (props) => {
  const [key, setKey] = useState("pics");
  const [loading, set_loading] = useState(true);

  const details = props.details;

  const properties = props.properties;
  const realstate = props.realstate;
  const relateds = props.relateds;
  console.log(
    "------------==-=-=- the detail in single worker is --------------------==-=-"
  );
  console.log(details);

  const images = props.images;
  const videos = props.videos;

  const router = useRouter();
  const { slug, id } = router.query;

  const [isfavorite, set_isfavorite] = useState('off');

  //
  // const [details, set_details] = useState([]);
  // const [images, set_images] = useState([]);
  // const [realstate, set_realstate] = useState([]);
  // const [relateds, set_relateds] = useState([]);
  // const [properties, set_properties] = useState([]);

  const renderSeoHeader = () => {
    return (
      <Head>
        <meta charset="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
        <title>
          {details.name} {" در "} {details.category_name} - {details.region} -{" "}
          {details.city}{" "}
        </title>

        <meta
          itemprop="description"
          content={
            details.description
              ? details.description +
                "|" +
                details.category_name +
                " در " +
                details.city +
                " " +
                details.region
              : details.category_name +
                "-" +
                details.name +
                "-" +
                details.city +
                " " +
                details.region
          }
        />

        <meta
          name="description"
          content={
            details.category_name +
            " در " +
            details.name +
            "-" +
            details.state +
            " " +
            details.region +
            details.city
          }
        />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="product" />

        <meta
          property="og:title"
          content={
            details.category_name + " " + details.region + " " + details.city
          }
        />
        <meta
          property="og:description"
          content={details.name + " - " + details.category_name}
        />
        <meta
          property="og:url"
          content={"https://ajur.app/worker/" + details.id + "?slug=" + slug}
        />
        <meta property="og:site_name" content="مشاور املاک هوشمند آجر" />
        <meta property="article:published_time" content={details.created_at} />
        <meta property="article:modified_time" content={details.updated_at} />
        <meta property="og:image" content={details.thumb} />
        <meta property="og:image:width" content="256" />
        <meta property="og:image:height" content="256" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:label1"
          content={"فایل های املاک " + realstate.name}
        />
        <meta name="twitter:data1" content={realstate.name} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={"https://ajur.app/worker/" + details.id} />
      </Head>
    );
  };




  


  useEffect(() => {

    var faviorited = Cookies.get('favorited');
    

    if(!faviorited){
      return;
    }

    

    const productToBeSaved = details.id;

    // const newProduct = JSON.parse(faviorited);
    const newProduct = JSON.parse(faviorited);
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
     
      set_isfavorite('on');
    }

   
   
   
   



  },[]);


  useEffect(() => {
    let history = Cookies.get("history");

    

    const productToBeSaved = details.id;

    

    // const newProduct = JSON.parse(faviorited);
   
    if (!history) {
      var newProduct = [];
    }else{

     var  newProduct = JSON.parse(history);

    }

    const length = newProduct.length;

    if (length > 10) {
      newProduct = newProduct.slice(length - 10, length);
    }


    const filterProduct = newProduct.filter(function(item) {
      return item !== productToBeSaved
  })
  filterProduct.push( productToBeSaved );

  Cookies.set('history', JSON.stringify(filterProduct));


  }, []);


  const onPressMakeWorkerfavorite = () => {

    var faviorited = Cookies.get('favorited');

    

    const productToBeSaved = details.id;

    
    
    if(faviorited){
     

      var newProduct = JSON.parse(faviorited);
      
    }else{
      var newProduct = [];
    }
   
    // if (!newProduct) {
    //   newProduct = [];
    // }

    const length = newProduct.length;

    if (length > 20) {
      newProduct = newProduct.slice(length - 20, length);
    }


    const filterProduct = newProduct.filter(function(item) {
      return item !== productToBeSaved
  })
  filterProduct.push( productToBeSaved );
    
    
   



    Cookies.set('favorited', JSON.stringify(filterProduct));

    set_isfavorite('on');
  
    
  }

  const onPressMakeWorkerUnfavorite = () => {
    
    
    var faviorited = Cookies.get('favorited');

    

    const productToBeSaved = details.id;


    if(faviorited){
     

      var newProduct = JSON.parse(faviorited);
      
    }else{
      var newProduct = [];
    }

    const length = newProduct.length;

    if (length > 20) {
      newProduct = newProduct.slice(length - 20, length);
    }
   const filterProduct = newProduct.filter(function(item) {
       return item !== productToBeSaved
   })

   Cookies.set('favorited', JSON.stringify(filterProduct));

   set_isfavorite('off');
  }












  // useEffect(() => {
  //
  //
  //     var worker_id = parseInt(id);
  //     var baseurl = "https://api.ajur.app/api/single-worker";
  //     axios({
  //             method:'get',
  //             url: baseurl,
  //             params: {
  //               worker_id : worker_id,
  //             },
  //
  //           })
  //
  //     .then(function (response) {
  //
  //       console.log('the worker details in WorkerSingle is ');
  //       console.log(response);
  //       set_details(response.data.details);
  //       set_images(response.data.images);
  //       set_properties(response.data.properties);
  //       set_realstate(response.data.realstate);
  //       set_relateds(response.data.relateds);
  //       set_loading(false);
  //     })
  //     .catch(function (error) {
  //       console.log('something is wrong with axios');
  //       console.log(error);
  //     });
  //
  // },[]);

  useEffect(() => {
    // {fetchWorker()}
    if (details) {
      set_loading(false);
    }

    if(videos.length > 0){
      setKey('videos');
    }
  }, []);

  const onClickShowMoreRelated = () => {
    console.log("show more please");
    set_loading(true);
  };

  const renderLocation = () => {
    return <LocationNoSsr details={details} />;
  };

  const renderVideos = () => {
    return <VideoSlider videos={videos}   />;
  };

  const renderHeart = () => {
    if(isfavorite == 'on'){
      return(
        <FavoriteIcon style={{color:'#b92a31'}}  onClick={onPressMakeWorkerUnfavorite}/>
      )
    }else if(isfavorite == 'off'){

      return(
        <FavoriteBorderIcon onClick={onPressMakeWorkerfavorite} />
      )

    }
  }

  const imageorspinner = () => {
    if (loading) {
      return (
        <div className={Styles["spinnerImageView"]}>
          <Image
            className={Styles["spinnerImageView"]}
            height={256}
            width={256}
            src="/logo/ajour-gif.gif"
            alt="ajour logo"
          />
        </div>
      );
    } else {
      return <ImageSlider images={images} />;
    }
  };

  // const goToRelatedWorker = (worker) => {
  //   console.log("please go to worker with id");
  //   console.log(worker.id);

  //   router
  //     .replace(`/worker/${worker.id}?slug=${worker.slug}`)
  //     .then(() => router.reload());
  // };

  const goToRelatedWorker = (worker) => {
    window.location.href = `/worker/${worker.id}?slug=${worker.slug}`;
  };

  const renderRelateds = () => {
    return relateds.map((worker) => (
      <Grid item xs={12} md={4}>
        {/* <Link   href={`/worker/${worker.id}?slug=${worker.slug}`} > */}
        <a
          style={{ cursor: "pointer" }}
          onClick={() => goToRelatedWorker(worker)}
        >
          <WorkerCard key={worker.id} worker={worker} />
        </a>
        {/* </Link> */}
      </Grid>
    ));
  };

  return (
    <>
      {loading ? (
        <div className="spinnerImageView">
          <img
            className="spinner-image"
            src="/logo/ajour-gif.gif"
            alt="ajour logo"
          />
        </div>
      ) : (
        <></>
      )}
      {renderSeoHeader()}
      <div className={` ${Styles["scroll-div"]}  ${Styles["worker-single"]} `}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>

          <Grid item xs={12} md={5}>
            

          {renderVideos()}

          {imageorspinner()}
          </Grid>

            {/* <Grid item xs={12} md={5}>
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
                      title={<p style={{ fontSize: 18 }}>تصاویر</p>}
                      className={Styles["media-tab"]}
                    >
                      {imageorspinner()}
                    </Tab>
                  ) : (
                    <></>
                  )}

                  {videos.length > 0 ? (
                    <Tab
                      eventKey="videos"
                      title={<p style={{ fontSize: 18 }}>ویدیو</p>}
                      className={Styles["media-tab"]}
                    >
                      {renderVideos()}
                    </Tab>
                  ) : (
                    <></>
                  )}
                </Tabs>
              </div>
            </Grid> */}
            <Grid item xs={12} md={7}>
            {renderHeart()}
              <div className={Styles["worker-single-details"]}>
                <WorkerDetails
                  is_favorited={isfavorite}
                  details={details}
                  properties={properties}
                  realstate={realstate}
                />
              </div>
            </Grid>
          </Grid>
        </Box>

        <div className={Styles["title"]}>
          <h2>موقعیت روی نقشه</h2>
        </div>

        {renderLocation()}
        <WorkerShare details={details} slug={slug} />
        <div className={Styles["title"]}>
          <h2>
            {" "}
            {"موارد دیگر "} {details.category_name} {"در"}{" "}
            {details.neighbourhood} {details.city}{" "}
          </h2>
        </div>

        <div>
          <Grid container spacing={1}>
            {renderRelateds()}
          </Grid>
        </div>

        <div className={Styles["more-wrapper"]}>
          <Link
            href={`/${details.city}/${details.category_name}?subcat=${details.category_name}&neighbor=${details.neighbourhood}&city=${details.city}`}
          >
            <Button
              onClick={onClickShowMoreRelated}
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<ArrowDropDownIcon />}
            >
              دیدن موارد بیشتر
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

// export const getStaticPaths = async () => {
//    const res = await fetch('https://api.ajur.app/api/posts');
//    const data = await res.json();
//    const posts = data.posts;
//
//    const paths = posts.map((ninja) => {
//      return {
//        params: { id: ninja.id.toString(),slug:ninja.slug.toString()},
//      };
//    });
//
//    return {
//      paths,
//      fallback: false,
//    };
// };

export async function getServerSideProps(context) {
  const { params } = context;
  const id = params.id;
  const res = await fetch(`https://api.ajur.app/api/posts/${id}`);
  const data = await res.json();
  return {
    props: {
      details: data.details,
      images: data.images,
      videos: data.videos,
      properties: data.properties,
      realstate: data.realstate,
      relateds: data.relateds,
    }, // will be passed to the page component as props
  };
}

export default WorkerSingle;
