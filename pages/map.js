import React, { Component } from 'react'
import dynamic from "next/dynamic";

const MapNoSsr = dynamic(() => import("../components/map/Map"), { ssr: false });

export default class map extends Component {
  render() {
    return (
        <MapNoSsr name="ویلایی"  id="18" />
      )
  }
}
