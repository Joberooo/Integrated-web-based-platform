import React from 'react';
import EnemyObject from '../EnemyObject/EnemyObject';
import Order from '../Order/Order';
import Point from '../Point/Point';
import './Orders.css';

interface myLatLng{
  lat: number,
  lng: number
}

interface IOrders {
  markedSwarm?: number;
  markedDrone?: number;
  clickedLocation?: myLatLng;
  cursorLocation?: myLatLng;
  movePoint?: myLatLng;
  patrolPoints: myLatLng[];
  enemiesArray: Enemy[];
  targetId: number;
  addPointFunction: any;
  deletePointFunction: any;
  orders: singleOrder[];
  addOrderFuntion: any;
  deleteOrder: any;
}

interface singleOrder{
  id: number;
  name: string;
  swarmId: number;
  orderType: number;
}

interface Enemy{
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  icon?: string;
}

const Orders: React.FC<IOrders> = ({markedSwarm, markedDrone, clickedLocation, cursorLocation, movePoint, patrolPoints, enemiesArray, targetId, addPointFunction, deletePointFunction, orders, addOrderFuntion, deleteOrder}) => {

  const addMovePointOrder = () => {
    addOrderFuntion("Move to point order", markedSwarm, 1);
  }

  const addPatrolOrder = () => {
    addOrderFuntion("Patrol the area order", markedSwarm, 2);
  }

  const addTrackingOrder = () => {
    addOrderFuntion("Target tracking order", markedSwarm, 3);
  }

  return (
    <div className='Orders'>
      <div className='title'>
        <h4>Orders:</h4>
      </div>
      <ul>
        <li>
          <h5>New order location:</h5>
          {clickedLocation ? <p>{clickedLocation?.lat} :: {clickedLocation?.lng}</p> : <></>}
          <button onClick={addPointFunction}>Add location to order</button>
        </li>
        <li>
          <h5>Move to point:</h5>
          {movePoint ? <p>{movePoint?.lat} :: {movePoint?.lng}</p> : <></>}
          <button onClick={addMovePointOrder} disabled={movePoint && markedSwarm ? false : true}>Set order!</button></li>
        <li>
          <h5>Patrol the area:</h5> 
          <div>
          {patrolPoints?.map((point, i) => {
            return(
              <Point key={i} lat={point.lat} lng={point.lng} deleteFunction={deletePointFunction}/>
            )})}
          </div>
          <button onClick={addPatrolOrder} disabled={patrolPoints.length > 0 && markedSwarm ? false : true}>Set order!</button>
        </li>
        <li>
          <EnemyObject targetId={targetId} enemiesArray={enemiesArray} addTrackingOrder={addTrackingOrder} markedSwarm={markedSwarm}/>
        </li>
      </ul>
      <div className='swarm'>
        <div className='id'>Swarm #{markedSwarm} - Drone #{markedDrone}</div>
        <div className='ordersList'>
          <h5>List of Orders: </h5>
          {orders?.filter(item => item.swarmId === markedSwarm).map((order, i) => {
            return(
              <Order key={order.id} id={order.id} name={order.name} orderType={order.orderType} deleteFunction={deleteOrder} actualOrder={i === 0 ? true : false}/>
            )    
          })}
        </div>
      </div>
      <div className='cursorLocation'>
        <i>Cursor location:</i><br />
        <i>{cursorLocation?.lat} :: {cursorLocation?.lng}</i>
      </div>
    </div>
  )
}

export default Orders;
