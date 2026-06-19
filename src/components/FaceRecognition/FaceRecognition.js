import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={imageUrl || null} width='500px' heigh='auto'/>
        { // NEW: Loop through the array of boxes (NEW HuggingFace API)
          boxes.map((box, i) => {
            return (
              <div 
                key={i} 
                className='bounding-box' 
                style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}>
              </div>
            );
          })
        }
        {/* OLD: <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div> */}
      </div>
    </div>
  );
}

export default FaceRecognition;