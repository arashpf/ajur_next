import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal';
import VideoSlider from '../sliders/VideoSlider'
import ReactPlayer from 'react-player-pfy'

import Slider from "react-slick";

import Styles from  "../styles/WorkerInMapTabs.module.css";

var sliderImages = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,

};

var sliderImagesModal = {
  dots: true,
  infinite: false,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
}


function WorkerInMapTabs(props) {
  const [key, setKey] = useState('pics');
  const [image_show, set_image_show] = useState(false);
  const [image_full_screen, set_image_full_sreen] = useState(true);
  const worker = props.worker;
  const details = props.details;
  const images = details.images;
  const videos = details.videos;
  console.log('the image in WorkerInMapTabs --090-9-09-09-09-09');
  console.log(images);
  const renderPics = () => {
    if(images){
      return images.map(img =>

        <img key={img.id} onClick={()=>onClickImage(img)}
          className={Styles['worker-in-map-image']}
           src={img.url} />

        );
    }else{
      return(
        <div>
        <p>no picture</p>
        </div>
      )

    }
  }


  const renderVideos = () => {
    if(videos){
      return videos.map(video =>

        <ReactPlayer
             controls
             playing

            muted
            url={[
            video.api_path  ?  video.api_path : video.absolute_path ,
              video.absolute_path,
            ]}
            width = '100%'

            playIcon={<div className={Styles['play-button-wrapper']}><i className="fa fa-play fa-2x"></i> </div>}
            light='/logo/ajour-meta-image.jpg'




          />

        );
    }else{
      return(
        <div>
        <p>no video</p>
        </div>
      )

    }
  }






  const onClickImage = (img) => {
    console.log('the img is:');
    set_image_show(true);
    set_image_full_sreen(true);
    console.log(img);
  }

  const renderBigImages = () => {

    if(images){
      return images.map(img =>
          <img key={img.id}  className={Styles['worker-in-map-fullscreen-image']} src={img.url} />
        );
    }else{
      return(
        <div>
        <p>no picture</p>
        </div>
      )

    }

  }

  const ImageModal = (img) => {
    return(
      <Modal show={image_show} fullscreen={image_full_screen} onHide={() => set_image_show(false)}>
       <Modal.Header closeButton>

       </Modal.Header>
       <Modal.Body className={Styles['modal_body']}>
         <div className={Styles['modal_content']}>

       <Slider {...sliderImagesModal}>

       {renderBigImages()}

       </Slider>
        </div>

       </Modal.Body>
     </Modal>
    )
  }

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="pics" title="تصاویر">
      <Slider {...sliderImages}>


        {renderPics()}

      </Slider>
      {ImageModal()}

      </Tab>
      <Tab eventKey="videos" title="ویدیو">

        <Slider {...sliderImages}>


          {renderVideos()}

        </Slider>

      </Tab>
      <Tab eventKey="360" title="360" >

      </Tab>
    </Tabs>
  );
}

export default WorkerInMapTabs;
