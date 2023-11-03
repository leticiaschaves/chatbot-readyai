import React, { useState } from 'react';

function Teste({ onAudioTranscription }) {
  // State variables for recording status, recorder, audio chunks, and recognition
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recg, setRecg] = useState(null);

  // Function to get user media based on available APIs
  async function getUserMedia(constraints) {
    // Check if the user media API is supported
    if (!navigator.mediaDevices) {
      alert('User API not supported');
      return;
    }

    try {
      // Request access to the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Create a MediaRecorder instance to record audio
      const rec = new MediaRecorder(stream);
      setRecorder(rec);

      // Event handler for capturing audio data
      rec.ondataavailable = (e) => setAudioChunks((chunks) => [...chunks, e.data]);

      // Event handler when recording is stopped
      rec.onstop = () => {
        // Create a blob from collected audio chunks
        const blob = new Blob(audioChunks, { type: 'audio/mp3' });

        // Set the audio element's source to the recorded audio
        document.getElementById('audioElement').src = URL.createObjectURL(blob);

        // Create a speech recognition instance
        const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognitionInstance.interimResults = true;

        // Event handler for capturing speech recognition results
        recognitionInstance.onresult = (event) => {
          const finalTranscript = event.results[0][0].transcript;

          // Pass the final transcription to the provided callback
          onAudioTranscription(finalTranscript);
        };

        setRecg(recognitionInstance);
        recognitionInstance.start(); // Start speech recognition
      };

      rec.start(); // Start audio recording
      setIsRecording(true);
    } catch (error) {
      console.error(error);
      alert('Failed to access the microphone.');
    }
  }

  // Function to start or stop recording based on the current status
  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop the recorder and speech recognition
      recorder.stop();
      setIsRecording(false);
    } else {
      // Set recording status, update UI text, and request access to the microphone
      document.getElementById('isRecording').textContent = 'Recording...';
      getUserMedia({ audio: true });
    }
  };

  return (
    <div>
      <button id="startRecording" onClick={handleToggleRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {/* Display recording status */}
      <div id="isRecording">{isRecording ? 'Recording...' : ''}</div>
      {/* Display audio element for playback */}
      <audio id="audioElement" controls />
    </div>
  );
}

export default Teste;
