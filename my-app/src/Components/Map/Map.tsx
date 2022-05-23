import React, {useEffect, useRef, useState} from 'react';
import './Map.css';

interface IMap{
  mapType: google.maps.MapTypeId,
  mapTypeControl?: boolean;
}

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;

const Map: React.FC<IMap> = ({mapType, mapTypeControl = false}) => {

  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();

  const startMap = ():void => {
    if (!map){
      defaultMapStart();
    }
  }
  useEffect(startMap, [map]);

  const defaultMapStart = ():void => {
    const defaultAddress = new google.maps.LatLng(52.237049, 21.017532);
    initMap(10, defaultAddress);
  }

  const initMap = (zoomLevel: number, address: GoogleLatLng): void => {
    if (ref.current) {
      setMap(
        new google.maps.Map(ref.current, {
          zoom: zoomLevel,
          center: address,
          mapTypeControl: mapTypeControl,
          streetViewControl: false,
          zoomControl: true,
          mapTypeId: mapType
        })
      );
    }
  }

  return (
    <div ref={ref} className='map-container'></div>
  )
}

export default Map;
