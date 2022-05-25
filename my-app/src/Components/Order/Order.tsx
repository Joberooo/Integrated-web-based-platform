import React, { FC } from 'react';
import './Order.css';

interface singleOrder{
    id: number,
    name: string,
    deleteFunction: any,
    actualOrder: boolean
}

const Order: FC<singleOrder> = ({id, name, deleteFunction, actualOrder}) => {
    const deleteOrder = () => deleteFunction(id);

    return (
        <div className='singleOrder'>#{id} {name} {actualOrder !== true ? <div className='singleOrderDelete' onClick={deleteOrder}>&#128465;</div> : <></>}</div>
    );
}

export default Order;
