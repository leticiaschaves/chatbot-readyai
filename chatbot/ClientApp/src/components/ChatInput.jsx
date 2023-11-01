import React from "react";
import { HiOutlinePaperAirplane, HiOutlinePaperClip } from "react-icons/hi";
import RecordAudio from "./RecordAudio"; // Import the RecordAudio component

const ChatInput = ({ chatInput, setChatInput, uploaderRef, handleSubmit, handleAudioTranscription }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          label="message"
          placeholder="Send a message"
          onChange={(e) => setChatInput(e.target.value)}
          value={chatInput}
        />
        {uploaderRef.current?.value && <span>{uploaderRef.current?.value}</span>}
        <button
          className="form-button"
          type="button"
          onClick={() => {
            uploaderRef.current.click();
          }}
        >
          <HiOutlinePaperClip />
        </button>
        <button
          className="form-button"
          type="submit"
          onClick={handleSubmit}
        >
          <HiOutlinePaperAirplane />
        </button>
        <RecordAudio onAudioTranscription={handleAudioTranscription} /> {/* Include the RecordAudio component */}
      </div>
    </form>
  );
};

export default ChatInput;
