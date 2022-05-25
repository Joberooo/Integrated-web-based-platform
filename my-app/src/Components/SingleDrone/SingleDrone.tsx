import React, { FC } from 'react';
import './SingleDrone.css';

interface Drone {
  id: number;
  swarmId: number;
  latitude: number;
  longitude: number;
  deleteFunction: any;
}

const SingleDrone: FC<Drone> = ({id, swarmId, latitude, longitude, deleteFunction}) => {

  const deleteDrone = () => deleteFunction(id);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('droneId', event.currentTarget.id);
    event.dataTransfer.setData('swarmId', swarmId.toString());
  }

  return (
    <div className="SingleDrone" draggable={true} onDragStart={handleDragStart} id={id.toString()}>
       <p>Drone #{id}</p> 
       <p>Lat: {latitude} <br />Lng: {longitude}</p>
       <button onClick={deleteDrone}>&#128465;</button>
    </div>
  );
}

export default SingleDrone;
