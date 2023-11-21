import React, { useState, useMemo } from "react";
import { HiOutlineMicrophone, HiOutlineStop } from "react-icons/hi";
import Recorder from "../utils/Recorder";
import classnames from "classnames";
import "./Chatbot.css";

function RecordAudio({ onAudioTranscription, setChatInput }) {
  // Creating a state to keep in track with the recording state
  const [recording, setRecording] = useState(false);

  // Creating a memoized Recorder passing the `setChatInput` variable to
  // update it and empty it when necessary
  const recorder = useMemo(() => {
    return new Recorder({
      setChatInput: setChatInput,
    });
  }, [setChatInput]);

  // Toggling recording state
  const handleToggleRecording = async () => {
    if (recorder.status === "stopped") {
      recorder.start();
      setRecording(true);
    } else {
      const result = await recorder.stop();
      setRecording(false);
      if (!result.transcription) return;
      onAudioTranscription(result.transcription, result.audio);
    }

    // Delays 100ms
    await new Promise((r) => setTimeout(r, 100));

    // Only then, empties input state
    setChatInput("");
  };

  return (
    <div className="record">
      <button
        id="startRecording"
        type="button"
        
        className={classnames("form-button", { recording: recording })}
        onClick={handleToggleRecording}
      >
        {recording ? <HiOutlineStop/> : <HiOutlineMicrophone />}
      </button>
    </div>
  );
}

export const RecordAudioMemo = React.memo(RecordAudio);
