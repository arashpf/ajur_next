import React, { useRef,useState, useEffect,Component } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup,Circle } from "react-leaflet";
import dynamic from "next/dynamic";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";


import Styles from '../../components/styles/Location.module.css';

const InteractiveMap = (props) => {

    // const lat = props.details.lat;
    // const long = props.details.long;
    console.log('the details in location.js is :');

    useEffect(()=>{


        import("leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css");
        import("leaflet-defaulticon-compatibility");
        import("leaflet/dist/leaflet.css");
        import("leaflet-control-geocoder/dist/Control.Geocoder.css");
        import("leaflet-control-geocoder/dist/Control.Geocoder.js");
},[])

  const position = [52.1112, 32.1112]
  return (
    <div className={Styles['location-wrapper']}>
    <MapContainer className={Styles['location']} center={position} zoom={15} 
      style={{height:'400px',width:'100%'}}
    >
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      
    </Marker>
  </MapContainer>
    </div>

  )
}

export default InteractiveMap

