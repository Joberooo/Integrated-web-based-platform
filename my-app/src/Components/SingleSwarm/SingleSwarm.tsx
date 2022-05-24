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
  deleteSwarmFunction: any;
  addDroneFunction: any;
  deleteDroneFunction: any;
}

const SingleSwarm: FC<Swarm> = ({id, drones, deleteSwarmFunction, addDroneFunction, deleteDroneFunction}) => {
  const [displayDeleteButton, setDisplayDeleteButton] = useState<boolean>(true);

  useEffect(() => {
    if(drones.length > 0) setDisplayDeleteButton(false);
    else setDisplayDeleteButton(true);
  }, [drones]);

  const deleteSwarm = () => deleteSwarmFunction(id);
  const addDrone = () => addDroneFunction(id);
  const deleteDrone = (droneId: number) => deleteDroneFunction(id, droneId);

  return (
    <div className="SingleSwarm">
       <h4>Swarm #{id}</h4>
       <button onClick={addDrone}>&#43;</button>
       <button onClick={deleteSwarm} className={"redButton" + (!displayDeleteButton ? " darkButton" : "")} disabled={!displayDeleteButton}>&#128465;</button>
       {drones.sort( (a, b) => a.id > b.id ? 1 : -1).map((drone) => {return(<SingleDrone key={drone.id} id={drone.id} latitude={drone.latitude} longitude={drone.longitude} deleteFunction={deleteDrone} />)})}
    </div>
  );
}

export default SingleSwarm;
