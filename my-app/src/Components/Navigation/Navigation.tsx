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

interface Swarm {
  id: number;
  drones: Drone[];
}

const Navigation = () => {
  const [displayNumber, setDisplayNumber] = useState<number>(1);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [swarms, setSwarms] = useState<Swarm[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);

  const [swarmsId, setSwarmsId] = useState<number>(1);
  const [dronesId, setDronesId] = useState<number>(101);

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

  useEffect(() => {
    const googleMapScript = laodMapApi();
    googleMapScript.addEventListener('load', function () {
      setScriptLoaded(true);
    })
  }, [])

  useEffect( () => {
    var timeDrones: Drone[] = [];
    swarms.forEach(swarm => {
      swarm.drones.forEach(drone => {
        timeDrones = [...timeDrones, drone];
      })
    });
    setDrones(timeDrones);
  }, [swarms]);

  const goToMap = () => setDisplayNumber(1);
  const goToSwarms = () => setDisplayNumber(2);

  return (
    <div className="Home">
      {displayNumber === 1 && scriptLoaded && (<Map mapType={google.maps.MapTypeId.TERRAIN} mapTypeControl={true} dronesArray={drones}/>)}
      {displayNumber === 2 && (<Swarms swarms={swarms} addSwarmFunction={addSwarm} deleteSwarmFunction={deleteSwarm} addDrone={addDroneToSwarm} deleteDrone={deleteDroneFromSwarm} dragAndDrop={dragAndDropDrone} />)}

      <ul className='nav-menu'>
        <li className='nav-option' onClick={goToMap}>Map</li>
        <li className='nav-option' onClick={goToSwarms}>Swarms</li>
      </ul>

      {displayNumber === 1 && (<Orders />)}
    </div>
  )
}

export default Navigation;
