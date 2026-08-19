import { message } from 'antd'
import i18next from 'i18next'
import mapboxgl from 'mapbox-gl'
import { useCallback, useRef, useState } from 'react'
import Map, {
  // FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
} from 'react-map-gl'
import Pin from './pin'

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default

const TOKEN =process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function MapContainerForEdit(props) {
  const [marker, setMarker] = useState({
    latitude: props.data?.lat || 24.748303042002888,
    longitude: props.data?.lng || 46.61938961732466,
  })
  const map = useRef()
  function handleChange(NewLocation) {
    geoAddress(NewLocation.latitude, NewLocation.longitude)
  }

  async function geoAddress(lat, lng) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=country,region,place,address&access_token=${TOKEN}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      const features = data.features
      let data1 = props.data
      data1.latitude = lat.toString()
      data1.longitude = lng.toString()

      const countryFeature = features.find((f) => f.place_type.includes('country'))
      const countryCode = countryFeature?.properties?.short_code?.toUpperCase()

      if (countryCode === 'SA') {
        data1.address = features[0].place_name
        props.setLocation({
          latitude: data1.latitude,
          longitude: data1.longitude,
          address: data1.address,
        })
      } else {
        message.error('❌ Location is outside Saudi Arabia')
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const onMarkerDragEnd = useCallback(
    (event) => {
      setMarker({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
      })
      handleChange({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
      })
    }, // eslint-disable-next-line
    []
  )

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '400px', width: '100%' }}>
        <Map
          ref={map}
          language={i18next.language}
          initialViewState={{
            latitude: +props.data.lat || 24.748303042002888,
            longitude: +props.data.lng || 46.61938961732466,
            zoom: 11,
          }}
          style={{ width: '100%', height: '100%' }}
          // mapStyle={theme === 'dark' ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11"}
          mapStyle={'mapbox://styles/mapbox/light-v11'}
          mapboxAccessToken={TOKEN}
        >
          {!props.disabled && <GeolocateControl position="top-left" />}
          {/* <FullscreenControl position="top-left" /> */}
          <NavigationControl position="top-left" />
          <Marker
            longitude={+marker.longitude}
            latitude={+marker.latitude}
            draggable={!props.disabled}
            onDragEnd={onMarkerDragEnd}
          >
            <Pin />
          </Marker>
        </Map>
      </div>
    </div>
  )
}
