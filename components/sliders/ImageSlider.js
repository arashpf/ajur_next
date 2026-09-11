import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "font-awesome/css/font-awesome.min.css";
import Styles from "../styles/ImageSlider.module.css";
import Image from "next/image";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Skeleton from "@mui/material/Skeleton";

// const images = [
//   {
//     original: "https://picsum.photos/id/1018/1000/600/",
//     thumbnail: "https://picsum.photos/id/1018/250/150/",
//   },
//   {
//     original: "https://picsum.photos/id/1015/1000/600/",
//     thumbnail: "https://picsum.photos/id/1015/250/150/",
//   },
//   {
//     original: "https://picsum.photos/id/1019/1000/600/",
//     thumbnail: "https://picsum.photos/id/1019/250/150/",
//   },
//   {
//     original: "https://picsum.photos/id/1019/1000/600/",
//     thumbnail: "https://picsum.photos/id/1019/250/150/",
//   },
//   {
//     original: "https://picsum.photos/id/1019/1000/600/",
//     thumbnail: "https://picsum.photos/id/1019/250/150/",
//   },
//   {
//     original: "https://picsum.photos/id/1019/1000/600/",
//     thumbnail: "https://picsum.photos/id/1019/250/150/",
//   },
// ];

function ImageSlider(props) {
  const images = props.images;
  const [images_array, set_images_array] = useState([]);
  const [loading, set_loading] = useState(false);

  useEffect(() => {
    console.log(
      "the image is gonna change array in the use effect here ------"
    );
  
    images.map((im,index) => 
      {
      
        console.log(im);
        console.log('and index is ');
        console.log(index);
        var imager = {};
        imager.original =im.url;
        imager.thumbnail = im.url;
        
       console.log('the imager is ---------&&&&&&&&&');
       console.log(imager);

       console.log('the image array now is -------------');
      //  set_images_array([...images_array,imager]);
       set_images_array(images_array => images_array.concat(imager));

       console.log(images_array);
      })
    
  
  
   
  }, []);
  return loading ? (
    <Skeleton variant="rectangular" width='100%' height={260} />
  ) : (
    <div className={Styles["image_gallery_wrapper"]}>
    <ImageGallery
    items={images_array} 
    // thumbnailPosition={images.length > 1 ? 'right' : 'bottom'}    
    // showThumbnails={images.length > 1 ? true : false}
    showThumbnails={true}
    infinite={true}
    lazyLoad={true}
    showIndex={images.length > 0 ? true : false}
    />
    </div>
  );
}

export default ImageSlider;

