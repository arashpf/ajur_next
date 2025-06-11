import React, { useState } from "react";
import Styles from "../styles/WorkerMedia.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Link from "next/link";

export default function WorkerMedia({ images = [], virtual_tours = [], videos = [] }) {
  const [activeTab, setActiveTab] = useState("images");

  const renderSlider = (mediaList, type) => {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      pagination={{ 
        clickable: true,
        renderBullet: (index, className) => {
          return `<span class="${className}">${index + 1}</span>`;
        }
      }}
      className={Styles.swiperContainer}
    >
      {mediaList.map((item, index) => (
        <SwiperSlide key={index}>
          <div className={Styles.slideCounter}>
            {index + 1}/{mediaList.length}
          </div>
          {type === "images" && (
            <img src={item.url} alt={`Image ${index}`} className={Styles.mainImage} />
          )}
          {type === "virtual_tours" && (
            <iframe
              src={item.url}
              title={`Virtual Tour ${index}`}
              className={Styles.iframe}
              allowFullScreen
            />
          )}
          {type === "videos" && (
            <video controls className={Styles.video}>
              <source src={item.absolute_path} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const onClickImageThumbs = () => {
  if(1){
    setActiveTab("images");
  }
}

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.mediaContainer}>
        {activeTab === "images" && images.length > 0 && renderSlider(images, "images")}
        {activeTab === "virtual_tours" && virtual_tours.length > 0 && renderSlider(virtual_tours, "virtual_tours")}
        {activeTab === "videos" && videos.length > 0 && renderSlider(videos, "videos")}
      </div>

      <div className={Styles.mediaBoxRow}>
        {images.length > 0 && (
          <div className={Styles.mediaBox} onClick={onClickImageThumbs}>
            <div className={Styles.thumbnailContainer}>
              <img src={images[0]?.url} alt="Preview" className={Styles.thumbnail} />
              <div className={Styles.mediaCounter}> {images.length} {'عکس'} </div>
            </div>
           
          </div>
        )}

        {virtual_tours.length > 0 && (
           
          <div className={Styles.mediaBox} onClick={() => setActiveTab("virtual_tours")}>
            <Link
  href={`/virtual-tour/${virtual_tours[0].worker_id}/`}
  as={`/virtual-tour/${virtual_tours[0].worker_id}/`}
>
            <div className={Styles.thumbnailContainer}>
              <img src={virtual_tours[0]?.thumbnail_url} alt="Preview" className={Styles.thumbnail} />
              <div className={Styles.mediaCounter}> بازدید مجازی</div>
            </div>

            </Link>
           
          </div>
        )}

        {videos.length > 0 && (
          <div className={Styles.mediaBox} onClick={() => setActiveTab("videos")}>
            <div className={Styles.thumbnailContainer}>
               <img src={ images[1]?.url || images[0]?.url} alt="Preview" className={Styles.thumbnail} />
              <div className={Styles.mediaCounterVideo}>
                 <PlayArrowIcon className={Styles.playIcon} />
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}