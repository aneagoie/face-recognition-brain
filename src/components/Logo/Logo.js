import React from 'react';
import Tilt from 'react-tilt'
import logo from './brain.png';

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
       <div className="Tilt-inner pa3"> <img style={{paddingTop: '5px'}} src={logo} className="" alt="logo" /> </div>
      </Tilt>
    </div>
  );
}

export default Logo;
