import React, { useRef,useState, useEffect,Component } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, useMap, Marker, Popup,Circle } from "react-leaflet";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import L from "leaflet";
import userIcon from "../constants";
import Styles from '../styles/CategorySingle.css';
import axios from 'axios';
import 'animate.css';
import Slider from "react-slick";
import Header from '../parts/Header';
import Footer from '../parts/Footer';
import WorkerInMap from '../workers/WorkerInMap';
import CategoryRightSlider from './CategoryRightSlider';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
var Spinner = require('react-spinkit');
const MAP_CENTER = [52.52, 13.405]
const MARKER_POSITION = [52.49913882549316, 13.418318969833383]
function Test({ location, search }) {

  const map = useMap();
  if (location) map.flyTo(location, 15);

  return location ? (
    <Circle center={location} radius={30} pathOptions={{ color: 'blue' }} />
  ) : null;
}

export default function CategorySingle() {
  const [loc, updLoc] = useState();
  const [search, updSearch] = useState();
  const [search_btn_status, set_search_btn_status] = useState('false');
  const [returnedPlaces, set_returnedPlaces] = useState([]);
  const [searchtitle, set_searchtitle] = useState('');
  const [loading, set_loading] = useState('true');
  const [loading2, set_loading2] = useState('false');
  const [workers, set_workers] = useState([]);
  const [specials, set_specials] = useState([]);
  const [right_silder_status, set_right_silder_status] = useState('true');
  const [user_initial_lat, set_user_initial_lat] = useState(35.7074612);
  const [user_initial_long, set_user_initial_long] = useState(51.3005805);
  const [details,set_details] = useState([]);
  const [drawer, set_drawer] = useState(true);
  const mapRef = useRef(null);
  const markerRef = useRef(null);


  let params = useParams();



  useEffect(() => {


    navigator.geolocation.getCurrentPosition(function(position) {


      /* fetch data base on the user current location and category id(or name) */
      var userInitialLat = position.coords.latitude;
      var userInitialLong = position.coords.longitude;

      set_user_initial_lat(userInitialLat);
      set_user_initial_long(userInitialLong);
      var catid = parseInt(params.categoryId);
      var baseurl = 'https://api.ajur.app/api/category-workers';
      axios({
              method:'get',
              url: baseurl,
              params: {
                catid : catid,
                lat: userInitialLat,
                long: userInitialLong,

              },

            })

      .then(function (response) {


        set_workers(response.data.workers);
        set_specials(response.data.specials);
        set_loading('false');


      })
      .catch(function (error) {
        console.log('something is wrong with axios');
        console.log(error);
      });



      /* end of fetching data with axios */


    });
  },[]);

  useEffect(() => {
    const geocoder = L.Control.Geocoder.nominatim();
    if (search)
      geocoder.geocode(search, (results) => {

        var r = results[0];
        if (r) {
          const { lat, lng } = r?.center;
          updLoc({ lat, lng });

        }
      });
  }, [search]);


  const renderSearchBtn = () =>  {
    if(search_btn_status == 'false'){
      return(
        <button onClick={OnClickSearchButton}  className='search-btn animate__animated animate__bounceIn ' >
          <i className="fa fa-search"></i>
          <a>جستجو منطقه</a>
        </button>
      )
    }else if(search_btn_status == 'true'){
      return(
        <div className="search-wrapper animate__animated animate__flipInX">

          {renderSearchContent()}
        </div>
      )
    }
  }




  const renderSearchContent = () => {
    if(1){

      return (

        <div className="animate__animated animate__bounceIn">
          <button className='search-wrapper-close-btn ' onClick={onclickCloseSearch}>
            <i className="fa fa-close"></i>
          </button>
          <div>
            <h6></h6>
          <form className="serach-form">
            <input className="search-input"
              autoFocus
              placeholder="لطفا شهر یا منطقه مورد نظر را جستجو کنید"
              returnKeyLabel = {"search"}

              onChange={handleSearchTitle}


              ></input>






          </form>

          {showSearchAddresses()}
          </div>

        </div>
      )
    }else{

    }
  }

  const onclickCloseSearch = () => {
   set_search_btn_status('false');

  }

  const handleSearchTitle = (event) => {



    var title = event.target.value;
    set_loading2(true);
    set_searchtitle(title);
    set_returnedPlaces([]);



      axios({
                method:'get',

                url:'https://api.neshan.org/v1/search',
                headers: {
                'api-key': 'service.UylIa21mMdoxUKtQ9nnS7b3dE5sJfgKWPpRVoyPV'
              },
                params: {
                  term: title,
                  lat:35,
                  lng:52
                },
              })

            .then(function (response) {


              set_loading2('false');

              set_returnedPlaces(response.data.items);





              })

  }

  const OnCilckSingleLocation = (place) => {


      set_search_btn_status('false');
      set_returnedPlaces([]);
      updSearch(place.title);


    }

  const renderplaces = () => {
  if(loading2 == true){

    return(
      <div className="spinnerView">
       <Spinner className="spinner" name="line-scale-pulse-out-rapid" color="#666"/>
       </div>
    )
  }else{
    return returnedPlaces.map(place =>

      <a key={place.title} className="single-place" href="#" onClick={() => OnCilckSingleLocation(place)} >

          <h6>{place.title} ({ place.region })</h6>

      </a>

);
  }
}



  const showSearchAddresses = () => {

    if(searchtitle.length > 1){
      return(
        <div>
          <ul className="places-wrapper">
          {  renderplaces() }
        </ul>
        </div>

      )
    }

  }

  const OnClickSearchButton = () => {





      set_search_btn_status('true');



  }

  const  onclickCloseRightBox = () => {

      set_right_silder_status('false');

    }

    const  onclickOpenRightBox = () => {

        set_right_silder_status('true');

      }

      const handleParentClick = (item) =>{

       const new_lat = item.lat;
       const new_long = item.long;
       const latlang = [new_lat, new_long];
       updLoc( latlang );
     }


  const renderRightBox = () => {


    if(loading  == 'true'){
      return(

        <div

         style={{
           position: 'absolute',
           width: 300,
           height: '90%',
           top: 60,
           right: 0,


           zIndex: 10000
         }}>
        <div className="spinnerView">

         <Spinner className="spinner" name="line-scale-pulse-out-rapid" color="#666"/>

         </div>
       </div>
      )
    }else if (right_silder_status == 'true') {
      return(



          <div className='right-slider-wrapper'>

            <button onClick={onclickCloseRightBox} className='right-slider-close-btn animate__animated animate__bounceIn' >
              <i className="fa fa-close"></i>
            </button>
            <CategoryRightSlider
              workers={workers}
              drawer = {drawer}

              handleParentClick = {(value) => {

                     handleParentClick(value);
                 }}
            />
          </div>



      )

    }else{
      return(
        <button className='right-slider-open-btn animate__animated animate__bounceIn' onClick={onclickOpenRightBox}>
          <i className="fa fa-bars"></i>
        </button>
      )
    }




  }

  const OnClickFlytoRegion = () => {

    const location = ['32.22222','52.333333'];
    const new_lat = 32.22;
    const new_long = 52.44;
    const latlang =   [new_lat, new_long];
    updLoc( latlang );

  }




  return (
    <>
      <Header />
      {renderSearchBtn()}
      {renderRightBox()}

      <MapContainer
        whenCreated={(map) => {
                   mapRef.current = map
               }}
        center={loc || { lat: user_initial_lat , lng: user_initial_long }}
        zoom={loc ? 14 : 10}
        zoomControl={true}
        style={{ height: "80vh",zIndex:0 }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {workers.map(worker => (
              <Marker
                ref={markerRef}
                key={worker.id}
                position={[worker.lat, worker.long]}
                eventHandlers={{
                  click: (e) => {
                    console.log('marker clicked', e)

                    handleParentClick(worker)

                    /* fetching single worker data */
                    var baseurl = 'https://api.ajur.app/api/single-worker';
                    axios({
                    method:'get',
                    url: baseurl,
                    params: {
                      worker_id: worker.id,
                      lat: user_initial_lat,
                      long: user_initial_long,
                    },

                  })

            .then(function (response) {


              set_details(response.data);
            })
            .catch(function (error) {
              console.log("something wrong in fetching single worker data in map");
              console.log(error);
            });


                    /* end of fetching single worker data */




                  }
                  }}
                >


                <Popup
                   autoPan={false}

                  >
                  <WorkerInMap worker ={worker} details = {details} />
                </Popup>
              </Marker>
            ))}
        <Test location={loc} search={search} />
      </MapContainer>
      {loc?.lat},{loc?.lng}

    <Footer />
    </>
  );
}
