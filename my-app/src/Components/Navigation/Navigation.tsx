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

  const addSwarm = () => {
    var newId = 1;
    if(swarms.length > 0) newId = swarms[swarms.length - 1].id + 1;
    let newSwarm: Swarm = {id: newId, drones: []};
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
      var newId = 1 + swarmId * 100;
      if(swarmDrones.length > 0) newId = swarmDrones[swarmDrones.length - 1].id + 1;
      let newDrone: Drone = {id: newId, latitude: 52.237049 + newId, longitude: 21.017532 + newId}
      swarmToChange.drones = [...swarmDrones, newDrone];
      timeSwarms = [...timeSwarms, swarmToChange];
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

  useEffect(() => {
    const googleMapScript = laodMapApi();
    googleMapScript.addEventListener('load', function () {
      setScriptLoaded(true);
    })
  }, [])

  const goToMap = () => setDisplayNumber(1);
  const goToSwarms = () => setDisplayNumber(2);

  return (
    <div className="Home">
      {displayNumber === 1 && scriptLoaded && (<Map mapType={google.maps.MapTypeId.TERRAIN} mapTypeControl={true} swarmsArray={swarms}/>)}
      {displayNumber === 2 && (<Swarms swarms={swarms} addSwarmFunction={addSwarm} deleteSwarmFunction={deleteSwarm} addDrone={addDroneToSwarm} deleteDrone={deleteDroneFromSwarm}/>)}

      <ul className='nav-menu'>
        <li className='nav-option' onClick={goToMap}>Mapa</li>
        <li className='nav-option' onClick={goToSwarms}>Roje</li>
      </ul>

      {displayNumber === 1 && (<Orders />)}
    </div>
  )
}

export default Navigation;
