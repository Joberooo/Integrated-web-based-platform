import React, {useEffect, useRef, useState} from 'react';
import './Map.css';

interface Drone {
  id: number;
  latitude: number;
  longitude: number;
  swarmId: number;
}

interface MyMarker {
  marker: google.maps.Marker,
  id: number
}

interface IMap{
  mapType: google.maps.MapTypeId,
  mapTypeControl?: boolean;
  dronesArray: Drone[];
  markerClickFunction: any;
  mapClickFunction: any;
  mapMoveCursorFunction: any;
}

interface myLatLng{
  lat: number,
  lng: number
}

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;

const Map: React.FC<IMap> = ({mapType, mapTypeControl = false, dronesArray, markerClickFunction, mapClickFunction, mapMoveCursorFunction}) => {
  const [markers, setMarkers] = useState<MyMarker[]>([]);
  const [time, setTime] = useState<number>(Date.now());
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();

  useEffect( () => {
    setTimeout( () => {
      setTime(Math.floor(Date.now() / 500));
      var timeMarkers: MyMarker[] = [];
      dronesArray.forEach(drone => {
        var newMarker: MyMarker = {id: drone.id, marker: new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(drone.latitude, drone.longitude),
          title: "Drone #" + drone.id.toString() + ", Swarm #" + drone.swarmId.toString(),
          icon: {url: require("./natoSymbols/friendly-drone.png"), scaledSize: new google.maps.Size(64, 32), labelOrigin: new google.maps.Point(drone.latitude - 16, drone.longitude - 32)},
          label: "Drone #" + drone.id.toString()
        })}
        markers.find(element => element.id === drone.id)?.marker.setMap(null);
        newMarker.marker.addListener("click", () => {markerClickFunction(drone.id, drone.swarmId);});
        timeMarkers = [...timeMarkers, newMarker];
      });
      setMarkers(timeMarkers);
    }, 500);
  }, [dronesArray, time]);

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

  map?.addListener("click", (mapsMouseEvent: any) => {
    let obj: myLatLng = JSON.parse(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2));
    mapClickFunction(obj.lat, obj.lng);
  });

  map?.addListener("mousemove", (mapsMouseEvent: any) => {
    let obj: myLatLng = JSON.parse(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2));
    mapMoveCursorFunction(obj.lat, obj.lng);
  })

  return (
    <div ref={ref} className='map-container'>
    </div>
  )
}

export default Map;
