import React, { useEffect, useState } from 'react';
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

function Swarms() {
  const [swarms, setSwarms] = useState<Swarm[]>([]);

  const addSwarm = () => {
    var newId = 1;
    if(swarms.length > 0) newId = swarms[swarms.length - 1].id + 1;
    let newSwarm: Swarm = {id: newId, drones: []};
    setSwarms([...swarms, newSwarm]);
  }

  const deleteSwarm = (id: number) => {
    setSwarms(swarms.filter( item => item.id !== id));
  }

  return (
    <div className="Swarms">
       <button onClick={addSwarm} className="newSwarmButton">Add new swarm</button>

       {swarms.map((swarm) => {return(<SingleSwarm key={swarm.id} id={swarm.id} drones={swarm.drones} deleteFunction={deleteSwarm} />)})}
    </div>
  );
}

export default Swarms;
