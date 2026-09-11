import React, { useState , useEffect } from "react";
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import ImageSlider from '../sliders/ImageSlider';
import WorkerDetails from './WorkerDetails';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Styles from '../styles/WorkerSingle.css';
import Header from '../parts/Header';
import Footer from '../parts/Footer';

import SpinerView from '../spiners/SpinerView';

var Spinner = require('react-spinkit');



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const WorkerSingle = (props) => {
  let params = useParams();
  let { workerSlug , workerId } = useParams();
  const [details, set_details] = useState([]);
  const [images, set_images] = useState([]);
  const [realstate, set_realstate] = useState([]);
  const [relateds, set_relateds] = useState([]);
  const [properties, set_properties] = useState([]);
  const [loading, set_loading] = useState('true');






  useEffect(() => {


      var worker_id = parseInt(workerId);
      var baseurl = "https://api.ajur.app/api/single-worker";
      axios({
              method:'get',
              url: baseurl,
              params: {
                worker_id : worker_id,
              },

            })

      .then(function (response) {

        console.log('the worker details in WorkerSingle is ');
        console.log(response);
        set_details(response.data.details);
        set_images(response.data.images);
        set_properties(response.data.properties);
        set_realstate(response.data.realstate);
        set_relateds(response.data.relateds);
        set_loading('false');
      })
      .catch(function (error) {
        console.log('something is wrong with axios');
        console.log(error);
      });







  },[]);



  const imageorspinner = () => {
    if(loading == 'true'){
      return(
          <SpinerView />
      )
    }else {
      return(

        <ImageSlider images = {images}/>
      )
    }
  }

  return (

      <div className="scroll-div worker-single">
        <Header />
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <div className="image-slider-wrapper">
                  {imageorspinner()}
                </div>


              </Grid>
              <Grid item xs={12} md={7}>
                <div className="image-slider-wrapper worker-single-details">
                <WorkerDetails details={details} properties = {properties}
                  realstate = {realstate}
                />
                </div>
              </Grid>


            </Grid>
          </Box>


      </div>


  )
}

export default WorkerSingle
