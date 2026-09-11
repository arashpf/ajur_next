import React, { useRef,useState, useEffect,Component } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup,Circle } from "react-leaflet";
import dynamic from "next/dynamic";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";


import Styles from '../../components/styles/Location.module.css';

const Location = (props) => {

    const lat = props.details.lat;
    const long = props.details.long;
    console.log('the details in location.js is :');

  const position = [lat, long]
  return (
    <div className={Styles['location-wrapper']}>
    <MapContainer className={Styles['location']} center={position} zoom={13} 
      style={{height:'400px',width:'400px'}}
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

export default Location
