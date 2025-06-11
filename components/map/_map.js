import React, { useRef,useState, useEffect,Component } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup,Circle } from "react-leaflet";
import dynamic from "next/dynamic";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import 'animate.css';
import L from "leaflet";
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Styles from '../../components/styles/CategorySingle.module.css';
import axios from 'axios';
import WorkerInMap from '../../components/workers/WorkerInMap';
import CategoryRightSlider from '../../components/categories/CategoryRightSlider';
const MAP_CENTER = [52.52, 13.405]
const MARKER_POSITION = [52.49913882549316, 13.418318969833383]


function Test({ location, search }) {


  useEffect(()=>{


        import("leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css");
        import("leaflet-defaulticon-compatibility");
        import("leaflet/dist/leaflet.css");
        import("leaflet-control-geocoder/dist/Control.Geocoder.css");
        import("leaflet-control-geocoder/dist/Control.Geocoder.js");
},[])
  console.log('the location in test is');
  // move location a little down the MAP_CENTER








  const map = useMap();
  if (location) map.flyTo(location, 15);

  return location ? (
    <Circle center={location} radius={30} pathOptions={{ color: 'blue' }} />
  ) : null;
}



 function MapNoSsr(props) {
  const [loc, updLoc] = useState();
  const [search, updSearch] = useState();
  const [search_btn_status, set_search_btn_status] = useState('false');
  const [returnedPlaces, set_returnedPlaces] = useState([]);
  const [searchtitle, set_searchtitle] = useState('');
  const [loading, set_loading] = useState(true);
  const [loading2, set_loading2] = useState(false);
  const [workers, set_workers] = useState([]);
  const [details, set_details] = useState([]);
  const [specials, set_specials] = useState([]);
  const [right_silder_status, set_right_silder_status] = useState('true');
  const [user_initial_lat, set_user_initial_lat] = useState(35.7074612);
  const [user_initial_long, set_user_initial_long] = useState(51.3005805);
  const [drawer, set_drawer] = useState(true);
  const mapRef = useRef(null);
  const markerRef = useRef(null);



  const router = useRouter()
  const { name,id } = router.query



  useEffect(() => {

    if (navigator.geolocation) {


    navigator.geolocation.getCurrentPosition(function(position) {

      /* fetch data base on the user current location and category id(or name) */
      var userInitialLat = position.coords.latitude;
      var userInitialLong = position.coords.longitude;

      set_user_initial_lat(userInitialLat);
      set_user_initial_long(userInitialLong);
      var catid = parseInt(id);
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


        set_details(response.data.details);
        set_workers(response.data.workers);
        set_specials(response.data.specials);
        set_loading(false);


      })
      .catch(function (error) {
        console.log('something is wrong with axios');
        console.log(error);
      });


    }, function(error) {

        console.log('no access to navigator gained');
        var catid = parseInt(id);
        var baseurl = 'https://api.ajur.app/api/category-workers';
        axios({
                method:'get',
                url: baseurl,
                params: {
                  catid : catid,
                  lat: user_initial_lat,
                  long: user_initial_long,

                },

              })

        .then(function (response) {

          console.log('response data in single cat :');
          console.log(response.data.details);

          set_details(response.data.details);
          set_workers(response.data.workers);
          set_specials(response.data.specials);
          set_loading(false);


        })
        .catch(function (error) {
          console.log('something is wrong with axios');
          console.log(error);
        });
    });
} else {
    // Fallback for no geolocation
    console.log('no navigator trigered');
}



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
        <button onClick={OnClickSearchButton}
          className={`${Styles['search-btn']} animate__animated animate__bounceIn   `}
          >
          <i className="fa fa-search"></i>
          <a>جستجو منطقه</a>
        </button>
      )
    }else if(search_btn_status == 'true'){
      return(
        <div
            className={Styles['search-wrapper']}
            >
          {renderSearchContent()}
        </div>
      )
    }
  }




  const renderSearchContent = () => {
    if(1){

      return (

        <div   className="animate__animated animate__bounceIn">
          <button className={Styles['search-wrapper-close-btn']}  onClick={onclickCloseSearch}>
            <i className="fa fa-close"></i>
          </button>
          <div>
            <h6></h6>
          <form className={Styles['search-form']}  >
            <input className={Styles['search-input']}
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


              set_loading2(false);

              set_returnedPlaces(response.data.items);





              })

  }

  const fetchLocationWorkers =(lat,long) => {
    set_loading(true);
    console.log('the lat in fetchLocationWorkers is ');
    var catid = parseInt(id);
    var baseurl = 'https://api.ajur.app/api/category-workers';
    axios({
            method:'get',
            url: baseurl,
            params: {
              catid : catid,
              lat: lat,
              long: long,

            },

          })

    .then(function (response) {

      console.log('the response in fetch location worker is');
      console.log(response.data.workers);

      set_workers(response.data.workers);
      // set_specials(response.data.specials);
      set_specials(response.data.specials);
      set_loading(false);


    })
    .catch(function (error) {
      console.log('something is wrong with axios');
      console.log(error);
    });
  }

  const OnCilckSingleLocation = (place) => {

    console.log('the place after clicking single place is');
    console.log(place);
    var lat = place.location.x;
    var long = place.location.y;
    console.log('the long and lat from place is ');
    console.log(lat);

    fetchLocationWorkers(lat,long)



      set_search_btn_status('false');
      set_returnedPlaces([]);
      updSearch(place.title);


    }

  const renderplaces = () => {
  if(loading2 == true){

    return(
      <div className='spinnerImageView'>

     <img className='spinner-image'  src='/logo/ajour-gif.gif' alt="ajour logo"/>

     </div>
    )
  }else{
    return returnedPlaces.map(place =>

      <a key={place.title} className={Styles['single-place']}   href="#" onClick={() => OnCilckSingleLocation(place)} >

          <h6>{place.title} ({ place.region })</h6>

      </a>

);
  }
}



  const showSearchAddresses = () => {

    if(searchtitle.length > 1){
      return(
        <div>
          <ul className={Styles['places-wrapper']}  >
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


    if(loading  === 'not'){
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
         <div className='spinnerImageView'>

        <img className='spinner-image'  src='/logo/ajour-gif.gif' alt="ajour logo"/>

        </div>
       </div>
      )
    }else if (right_silder_status == 'true') {
      return(



          <div className={Styles['right-slider-wrapper']}>

            <button onClick={onclickCloseRightBox}
              className={`'animate__animated animate__bounceIn' ${Styles['right-slider-close-btn']}   `}
              >
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
        <button
          className={Styles['right-slider-open-btn']}

           onClick={onclickOpenRightBox}>
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

  const renderOrSpinner = () => {
    if(loading){
      return(
        <div className="spinnerImageView">



         <img className="spinner-image" src='/logo/ajour-gif.gif' alt="ajour logo"/>

         </div>
      )

    }else{
      return(
        <>
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

                console.log('response data in single cat :');
                console.log(response.data);
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
                  className={Styles['map-popup']}
                     autoPan={false}

                    >
                    <WorkerInMap worker ={worker} details = {details} />
                  </Popup>
                </Marker>
              ))}
          <Test location={loc} search={search} />
        </MapContainer>
        {loc?.lat},{loc?.lng}
        </>
      )
    }
  }




  return (
    <>

     <Head>
     <meta charset="UTF-8" />
     <meta name="robots" content="max-image-preview:large" />
   <title>  {details.name} | مشاور املاک هوشمند آجر </title>
 {/* // TODO: the description need to be fill in the data base for each category for now its just null */}
   <meta name="description" content={" مشاهده فایل های مشاور املاک  روی نقشه آجر به صورت آنلاین با مختصات دقیق و اطالاعات و عکس های انحصاری در دسته بندی " + details.name } />
     <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
     <meta property="og:locale" content="fa_IR" />
   <meta property="og:type" content="website" />
     <meta property="og:locale" content="fa_IR" />
   <meta property="og:title" content={details.name  + " |" + " مشاور املاک هوشمند آجر" } />
 <meta property="og:description"  content={details.description}/>
   <meta property="og:url" content={'https://ajur.app/categories/'+name+'?id='+id} />
     <meta property="og:site_name" content="مشاور املاک هوشمند آجر" />
     <meta property="article:published_time" content={details.created_at} />
   {/* // TODO: the updated_at need to be change on each worker is added to database for now its just remain static as point to its creation at 2021 */}
     <meta property="article:modified_time" content={details.updated_at} />
   <meta property="og:image" content="https://ajur.app/logo/ajour-meta-image.jpg" />
     <meta property="og:image:width" content="1080" />
   <meta property="og:image:height" content="703" />
     <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:label1" content={"فایل های دسته بندی  " + details.name} />
 <meta name="twitter:data1" content={details.name} />
     <link rel="icon" href="/favicon.ico" />
   <link rel="canonical" href={'https://ajur.app/categories/'+name+'?id='+id} />
    </Head>
        {renderOrSpinner()}



    </>
  );
}




export default MapNoSsr
