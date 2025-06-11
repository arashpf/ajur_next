import React, { useState, useEffect} from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import SearchDiv from '../../components/others/SearchDiv'
import WorkerCard from '../../components/cards/WorkerCard';
import CatCard from '../../components/cards/CatCard';
import FileRequest from "../../components/request/FileRequest";
import PropTypes from 'prop-types';
import Slider from "react-slick";
import axios from 'axios';
import Link from 'next/link';

import Cookies from 'js-cookie';
import { useRouter } from 'next/router';


import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';
// import "./styles.css";
// import required modules


 function Search({ data }) {

  const router = useRouter();
  const [loading, set_loading] = useState(true);
  const [cats, set_cats] = useState();
  const [main_cats, set_main_cats] = useState();
  const [realestates, set_realestates] = useState();
  const [title1, set_title1] = useState();
  const [title2, set_title2] = useState();
  const [title3, set_title3] = useState();
  const [collection1, set_collection1] = useState();
  const [collection2, set_collection2] = useState();
  const [collection3, set_collection3] = useState();
  const [the_city, set_the_city] = useState();
  const [the_neighborhoods, set_the_neighborhoods] = useState();

    useEffect(() => {
      if(data){
        set_loading(false)
      }
      },[])

      useEffect(() => {
    
        //  Cookies.set('selected_city','');
       
     var selected_city = Cookies.get('selected_city'); 

     if(!selected_city){
      //  router.push("/city-selection");
      Cookies.set('selected_city','رباط کریم');
      selected_city = 'رباط کریم';
      Cookies.set('selected_city_lat', '35.47229675', { expires: 365 });
    Cookies.set('selected_city_lng', '51.08457936', { expires: 365 });
     }

      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/base',
        params: {
          city: selected_city,
        },
      }).then(function (response) {

        set_cats(response.data.cats);
        set_the_city(response.data.the_city);
        set_the_neighborhoods(response.data.the_neighborhoods);

        set_main_cats(response.data.main_cats);

        set_realestates(response.data.realstates);

        set_title1(response.data.title1);

        set_title2(response.data.title2);

        set_title3(response.data.title3);

        set_collection1(response.data.collection1);
        set_collection2(response.data.collection2);
        set_collection3(response.data.collection3);
       
        set_loading(false);
      });

      },[])




      function AlterLoading(){
        console.log('loading is fired ~~~~~');
        set_loading(!loading);
      }






 



 

const renderOrSpinner = () => {

     if(loading){
       return(


            <div className='spinnerImageView'>

           <img className='spinner-image'  src='/logo/ajour-gif.gif' alt="ajour logo"/>

           </div>


       )
     }else{
       return(
         <div>
         <main className={styles['main']} >
         <div className={styles['main-row']} >

         <SearchDiv loading={AlterLoading}   the_city={the_city} the_neighborhoods={the_neighborhoods}/>
         <FileRequest />

         </div>
         </main>

         </div>
       )
     }
   }
  return (
    <div className={styles.container}>
      <Head>
       <meta charset="UTF-8" />
       <meta name="robots" content="max-image-preview:large" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
       <title> Ajour| مشاور املاک هوشمند آجر </title>
       <meta name="description" content="مشاور املاک هوشمند آجر مشاور املاکی به وسعت ایران با صدها مشاور مسلط به منطقه" />
       <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
       <meta property="og:locale" content="fa_IR" />
       <meta property="og:type" content="website" />
       <meta property="og:locale" content="fa_IR" />
       <meta property="og:type" content="website" />
       <meta property="og:title" content="Ajour| مشاور املاک هوشمند آجر " />
       <meta property="og:description" content="از خرید و فروش خانه و ویلا تا مشاوره برای سرمایه گزاری در مشاور املاک هوشمند آجر" />
       <meta property="og:url" content="https://ajur.app" />
       <meta property="og:site_name" content="مشاور املاک هوشمند آجر" />
       <meta property="article:published_time" content="2020-05-19T21:34:43+00:00" />
       <meta property="article:modified_time" content="2022-01-28T03:47:57+00:00" />
       <meta property="og:image" content="https://ajur.app/logo/ajour-meta-image.jpg" />
       <meta property="og:image:width" content="1080" />
       <meta property="og:image:height" content="702" />
       <meta name="twitter:card" content="summary_large_image" />
       <meta name="twitter:label1" content="Written by" />
       <meta name="twitter:data1" content="آرش پیمانی فر" />
       <link rel="icon" href="/favicon.ico" />
       <link rel="canonical" href="https://ajur.app" />
      </Head>

      <main className={styles.main}>
        {renderOrSpinner()}

      </main>


    </div>
  )
}


// This gets called on every request






export default Search;
