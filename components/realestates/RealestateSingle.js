import React, { useState , useEffect } from "react"
import PropTypes from 'prop-types'
import { useParams } from "react-router-dom"
import Styles from '../styles/RealstateSingle.css';
import Header from '../parts/Header'
import Footer from '../parts/Footer'
import axios from 'axios'
import Slider from "react-slick"
import CatCard2 from '../cards/CatCard2'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { Link } from "react-router-dom"
import WorkerCard from '../cards/WorkerCard'
import WorkerRealstate from '../cards/realestate/WorkerRealstate';
import RealstateSkeleton from '../skeleton/RealstateSkeleton';
var Spinner = require('react-spinkit');

const RealestateSingle = (props) => {
  let { realestateId,realestateName } = useParams();
  const [loading, set_loading] = useState(true);
  const [workers, set_workers] = useState([]);
  const [realstate, set_realstate] = useState('');
  const [cats, set_cats] = useState([]);
  const [selectedcat, set_selectedcat] = useState(14);
  const [have_workers, set_have_workers] = useState(null);
  const[ lat , set_lat ] = useState(35.80251019486825);
  const[ long , set_long ] = useState(51.45487293982643);
  var sliderCats = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 10,
    slidesToScroll: 2,
    responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 8,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 6,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
  };

  /* fetch single worker data and Images */

  useEffect(() => {
      {fetchWorker()}
  },[]);

  const fetchWorker = () => {
    axios({
          method:'get',
          url:'https://api.ajur.app/api/realstate-front-workers',
          params: {
            title: 'title',
            lat : lat,
            long : long,
            selectedcat : selectedcat,
            realstate_id: realestateId,
            collect: 'all'
           },
    })
  .then(function (response) {

     console.log('the response data in RealstateSingle is ');
     console.log(response.data);
     set_realstate(response.data.realstate)
     set_workers(response.data.workers)
     set_cats(response.data.subcategories)
     set_loading(false)

     if(response.data.workers.length > 0){
         set_have_workers(true)
     }else{
       set_have_workers(false)
     }


  })
  }

  const renderRealstate = () => {
    if(realstate.id){
      return(

        <WorkerRealstate realstate={realstate}/>

      )
    }else{
      return(
        <RealstateSkeleton />
      )
    }
  }

  const handleParentClick = (cat) => {
  console.log('this is parent log triggered from child in RealstateSingle');
   console.log(cat.name);
   console.log(cat.id);
   set_selectedcat(cat.id);
   fetchWorker();
  }

  const renderWorkers = () => {
    if(workers.length > 0 ){
      return workers.map(worker =>
        <Grid item md={4} xs={12} key={worker.id}>
          <Link
                to={`/workers/${worker.id}/${worker.slug}`}
                key={worker.id}
              >
          <WorkerCard key={worker.id} worker={worker}/>
          </Link>
        </Grid>

      )
    }else{
      return(
        <Grid item md={12} xs={12}>
          <p>متاسفانه موردی یافت نشد</p>
        </Grid>
      )

    }

  }


  const renderSliderCategories =() => {
    return cats.map(cat =>

        <CatCard2  key={cat.id} selectedcat={selectedcat} cat={cat} handleParentClick={handleParentClick}/>
     );
   }

  const renderOrSpinner = () => {
    if(!loading){
      return(
        <div>
        <Header />
        <div className="realstate-items-wrapper">
          <div>
            {renderRealstate()}
          </div>
            <div>
              <Slider {...sliderCats}>
                {renderSliderCategories()}
              </Slider>
            </div>

            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {renderWorkers()}
              </Grid>
            </Box>
        </div>
        <Footer />
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

export default RealestateSingle
