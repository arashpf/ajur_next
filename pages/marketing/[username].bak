import React, { useState , useEffect } from "react"
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Styles from '../../components/styles/RealstateSingle.module.css'
import axios from 'axios'
import Slider from "react-slick"
import CatCard2 from '../../components/cards/CatCard2'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import WorkerCard from '../../components/cards/WorkerCard'

import MarketerCard from '../../components/cards/MarketerCard';
import Hierarchical from '../../components/parts/Hierarchical';
import MarketerProgressCard from '../../components/cards/MarketerProgressCard';
import RealstateSkeleton from '../../components/skeleton/RealstateSkeleton';
import Link from 'next/link';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';
// import "./styles.css";
// import required modules

const MarketerSingle = (props) => {
  const router = useRouter()
  const { slug,username } = router.query

  console.log('the real estate come form the ssr is : --------');

  console.log(props.marketer);




  const [loading, set_loading] = useState(true);
  const [marketers, set_marketers] = useState([]);
  const [marketer, set_marketer] = useState('');
  const [cats, set_cats] = useState([]);
  const [selectedcat, set_selectedcat] = useState(14);
  const [have_workers, set_have_workers] = useState(null);
  const[ lat , set_lat ] = useState(35.80251019486825);
  const[ long , set_long ] = useState(51.45487293982643);


  /* fetch single worker data and Images */

  useEffect(() => {
      // {fetchWorker()}
      if(props.marketer){
        set_loading(false)
      }

      set_marketer(props.marketer)
      set_marketers(props.marketers)
      

  },[]);

  

  const renderMarketer = () => {
    if(marketer.id){
      return(
        
        <MarketerCard marketer={marketer} />
      )
    }else{
      return(
        <RealstateSkeleton />
      )
    }
  }

  const  renderProgressCard = ()=> {
    if(1){
        return(
            <MarketerProgressCard marketer={marketer}/>
        )
    }
  }


  const  renderHierarchical = ()=> {
    if(1){
        return(
            <Hierarchical  marketers={marketers}/>
        )
    }
  }
  


  



  const renderOrSpinner = () => {
    if(!loading){
      return(
        <div>

        <div className={Styles['realstate-items-wrapper']}>
          <div>
            {renderMarketer()}
          </div>
          <div>
          {renderProgressCard()}
          </div>

          <div>
          {renderHierarchical()}
          </div>
          
        </div>

        </div>
      )
    }else{
      return(
        <div className="spinnerImageView">



         <img className="spinner-image" src='/logo/ajour-gif.gif' alt="ajour logo"/>

         </div>
      )
    }
  }
  return (
    <div className="realstate-contents-wrapper">
      {renderOrSpinner()}
    </div>
  )
}



export async function getServerSideProps(context) {

    const { params } = context;
  const username = params.username;
   const res = await fetch(`https://api.ajur.app/api/marketer?username=${username}`);
     const data = await res.json();
  return {
     props:
      {

        marketer:data.marketer,
        
        marketers:data.marketers,
        
        
      }, // will be passed to the page component as props
  }
}









export default MarketerSingle
