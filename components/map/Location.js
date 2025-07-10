import React, { useRef,useState, useEffect,Component } from "react";
import { MapContainer, TileLayer, useMap,useMapEvent, Marker, Popup,Circle,LayerGroup,LayersControl } from "react-leaflet";
import dynamic from "next/dynamic";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";


import Styles from '../../components/styles/Location.module.css';

// const usemapClick = () => {
//   const map = useMapEvent('click', () => {
//     map.setView([50.5, 30.5], map.getZoom());
//   })
// }



const Location = (props) => {

    const lat = props.details.lat;
    const long = props.details.long;
    const [drag_status, set_drag_status] = React.useState(false);

    function Test() {

      // const map = useMap();
      // if (location && loc) map.flyTo(location, 15);
    
      // return 0 ? (
      //   <Circle center={location} radius={30} pathOptions={{ color: 'blue' }} />
      // ) : null;
    
      const map = useMapEvent('click', (props) => {
            // map.setView([50.5, 30.5], map.getZoom());
            // alert('clicked so make location reactive'.drag_status);
            // set_drag_status(true);
          })
    }

   

    
    
    console.log('the details in location.js is :');

    useEffect(()=>{


        import("leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css");
        import("leaflet-defaulticon-compatibility");
        import("leaflet/dist/leaflet.css");
        import("leaflet-control-geocoder/dist/Control.Geocoder.css");
        import("leaflet-control-geocoder/dist/Control.Geocoder.js");
},[])

  const position = [lat, long]

  
  return (
    <div className={Styles['location-wrapper']}>
    <MapContainer className={Styles['location']} center={position} zoom={20} 
      dragging = {drag_status}
     
      style={{height:'300px',width:'100%'}}
      
    >
    {/* <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    /> */}

<LayersControl>
          <LayersControl.BaseLayer  name="نقشه ">
            <TileLayer
              attribution="Google Maps"
              url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer checked name="ماهواره">
            <LayerGroup>
              <TileLayer
                attribution="Google Maps Satellite"
                url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
              />
              <TileLayer url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
            </LayerGroup>
          </LayersControl.BaseLayer>
        </LayersControl>
    <Marker position={position}>
      
    </Marker>

    <Test  />
  </MapContainer>
    </div>

  )
}

export default Location
