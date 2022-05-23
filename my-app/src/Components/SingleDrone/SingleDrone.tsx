import React, { FC, useEffect, useState } from 'react';
import './SingleDrone.css';

interface Drone {
  id: number;
  latitude: number;
  longitude: number;
  deleteFunction: any;
}

const SingleDrone: FC<Drone> = ({id, latitude, longitude, deleteFunction}) => {

  const deleteDrone = () => {
    deleteFunction(id);
  }

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text', event.currentTarget.id);
  }

  return (
    <div className="SingleDrone" draggable={true} onDragStart={handleDragStart}>
       <p>Drone #{id}</p> 
       <p>{latitude} - {longitude}</p>
       <button onClick={deleteDrone}>&#128465;</button>
    </div>
  );
}

export default SingleDrone;
