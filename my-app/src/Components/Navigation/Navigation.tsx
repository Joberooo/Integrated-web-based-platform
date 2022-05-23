import React, { useEffect, useState } from 'react';
import './Navigation.css';
import Map from '../Map/Map';
import { laodMapApi } from '../../utils/GoogleMapsUtils';
import Orders from '../Orders/Orders';
import Swarms from '../Swarms/Swarms';

const Navigation = () => {
  const [displayNumber, setDisplayNumber] = useState<number>(1);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const googleMapScript = laodMapApi();
    googleMapScript.addEventListener('load', function () {
      setScriptLoaded(true);
    })
  }, [])

  const goToMap = () => setDisplayNumber(1);
  const goToSwarms = () => setDisplayNumber(2);

  return (
    <div className="Home">
      {displayNumber === 1 && scriptLoaded && (<Map mapType={google.maps.MapTypeId.TERRAIN} mapTypeControl={true} />)}
      {displayNumber === 2 && (<Swarms />)}

      <ul className='nav-menu'>
        <li className='nav-option' onClick={goToMap}>Mapa</li>
        <li className='nav-option' onClick={goToSwarms}>Roje</li>
      </ul>

      {displayNumber === 1 && (<Orders />)}
    </div>
  )
}

export default Navigation;
