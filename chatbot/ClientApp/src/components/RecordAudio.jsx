import React, { useState, useRef } from 'react';
import { HiStop } from "react-icons/hi";

function RecordAudio({ onAudioTranscription }) {
  const [isRecording, setIsRecording] = useState(false);
  const audioChunksRef = useRef([]);
  const recorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const recognitionTranscriptRef = useRef('');
  const silenceTimeoutRef = useRef(null);

  const startRecording = () => {
    // Iniciar a gravação de áudio aqui
    const streamConstraints = { audio: true };

    navigator.mediaDevices.getUserMedia(streamConstraints)
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          document.getElementById('audioElement').src = URL.createObjectURL(blob);
        };

        mediaRecorder.start();
        setIsRecording(true);
        recorderRef.current = mediaRecorder;
      })
      .catch((error) => {
        console.error(error);
        alert('Falha ao acessar o microfone.');
      });

    // Iniciar a transcrição em tempo real separadamente
    const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionInstance.interimResults = true;

    recognitionInstance.onresult = (event) => {
      const finalTranscript = event.results[0][0].transcript;
      recognitionTranscriptRef.current = finalTranscript;

      // Limpa o temporizador anterior
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      // Define um novo temporizador para aguardar 1 segundo de silêncio
      silenceTimeoutRef.current = setTimeout(() => {
        onAudioTranscription(recognitionTranscriptRef.current);
      }, 1000);
    };

    recognitionInstance.start();
    recognitionRef.current = recognitionInstance;
  };

  const stopRecording = () => {
    if (isRecording) {
      recorderRef.current.stop();
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      document.getElementById('isRecording').textContent = 'Gravando...';
      startRecording();
    }
  };

  return (
    <div className="record">
      <button
        id="startRecording"
        className={`btn record ${isRecording ? 'recording' : ''}`}
        onClick={handleToggleRecording}
      >
        {isRecording ? 'Parar' : <HiStop />}
      </button>
      <div id="isRecording">{isRecording ? 'Gravando...' : ''}</div>
      <audio id="audioElement" controls />
    </div>
  );
}

export default RecordAudio;
