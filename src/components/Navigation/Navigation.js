import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
        <p className="f3 link dim black underline pa3 pointer" onClick={() => onRouteChange('signout')}>Sign Out</p>
      </nav>
    );
  }
  return (
    <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
      <p className="f3 link dim black underline pa3 pointer" onClick={() => onRouteChange('signin')}>Sign In</p>
      <p className="f3 link dim black underline pa3 pointer" onClick={() => onRouteChange('register')}>Register</p>
    </nav>
  );
}

export default Navigation;
