import React, { useEffect, useState } from 'react';
import './App.css';
import Map from '../Map/Map';
import { laodMapApi } from '../../utils/GoogleMapsUtils';

function App() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const googleMapScript = laodMapApi();
    googleMapScript.addEventListener('load', function () {
      setScriptLoaded(true);
    })
  }, [])

  return (
    <div className="App">
      {scriptLoaded && (
        <Map mapType={google.maps.MapTypeId.TERRAIN} mapTypeControl={true} />
      )}
    </div>
  );
}

export default App;
