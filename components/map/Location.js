import React, { useRef, useState, useEffect, Component } from "react";
import { MapContainer, TileLayer, useMap, useMapEvent, Marker, Popup, Circle, LayerGroup, LayersControl } from "react-leaflet";
import dynamic from "next/dynamic";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";

import Styles from '../../components/styles/Location.module.css';

// Error Boundary Component
class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Map Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={Styles['map-error']}>
          <div className={Styles['error-message']}>
            <p>مشکلی در نمایش موقعیت مکانی پیش آمده است</p>
            <small>موقعیت جغرافیایی قابل نمایش نیست</small>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Location = (props) => {
  const lat = props.details.lat;
  const long = props.details.long;
  const mapHeight = props.mapHeight || '300px';
  const [drag_status, set_drag_status] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Validate coordinates
  const isValidCoordinates = (lat, long) => {
    return lat && long && 
           !isNaN(parseFloat(lat)) && 
           !isNaN(parseFloat(long)) &&
           Math.abs(lat) <= 90 && 
           Math.abs(long) <= 180;
  };

  function Test() {
    const map = useMapEvent('click', (props) => {
      // Your click handler logic
    });
    return null;
  }

  useEffect(() => {
    // Dynamically import Leaflet CSS
    import("leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css");
    import("leaflet-defaulticon-compatibility");
    import("leaflet/dist/leaflet.css");
    import("leaflet-control-geocoder/dist/Control.Geocoder.css");
    import("leaflet-control-geocoder/dist/Control.Geocoder.js");
  }, []);

  // Check if coordinates are valid
  if (!isValidCoordinates(lat, long)) {
    return (
      <div className={Styles['map-error']}>
        <div className={Styles['error-message']}>
          <p>مشکلی در نمایش موقعیت مکانی پیش آمده است</p>
          <small>موقعیت جغرافیایی معتبر نیست</small>
        </div>
      </div>
    );
  }

  const position = [parseFloat(lat), parseFloat(long)];

  return (
    <div className={Styles['location-wrapper']} style={{ height: mapHeight, width: '100%' }}>
      <MapErrorBoundary>
        <MapContainer 
          className={Styles['location']} 
          center={position} 
          zoom={20} 
          dragging={drag_status}
          style={{height: '100%', width:'100%'}}
          key={`${lat}-${long}`} // Force re-render when coordinates change
        >
          <LayersControl>
            <LayersControl.BaseLayer name="نقشه">
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
          
          <Marker position={position} />
          <Test />
        </MapContainer>
      </MapErrorBoundary>
    </div>
  );
}

export default Location;