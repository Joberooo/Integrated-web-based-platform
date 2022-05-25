import React, { useEffect, useState } from 'react';
import './Navigation.css';
import Map from '../Map/Map';
import { laodMapApi } from '../../utils/GoogleMapsUtils';
import Orders from '../Orders/Orders';
import Swarms from '../Swarms/Swarms';

interface Drone {
  id: number;
  latitude: number;
  longitude: number;
}

interface DroneWithSwarmId {
  id: number;
  latitude: number;
  longitude: number;
  swarmId: number;
}

interface Swarm {
  id: number;
  drones: Drone[];
}

interface myLatLng{
  lat: number,
  lng: number
}

interface singleOrder{
  id: number;
  name: string;
  swarmId: number;
}

const Navigation = () => {
  const [displayNumber, setDisplayNumber] = useState<number>(1);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [swarms, setSwarms] = useState<Swarm[]>([]);
  const [drones, setDrones] = useState<DroneWithSwarmId[]>([]);

  const [swarmsId, setSwarmsId] = useState<number>(1);
  const [dronesId, setDronesId] = useState<number>(101);

  const [markerDroneId, setMarkerDroneId] = useState<number>();
  const [markerSwarmId, setMarkerSwarmId] = useState<number>();

  const [clickedLatLng, setClickedLatLng] = useState<myLatLng>();
  const [cursorLatLng, setCursorLatLng] = useState<myLatLng>();

  const [movePoint, setMovePoint] = useState<myLatLng>();
  const [patrolPoints, setPatrolPoints] = useState<myLatLng[]>([]);
  const [targetId, setTargetId] = useState<number>(0);

  const [ordersId, setOrdersId] = useState<number>(1000);
  const [listOfOrders, setListOfOrders] = useState<singleOrder[]>([]);

  const addSwarm = () => {
    let newSwarm: Swarm = {id: swarmsId, drones: []};
    setSwarmsId(swarmsId + 1);
    setSwarms([...swarms, newSwarm]);
  }
  const deleteSwarm = (id: number) => {
    setSwarms(swarms.filter(item => item.id !== id));
  }
  
  const addDroneToSwarm = (swarmId: number, newDrone: Drone) => {
    var timeSwarms = swarms.filter( item => item.id !== swarmId);
    var swarmToChange = swarms.find( item => item.id === swarmId);
    if(swarmToChange){
      var swarmDrones = swarmToChange.drones;
      let newDrone: Drone = {id: dronesId, latitude: 52.237049, longitude: 21.017532}
      swarmToChange.drones = [...swarmDrones, newDrone];
      timeSwarms = [...timeSwarms, swarmToChange];
      setDronesId(dronesId + 1);
      setSwarms(timeSwarms);
    }
  }

  const deleteDroneFromSwarm = (swarmId: number, droneId: number) => {
    var timeSwarms = swarms.filter( item => item.id !== swarmId);
    var swarmToChange = swarms.find( item => item.id === swarmId);
    if(swarmToChange){
      swarmToChange.drones = swarmToChange.drones.filter( item => item.id !== droneId);
      timeSwarms = [...timeSwarms, swarmToChange];
      setSwarms(timeSwarms);
    }
  }

  const dragAndDropDrone = (dropToSwarmId: number, dropFromSwarmId: number, dropDroneId: number) => {
    if(dropToSwarmId !== dropFromSwarmId){
      var timeSwarms = swarms.filter( item => item.id !== dropToSwarmId && item.id !== dropFromSwarmId);
      var swarmToDeleteDrone = swarms.find( item => item.id === dropFromSwarmId);
      var swarmToAddDrone = swarms.find( item => item.id === dropToSwarmId);
      if(swarmToAddDrone && swarmToDeleteDrone){
        var droneToMove = swarmToDeleteDrone.drones.find( item => item.id === dropDroneId);
        if(droneToMove){
          swarmToDeleteDrone.drones = swarmToDeleteDrone.drones.filter( item => item.id !== dropDroneId);
          swarmToAddDrone.drones = [...swarmToAddDrone.drones, droneToMove];
          timeSwarms = [...timeSwarms, swarmToDeleteDrone];
          timeSwarms = [...timeSwarms, swarmToAddDrone];
          setSwarms(timeSwarms);
        }
      }
    }
  }

  const addPoint = () => {
    if (clickedLatLng){
      setMovePoint({lat: clickedLatLng.lat, lng: clickedLatLng.lng})
      if (!patrolPoints.find(element => element.lat === clickedLatLng.lat && element.lng === clickedLatLng.lng)) setPatrolPoints([...patrolPoints, {lat: clickedLatLng.lat, lng: clickedLatLng.lng}]);
    }
  }

  const deletePoint = (lat: number, lng: number) => {
    setPatrolPoints(patrolPoints.filter(item => item.lat !== lat && item.lng !== lng));
  }

  const addOrder = (name: string, swarmId: number) => {
    setOrdersId(ordersId + 1);
    setListOfOrders([...listOfOrders, {id: ordersId, name: name, swarmId: swarmId}])
  }

  const deleteOrder = (id: number) => {
    setListOfOrders(listOfOrders.filter( item => item.id !== id))
  }

  useEffect(() => {
    const googleMapScript = laodMapApi();
    googleMapScript.addEventListener('load', function () {
      setScriptLoaded(true);
    })
  }, [])

  useEffect( () => {
    var timeDrones: DroneWithSwarmId[] = [];
    swarms.forEach(swarm => {
      swarm.drones.forEach(drone => {
        var newDrone: DroneWithSwarmId = {id: drone.id, latitude: drone.latitude, longitude: drone.longitude, swarmId: swarm.id};
        timeDrones = [...timeDrones, newDrone];
      })
    });
    setDrones(timeDrones);
  }, [swarms]);

  const goToMap = () => setDisplayNumber(1);
  const goToSwarms = () => setDisplayNumber(2);

  const markerClick = (droneId: number, swarmId: number) => {
    setMarkerDroneId(droneId);
    setMarkerSwarmId(swarmId);
  }

  const mapClick = (latitude: number, longitude: number) =>{
    setClickedLatLng({lat: latitude, lng: longitude});
  }

  const mapMove = (latitude: number, longitude: number) =>{
    setCursorLatLng({lat: latitude, lng: longitude});
  }

  return (
    <div className="Home">
      {displayNumber === 1 && scriptLoaded && (<Map mapType={google.maps.MapTypeId.TERRAIN} mapTypeControl={true} dronesArray={drones} markerClickFunction={markerClick} mapClickFunction={mapClick} mapMoveCursorFunction={mapMove}/>)}
      {displayNumber === 2 && (<Swarms swarms={swarms} addSwarmFunction={addSwarm} deleteSwarmFunction={deleteSwarm} addDrone={addDroneToSwarm} deleteDrone={deleteDroneFromSwarm} dragAndDrop={dragAndDropDrone} />)}

      <ul className='nav-menu'>
        <li className='nav-option' onClick={goToMap}>Map</li>
        <li className='nav-option' onClick={goToSwarms}>Swarms</li>
      </ul>

      {displayNumber === 1 && (<Orders markedSwarm={markerSwarmId} markedDrone={markerDroneId} clickedLocation={clickedLatLng} cursorLocation={cursorLatLng} movePoint={movePoint} patrolPoints={patrolPoints} targetId={targetId} addPointFunction={addPoint} deletePointFunction={deletePoint} orders={listOfOrders} addOrderFuntion={addOrder} deleteOrder={deleteOrder}/>)}
    </div>
  )
}

export default Navigation;
