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
import Cookies from 'js-cookie';


const MarketerSingle = (props) => {
  const router = useRouter()
  // const { slug,username } = router.query
  // const username = 'arashpf';
  var username = Cookies.get('ref');

 

  const [loading, set_loading] = useState(true);
  const [marketers, set_marketers] = useState([]);
  const [marketer, set_marketer] = useState('');
  const [quote, set_quote] = useState('');
  const [cats, set_cats] = useState([]);
  const [selectedcat, set_selectedcat] = useState(14);
  const [have_workers, set_have_workers] = useState(null);
  const[ lat , set_lat ] = useState(35.80251019486825);
  const[ long , set_long ] = useState(51.45487293982643);




  /* fetch single worker data and Images */

  useEffect(() => {
      // {fetchWorker()}
      if(props.marketer && props.quote){
        var guy = props.marketer;
        if(!guy.username){
          router.push("/marketing/edit");
        }

        set_loading(false)
      }

      set_marketer(props.marketer)
      set_marketers(props.marketers)
      set_quote(props.quote)
      


  },[]);

  useEffect(() => {
   
    var token = Cookies.get('id_token');

    axios({
          method:'post',
          url:'https://api.ajur.app/api/marketer',
          params: {
            token: token,
            },

    })
    .then(function (response) {

      if(!response.data.marketer.username){
        router.push("/marketing/edit");

      }else{
        set_marketer(response.data.marketer);
        set_quote(response.data.quote);
        set_marketers(response.data.marketers);
        set_loading(false);
      }

     })
},[]);

  

  const renderMarketer = () => {
    if(marketer.id){
      return(
        <MarketerCard marketer={marketer} quote={quote} />
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













export default MarketerSingle
