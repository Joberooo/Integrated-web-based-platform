import React, { FC, useEffect, useState } from 'react';
import './EnemyObject.css';
import image from './Images/aniTankSoviet.jpg';

interface Enemy{
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    icon?: string;
}

interface IEnemy{
    targetId: number;
    enemiesArray: Enemy[];
    addTrackingOrder: any;
    markedSwarm?: number;
}

const EnemyObject: FC<IEnemy> = ({targetId, enemiesArray, addTrackingOrder, markedSwarm}) => {
    const [enemyDetails, setEnemyDetails] = useState<Enemy>();
    const [ifVisible, setIfVisible] = useState<boolean>(false);

    useEffect(() => {
        var newEnemyDetails = enemiesArray.find(item => item.id === targetId)
        if(newEnemyDetails !== undefined) setEnemyDetails(newEnemyDetails)
    }, [targetId])

    const clickVisible = () => setIfVisible(true);
    const clickInvisible = () => setIfVisible(false);

    return (
        <>
            <div className='enemy'>
                <h5>Target tracking:</h5>
                {targetId > 10000 ? <p>Object #{targetId} - <i onClick={clickVisible}>see details...</i></p> : <></>}
                <button onClick={addTrackingOrder} disabled={targetId !== 0 && markedSwarm ? false : true}>Set order!</button>
            </div>
            { enemyDetails ? 
            <div className='enemyDetails' style={{visibility: ifVisible ? "visible" : "hidden"}}>
                <button onClick={clickInvisible}>x</button>
                <ul>
                    <li>Enemy #{enemyDetails.id} - {enemyDetails.name}</li>
                    <li>Latitude: {enemyDetails.latitude}</li>
                    <li>Longitude: {enemyDetails.longitude}</li>
                    <li>Date of detection: 261720BMAY22</li>
                </ul>
                <div className='details'>
                    <h5>Details:</h5>
                    {targetId === 10002 ? <>
                    <div className='oneInformation'>
                        <div className='oneInformationDate'>261735BMAY22</div>
                        <div className='oneInformationContent'>Unit detected as: Hostile Anti Tank Unit</div>
                    </div>
                    <div className='oneInformation'>
                        <div className='oneInformationDate'>261732BMAY22</div>
                        <div className='oneInformationContent'>New unit pic</div>
                        <div className='oneInformationImage'><img src={image} alt="Here should be a pic!"></img></div>
                    </div></>
                    : <></>}
                    <div className='oneInformation'>
                        <div className='oneInformationDate'>261730BMAY22</div>
                        <div className='oneInformationContent'>
                            Unit move from location: <br />
                            53.59180319506592 - 23.720041363249262, <br />
                            To location: <br />
                            {targetId === 10002 ? "53.56118584498003 - 23.609808907879028" : "53.40985605052642 - 23.71170195660522"}
                        </div>
                    </div>
                    <div className='oneInformation'>
                        <div className='oneInformationDate'>261720BMAY22</div>
                        <div className='oneInformationContent'>Detected new unidentified ground object</div>
                    </div>
                </div>
            </div>
            : <></> }
        </>
    );
}

export default EnemyObject;
