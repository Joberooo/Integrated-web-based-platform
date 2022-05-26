import React, {useEffect, useRef, useState} from 'react';
import './Map.css';

interface Drone {
  id: number;
  latitude: number;
  longitude: number;
  swarmId: number;
}

interface Enemy{
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  icon?: string;
}

interface MyMarker {
  marker: google.maps.Marker,
  id: number,
  swarmId?: number,
  toDelete: boolean
}

interface OrderMarker {
  id: number,
  latitude: number;
  longitude: number;
  swarmId: number;
}

interface IMap{
  mapType: google.maps.MapTypeId,
  mapTypeControl?: boolean;
  dronesArray: Drone[];
  markerClickFunction: any;
  mapClickFunction: any;
  mapMoveCursorFunction: any;
  enemyClickFunction: any;
  enemiesArray: Enemy[];
  orderMarkersArray: OrderMarker[];
}

interface myLatLng{
  lat: number,
  lng: number
}

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;

const Map: React.FC<IMap> = ({mapType, mapTypeControl = false, dronesArray, enemiesArray, orderMarkersArray, markerClickFunction, mapClickFunction, mapMoveCursorFunction, enemyClickFunction}) => {
  const [markers, setMarkers] = useState<MyMarker[]>([]);
  const [enemyMarkers, setEnemyMarkers] = useState<MyMarker[]>([]);
  const [orderMarkers, setOrderMarkers] = useState<MyMarker[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();


  useEffect( () => {
    if(dronesArray.length === 0 && markers.length !== 0){
      markers.forEach(item => {
        item.marker.setMap(null);
      })
      setMarkers([]);
    }
    dronesArray.forEach(drone => {
      if(markers.find(item => item.id === drone.id)){
        markers.find(item => item.id === drone.id)?.marker.setPosition(new google.maps.LatLng(drone.latitude, drone.longitude));
        if(map) markers.find(item => item.id === drone.id)?.marker.setMap(map);
      }
      else{
        var newMarker: MyMarker = {id: drone.id, toDelete: false, marker: new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(drone.latitude, drone.longitude),
          title: "Drone #" + drone.id.toString() + ", Swarm #" + drone.swarmId.toString(),
          icon: {url: require("./natoSymbols/friendly-drone.png"), scaledSize: new google.maps.Size(64, 32), labelOrigin: new google.maps.Point(drone.latitude - 16, drone.longitude - 32)},
          label: {text: "Drone #" + drone.id.toString(), fontSize: "20px", fontWeight: "500"},
        })}
        newMarker.marker.addListener("click", () => {markerClickFunction(drone.id, drone.swarmId);});
        markers.push(newMarker);
      }
    });
    if(enemiesArray.length === 0 && enemyMarkers.length !== 0){
      enemyMarkers.forEach(item => {
        item.marker.setMap(null);
      })
      setEnemyMarkers([]);
    }
    enemiesArray.forEach(enemy => {
      if(enemyMarkers.find(item => item.id === enemy.id)){
        enemyMarkers.find(item => item.id === enemy.id)?.marker.setPosition(new google.maps.LatLng(enemy.latitude, enemy.longitude))
        if(map) enemyMarkers.find(item => item.id === enemy.id)?.marker.setMap(map);
      }
      else{
        var enemyMarker: MyMarker;
        if(enemy.icon !== undefined){
          enemyMarker = {id: enemy.id, toDelete: false, marker: new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(enemy.latitude, enemy.longitude),
            title: enemy.name + " #" + enemy.id,
            icon: {url: require("./natoSymbols/" + enemy.icon + ".png"), scaledSize: new google.maps.Size(32, 32), labelOrigin: new google.maps.Point(enemy.latitude - 16, enemy.longitude - 32)},
            label: {text: enemy.name + " #" + enemy.id, fontSize: "20px", fontWeight: "500"}
          })}
        }
        else{
          enemyMarker = {id: enemy.id, toDelete: false, marker: new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(enemy.latitude, enemy.longitude),
            title: enemy.name + " #" + enemy.id,
            label: {text: enemy.name + " #" + enemy.id, fontSize: "20px", fontWeight: "500"},
          })}
        }
        enemyMarker.marker.addListener("click", () => enemyClickFunction(enemyMarker.id))
        enemyMarkers.push(enemyMarker);
      }
    });
    if(orderMarkersArray.length < orderMarkers.length){
      orderMarkers.forEach(item => {
        item.toDelete = true;
      })
      orderMarkersArray.forEach(order => {
        for(const item of orderMarkers){
          if(item.id === order.id && item.swarmId === order.swarmId){
            item.toDelete = item.toDelete && false;
            break;
          }
          else item.toDelete = item.toDelete && true
        }
      })
      var timeOrderMarkers: MyMarker[] = orderMarkers;
      orderMarkers.forEach(item => {
        if(item.toDelete){
          orderMarkers.find(x => x.id === item.id && x.swarmId === item.swarmId)?.marker.setMap(null)
          timeOrderMarkers = timeOrderMarkers.filter(x => x.id === item.id && x.swarmId === item.id);
        }
      })
      setOrderMarkers(timeOrderMarkers);
    }
    orderMarkersArray.forEach(order => {
      if(orderMarkers.find(item => item.id === order.id && item.swarmId === order.swarmId)){
        orderMarkers.find(item => item.id === order.id && item.swarmId === order.swarmId)?.marker.setPosition(new google.maps.LatLng(order.latitude, order.longitude));
        if(map) orderMarkers.find(item => item.id === order.id && item.swarmId === order.swarmId)?.marker.setMap(map);
      }
      else{
        var newMarker: MyMarker = {id: order.id, swarmId: order.swarmId, toDelete: false, marker: new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(order.latitude, order.longitude),
          label: {text: order.swarmId.toString() + "-" + order.id.toString(), fontSize: "20px", fontWeight: "500"},
          icon: {url: require("./natoSymbols/map-point.png"), scaledSize: new google.maps.Size(48, 48), labelOrigin: new google.maps.Point(order.latitude - 30, order.longitude - 30)}
        })}
        orderMarkers.push(newMarker);
      }
    });
  }, [dronesArray, orderMarkersArray, enemiesArray]);

  const startMap = ():void => {
    if (!map){
      defaultMapStart();
    }
  }
  useEffect(startMap, [map]);

  const defaultMapStart = ():void => {
    var defaultAddress;
    if(dronesArray[0]) defaultAddress = new google.maps.LatLng(dronesArray[0].latitude, dronesArray[0].longitude);
    else defaultAddress = new google.maps.LatLng(52.237049, 21.017532);
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
