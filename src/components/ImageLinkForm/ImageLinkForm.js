import React from 'react';

const ImageLinkForm = ({ onValueChange, onDrop}) => {
  return (
    <div>
      <p className="App-intro f3">
        {'This Magic Brain will detect faces in your pictures. Give it a try.'}
      </p>
      <div className='center'>
        <div className="pattern pa4 br3 shadow-5">
          <input onChange={e => onValueChange(e)} className=' f4 pa2 w-70 center' type="text" />
          <button className='grow f4 link pv2 ph3 pv2 w-30  dib white bg-light-purple cursor' onClick={onDrop}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default ImageLinkForm;