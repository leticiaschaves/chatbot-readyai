import React, { useState } from 'react';
import { HiStop } from "react-icons/hi";

function RecordAudio({ onAudioTranscription }) {
  const [recording, setRecording] = useState(false);
  const [audioTranscription, setAudioTranscription] = useState('');

  let recognition;

  const startRecording = async () => {
    try {
      // Initialize the speech recognition
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.interimResults = true;

      // Event handler for capturing speech recognition results
      recognition.onresult = (event) => {
        const finalTranscript = event.results[0][0].transcript;
        setAudioTranscription(finalTranscript);
      };

      // Event handler for when speech ends
      recognition.onspeechend = () => {
        stopRecording();
      };

      // Event handler for recognition errors
      recognition.onerror = (event) => {
        stopRecording();
        handleRecognitionError(event.error);
      };

      recognition.start();

      setRecording(true);
    } catch (error) {
      console.error(error); // Log errors for debugging
    }
  };

  const stopRecording = () => {
    if (recording) {
      setRecording(false);
      onAudioTranscription(audioTranscription);
    }
  };

  const handleRecognitionError = (error) => {
    // Handle recognition errors here
    console.error('Recognition error:', error);
  };

  const handleRecordClick = () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <div className="record">
      <button
        className={`btn record ${recording ? 'recording' : ''}`}
        onClick={handleRecordClick}
      >
        {recording ? 'Parar' : <HiStop />}
      </button>
    </div>
  );
}

export default RecordAudio;