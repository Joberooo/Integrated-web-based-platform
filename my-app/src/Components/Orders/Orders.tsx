import React from 'react';
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
  patrolPoints?: myLatLng[];
  targetId?: number;
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
}

const Orders: React.FC<IOrders> = ({markedSwarm, markedDrone, clickedLocation, cursorLocation, movePoint, patrolPoints, targetId, addPointFunction, deletePointFunction, orders, addOrderFuntion, deleteOrder}) => {

  const addMovePointOrder = () => {
    addOrderFuntion("Move to point order", markedSwarm);
  }

  const addPatrolOrder = () => {
    addOrderFuntion("Patrol the area order", markedSwarm);
  }

  const addTrackingOrder = () => {
    addOrderFuntion("Target tracking order", markedSwarm);
  }

  return (
    <div className='Orders'>
      <div className='title'>
        <h4>Orders:</h4>
      </div>
      <ul>
        <li>
          <h5>New order location:</h5>
          <p>{clickedLocation?.lat} :: {clickedLocation?.lng}</p>
          <button onClick={addPointFunction}>Add location to order</button>
        </li>
        <li><h5>Move to point:</h5> <p>{movePoint?.lat} :: {movePoint?.lng}</p> <button onClick={addMovePointOrder}>Set order!</button></li>
        <li>
          <h5>Patrol the area:</h5> 
          <div>
          {patrolPoints?.map((point, i) => {
            return(
              <Point key={i} lat={point.lat} lng={point.lng} deleteFunction={deletePointFunction}/>
            )})}
          </div>
          <button onClick={addPatrolOrder}>Set order!</button>
        </li>
        <li><h5>Target tracking:</h5> <p>Object #{targetId}</p> <button onClick={addTrackingOrder}>Set order!</button></li>
      </ul>
      <div className='swarm'>
        <div className='id'>Swarm #{markedSwarm} - Drone #{markedDrone}</div>
        <div className='ordersList'>
          <h5>List of Orders: </h5>
          {orders?.filter(item => item.swarmId === markedSwarm).map((order, i) => {
            return(
              <Order key={order.id} id={order.id} name={order.name} deleteFunction={deleteOrder} actualOrder={i === 0 ? true : false}/>
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
