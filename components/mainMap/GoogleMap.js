// components/GoogleMap.js
import { Wrapper, Status } from "@googlemaps/react-wrapper"
import { createCustomEqual } from "fast-equals"
import { isLatLngLiteral } from "@googlemaps/typescript-guards"
import { useEffect, useRef, useState } from "react"

const render = (status) => {
  if (status === Status.LOADING) return <div>Loading...</div>
  if (status === Status.FAILURE) return <div>Error loading map</div>
  return null
}

export default function GoogleMapComponent({
  center,
  zoom,
  style
}) {
  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} render={render}>
      <MyMapComponent center={center} zoom={zoom} style={style} />
    </Wrapper>
  )
}

function MyMapComponent({ center, zoom, style }) {
  const ref = useRef()
  const [map, setMap] = useState()

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { center, zoom }))
    }
  }, [ref, map, center, zoom])

  return <div ref={ref} style={style} />
}