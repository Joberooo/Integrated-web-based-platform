import React, { FC } from 'react';
import './Point.css';

interface myLatLng{
    lat: number,
    lng: number,
    deleteFunction: any
  }

const Point: FC<myLatLng> = ({lat, lng, deleteFunction}) => {
    const deletePoint = () => deleteFunction(lat, lng);

    return (
        <div className='singlePoint'><div className='singlePointLocation'>{lat} :: {lng}</div><div className='singlePointDelete' onClick={deletePoint}>&#128465;</div></div>
    );
}

export default Point;
