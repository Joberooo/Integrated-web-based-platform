import React, { FC, useEffect, useState } from 'react';
import SingleDrone from '../SingleDrone/SingleDrone';
import './SingleSwarm.css';

interface Drone {
  id: number;
  latitude: number;
  longitude: number;
}

interface Swarm {
  id: number;
  drones: Drone[];
  deleteFunction: any;
}

const SingleSwarm: FC<Swarm> = ({id, drones, deleteFunction}) => {
  const [thisDrones, setThisDrones] = useState<Drone[]>(drones);
  const [displayDeleteButton, setDisplayDeleteButton] = useState<boolean>(true);

  useEffect(() => {
    if(thisDrones.length > 0) setDisplayDeleteButton(false);
    else setDisplayDeleteButton(true);
  }, [thisDrones]);

  const addDrone = () => {
    var newId = 1;
    if(thisDrones.length > 0) newId = thisDrones[thisDrones.length - 1].id + 1;
    let newDrone: Drone = {id: newId, latitude: 52.237049 + newId, longitude: 21.017532 + newId}
    setThisDrones([...thisDrones, newDrone]);
    drones = thisDrones;
  }

  const deleteDrone = (id: number) => {
    setThisDrones(thisDrones.filter( item => item.id !== id));
  }

  const deleteSwarm = () => {
    deleteFunction(id);
  }

  return (
    <div className="SingleSwarm">
       <h4>Swarm #{id}</h4>
       <button onClick={addDrone}>&#43;</button>
       <button onClick={deleteSwarm} className={"redButton" + (!displayDeleteButton ? " darkButton" : "")} disabled={!displayDeleteButton}>&#128465;</button>
       {thisDrones.map((drone) => {return(<SingleDrone key={drone.id} id={drone.id} latitude={drone.latitude} longitude={drone.longitude} deleteFunction={deleteDrone} />)})}
    </div>
  );
}

export default SingleSwarm;
