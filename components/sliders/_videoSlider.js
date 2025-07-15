import React, { Component } from "react";
import Slider from "react-slick";
import "font-awesome/css/font-awesome.min.css";
import Styles from "../styles/ImageSlider.module.css";
import Image from "next/image";
import { Navigation, EffectFade, Pagination, Scrollbar, A11y } from "swiper";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import ReactPlayer from "react-player-pfy";

import { Player, ControlBar, BigPlayButton } from "video-react";
import "video-react/dist/video-react.css"; // import css
// import "node_modules/video-react/dist/video-react.css";

// Import Swiper styles

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function ImageSlider(props) {
  const videos = props.videos;

  const renderImages = () => {
    if (true) {
      return videos.map((img) => (
        <SwiperSlide key={img.url}>


        
         <Player  src={img.absolute_path}>
            <ControlBar autoHide={false} className="my-class" />
            <BigPlayButton position="center" />
           </Player> 
         
          {/* <Player
            // playsInline
           
            poster="/logo/ajour-meta-image.jpg"
            // src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
            src={img.absolute_path}
            preload="metadata"
          >
            <BigPlayButton position="center" />

          

          {/* <ReactPlayer
               controls
               playing

              muted
              url={[
              img.api_path  ?  img.api_path : img.absolute_path ,
                img.absolute_path,
              ]}
              width = '100%'

              playIcon={<div className={Styles['play-button-wrapper']}><i className="fa fa-play fa-2x"></i> </div>}
              light='/logo/ajour-meta-image.jpg'




            /> */}
        </SwiperSlide>
      ));
    } else {
    }
  };

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
      effect="fade"
      spaceBetween={5}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {renderImages()}
    </Swiper>
  );
}

export default ImageSlider;
