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

interface Enemy{
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  icon?: string;
}

interface ActualPatrolPoints{
  swarmId: number;
  actualPatrolPoint: number;
}

interface myLatLng{
  lat: number,
  lng: number
}

interface singleOrder{
  id: number;
  name: string;
  swarmId: number;
  orderType: number;
  movePoint?: myLatLng;
  patrolPoints?: myLatLng[];
  targetId?: number;
}

interface OrderMarker {
  id: number,
  latitude: number;
  longitude: number;
  swarmId: number;
}

const Navigation = () => {
  const [displayNumber, setDisplayNumber] = useState<number>(1);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [swarms, setSwarms] = useState<Swarm[]>([]);
  const [drones, setDrones] = useState<DroneWithSwarmId[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([{id: 10001, latitude: 53.40985605052642, longitude: 23.71170195660522, name: "Unidentified ground object"}, {id: 10002, latitude: 53.56118584498003, longitude: 23.609808907879028, name: "Hostile Anti Tank Unit", icon: "hostile-anti-tank"}]);

  const [swarmsId, setSwarmsId] = useState<number>(1);
  const [dronesId, setDronesId] = useState<number>(101);
  const [enemiesId, setEnemiesId] = useState<number>(10001);

  const [markerDroneId, setMarkerDroneId] = useState<number>();
  const [markerSwarmId, setMarkerSwarmId] = useState<number>();

  const [clickedLatLng, setClickedLatLng] = useState<myLatLng>();
  const [cursorLatLng, setCursorLatLng] = useState<myLatLng>();

  const [movePoint, setMovePoint] = useState<myLatLng>();
  const [patrolPoints, setPatrolPoints] = useState<myLatLng[]>([]);
  const [actualPatrolPoints, setActualPatrolPoints] = useState<ActualPatrolPoints[]>([]);
  const [targetId, setTargetId] = useState<number>(10000);

  const [ordersId, setOrdersId] = useState<number>(1000);
  const [listOfOrders, setListOfOrders] = useState<singleOrder[]>([]);
  const [orderMarkers, setOrderMarkers] = useState<OrderMarker[]>([]);

  const [time, setTime] = useState<number>(Date.now());

  const addSwarm = () => {
    let newSwarm: Swarm = {id: swarmsId, drones: []};
    setSwarmsId(swarmsId + 1);
    setSwarms([...swarms, newSwarm]);
    actualPatrolPoints.push({swarmId: newSwarm.id, actualPatrolPoint: 0})
  }
  const deleteSwarm = (id: number) => {
    setSwarms(swarms.filter(item => item.id !== id));
    setActualPatrolPoints(actualPatrolPoints.filter(item => item.swarmId !== id));
  }
  
  const addDroneToSwarm = (swarmId: number) => {
    let newDrone: Drone = {id: dronesId, latitude: 52.237049, longitude: 21.017532}
    setDronesId(dronesId + 1);
    swarms.find(item => item.id === swarmId)?.drones.push(newDrone);
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

  const addOrder = (name: string, swarmId: number, orderType: number) => {
    setOrdersId(ordersId + 1);
    if(orderType === 1){
      setListOfOrders([...listOfOrders, {id: ordersId, name: name, swarmId: swarmId, orderType: orderType, movePoint: movePoint}])
      setMovePoint(undefined);
    }
    if(orderType === 2){
      setListOfOrders([...listOfOrders, {id: ordersId, name: name, swarmId: swarmId, orderType: orderType, patrolPoints: patrolPoints}])
      setPatrolPoints([]);
    }
    if(orderType === 3){
      setListOfOrders([...listOfOrders, {id: ordersId, name: name, swarmId: swarmId, orderType: orderType, targetId: targetId}])
      setTargetId(0);
    }
  }

  const deleteOrder = (id: number) => {
    var timeOrder = listOfOrders.find( item => item.id === id)
    if(timeOrder)
    {
      setListOfOrders(listOfOrders.filter( item => item.id !== id))
      setOrderMarkers(orderMarkers.filter( item => item.swarmId !== timeOrder?.swarmId))
    }
    if(listOfOrders.length === 0){
      setOrderMarkers([]);
    }
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
    
    setTimeout( () => {
      setTime(Math.floor(Date.now() / 50));
        swarms.forEach(swarm => {
          var actualOrder: singleOrder = listOfOrders.filter( item => item.swarmId === swarm.id)[0];
          if(actualOrder){
            if(actualOrder.orderType === 1 && actualOrder.movePoint){
              if(!orderMarkers.find(item => item.id === 1 && item.swarmId === swarm.id))
                orderMarkers.push({id: 1, latitude: actualOrder.movePoint?.lat, longitude: actualOrder.movePoint?.lng, swarmId: swarm.id})
              else{
                orderMarkers.find(item => item.id === 1 && item.swarmId === swarm.id)!.latitude = actualOrder.movePoint.lat;
                orderMarkers.find(item => item.id === 1 && item.swarmId === swarm.id)!.longitude = actualOrder.movePoint.lng
              }
              var ifDeleteOrder: boolean = true;
              swarm.drones.forEach(drone => {
                if(actualOrder.movePoint){
                  var diffLevel = 0.005;

                  var diffLat = actualOrder.movePoint.lat + ((drone.id - 100) * 0.001) - drone.latitude;
                  var diffLng = actualOrder.movePoint.lng + ((drone.id - 100) * 0.001) - drone.longitude;

                  drone.latitude = drone.latitude + diffLat * diffLevel * 3;
                  drone.longitude = drone.longitude + diffLng * diffLevel * 3;

                  var latDifference = Math.abs(drone.latitude - actualOrder.movePoint.lat);
                  var lngDifference = Math.abs(drone.longitude - actualOrder.movePoint.lng);

                  if(latDifference < diffLevel && lngDifference < diffLevel) ifDeleteOrder = ifDeleteOrder && true
                  else ifDeleteOrder = ifDeleteOrder && false
                }
              })
              if(ifDeleteOrder){
                setListOfOrders(listOfOrders.filter( item => item.id !== actualOrder.id))
                setOrderMarkers(orderMarkers.filter( item => item.swarmId !== swarm.id))
              }
            }
            if(actualOrder.orderType === 2 && actualOrder.patrolPoints){
              for(var i = 0; i < actualOrder.patrolPoints?.length; i++){
                if(orderMarkers.find(item => item.id === i + 1 && item.swarmId === swarm.id)){
                  orderMarkers.find(item => item.id === i + 1 && item.swarmId === swarm.id)!.latitude = actualOrder.patrolPoints[i].lat;
                  orderMarkers.find(item => item.id === i + 1 && item.swarmId === swarm.id)!.longitude = actualOrder.patrolPoints[i].lng
                }
                else{
                  orderMarkers.push({id: i + 1, latitude: actualOrder.patrolPoints[i].lat, longitude: actualOrder.patrolPoints[i].lng, swarmId: swarm.id})
                } 
              }
              var ifChangePoint: boolean = true;
              var actualPatrolPoint = actualPatrolPoints.find(item => item.swarmId === swarm.id)?.actualPatrolPoint;
              var timeActualPatrolPoints = actualPatrolPoints.filter(item => item.swarmId !== swarm.id);
              swarm.drones.forEach(drone => {
                if(actualOrder.patrolPoints && actualPatrolPoint !== undefined){
                  var diffLevel = 0.015;
                  try{
                    var diffLat = actualOrder.patrolPoints[actualPatrolPoint].lat + ((drone.id - 100) * 0.001) - drone.latitude - 0.003;
                    var diffLng = actualOrder.patrolPoints[actualPatrolPoint].lng + ((drone.id - 100) * 0.001) - drone.longitude - 0.003;

                    drone.latitude = drone.latitude + diffLat * diffLevel * 3;
                    drone.longitude = drone.longitude + diffLng * diffLevel * 3;

                    var latDifference = Math.abs(drone.latitude - actualOrder.patrolPoints[actualPatrolPoint].lat);
                    var lngDifference = Math.abs(drone.longitude - actualOrder.patrolPoints[actualPatrolPoint].lng);

                    if(latDifference < diffLevel && lngDifference < diffLevel) ifChangePoint = ifChangePoint && true
                    else ifChangePoint = ifChangePoint && false
                  }
                  catch{
                    var newPatrolPoint = 0;
                    timeActualPatrolPoints.push({swarmId: swarm.id, actualPatrolPoint: newPatrolPoint});
                    setActualPatrolPoints(timeActualPatrolPoints)
                  }
                }
              })
              if(ifChangePoint && actualOrder.patrolPoints && actualPatrolPoint !== undefined){
                var newPatrolPoint;
                if(actualPatrolPoint >= actualOrder.patrolPoints.length -1) newPatrolPoint = 0
                else newPatrolPoint = actualPatrolPoint + 1
                timeActualPatrolPoints.push({swarmId: swarm.id, actualPatrolPoint: newPatrolPoint});
                setActualPatrolPoints(timeActualPatrolPoints)
              }
            }
            if(actualOrder.orderType === 3){
              setOrderMarkers(orderMarkers.filter(item => item.swarmId !== swarm.id))   
              swarm.drones.forEach(drone => {
                if(actualOrder.targetId){
                  var enemy = enemies.find(item => item.id === actualOrder.targetId)
                  if(enemy !== undefined){
                    var diffLevel = 0.005;

                    var diffLat = enemy.latitude + ((drone.id - 100) * 0.001) - drone.latitude;
                    var diffLng = enemy.longitude + ((drone.id - 100) * 0.001) - drone.longitude;
  
                    drone.latitude = drone.latitude + diffLat * diffLevel * 3;
                    drone.longitude = drone.longitude + diffLng * diffLevel * 3;
                  }
                }
              })
            }
          }
        })
    }, 50);
  }, [time]);

  const goToMap = () => setDisplayNumber(1);
  const goToSwarms = () => setDisplayNumber(2);

  const markerClick = (droneId: number, swarmId: number) => {
    setMarkerDroneId(droneId);
    setMarkerSwarmId(swarmId);
  }

  const mapClick = (latitude: number, longitude: number) => {
    setClickedLatLng({lat: latitude, lng: longitude});
  }

  const mapMove = (latitude: number, longitude: number) => {
    setCursorLatLng({lat: latitude, lng: longitude});
  }

  const enemyClick = (id: number) => {
    setTargetId(id);
  }

  return (
    <div className="Home">
      {displayNumber === 1 && scriptLoaded && (<Map mapType={google.maps.MapTypeId.TERRAIN} mapTypeControl={true} dronesArray={drones} enemiesArray={enemies} orderMarkersArray={orderMarkers} markerClickFunction={markerClick} mapClickFunction={mapClick} mapMoveCursorFunction={mapMove} enemyClickFunction={enemyClick}/>)}
      {displayNumber === 2 && (<Swarms swarms={swarms} addSwarmFunction={addSwarm} deleteSwarmFunction={deleteSwarm} addDrone={addDroneToSwarm} deleteDrone={deleteDroneFromSwarm} dragAndDrop={dragAndDropDrone} />)}

      <ul className='nav-menu'>
        <li className='nav-option' onClick={goToMap}>Map</li>
        <li className='nav-option' onClick={goToSwarms}>Swarms</li>
      </ul>

      {displayNumber === 1 && (<Orders markedSwarm={markerSwarmId} markedDrone={markerDroneId} clickedLocation={clickedLatLng} cursorLocation={cursorLatLng} movePoint={movePoint} patrolPoints={patrolPoints} enemiesArray={enemies} targetId={targetId} addPointFunction={addPoint} deletePointFunction={deletePoint} orders={listOfOrders} addOrderFuntion={addOrder} deleteOrder={deleteOrder}/>)}
    </div>
  )
}

export default Navigation;
