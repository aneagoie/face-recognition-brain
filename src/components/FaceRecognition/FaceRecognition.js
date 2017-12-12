import React from 'react';

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className='absolute mt2'>
        <img id='image'src={imageUrl} width="500px" height="auto" />
        <div className='bounding-box' style={{top: box.y, right: box.w, bottom: box.h, left: box.x}}>
        </div>
      </div>
    </div>
  );
}

export default FaceRecognition;