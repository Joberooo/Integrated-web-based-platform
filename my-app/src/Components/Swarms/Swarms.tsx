import React, { FC, useEffect } from 'react';
import './Swarms.css';
import SingleSwarm from '../SingleSwarm/SingleSwarm';

interface Drone {
  id: number;
  latitude: number;
  longitude: number;
}

interface Swarm {
  id: number;
  drones: Drone[];
}

interface ISwarms {
  swarms: Swarm[];
  addSwarmFunction: any;
  deleteSwarmFunction: any;
  addDrone: any;
  deleteDrone: any;
}

const Swarms: FC<ISwarms> = ({swarms, addSwarmFunction, deleteSwarmFunction, addDrone, deleteDrone}) => {
  
  const addSwarm = () => addSwarmFunction();
  const deleteSwarm = (id: number) => deleteSwarmFunction(id);
  const addDroneToSwarm = (swarmId: number) => addDrone(swarmId);
  const deleteDroneFromSwarm = (swarmId: number, droneId: number) => deleteDrone(swarmId, droneId);

  return (
    <div className="Swarms">
       <button onClick={addSwarm} className="newSwarmButton">Add new swarm</button>

       {swarms.sort( (a, b) => a.id > b.id ? 1 : -1 ).map((swarm) => {return(<SingleSwarm key={swarm.id} id={swarm.id} drones={swarm.drones} deleteSwarmFunction={deleteSwarm} addDroneFunction={addDroneToSwarm} deleteDroneFunction={deleteDroneFromSwarm} />)})}
    </div>
  );
}

export default Swarms;
