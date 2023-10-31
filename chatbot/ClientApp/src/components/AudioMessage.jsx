import React from 'react';

const AudioMessage = ({ src }) => {
  return (
    <audio controls>
      <source src={src} type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioMessage;
