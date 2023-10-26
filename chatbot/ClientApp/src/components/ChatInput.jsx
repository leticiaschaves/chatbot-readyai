import React from "react";
import {
  HiOutlinePaperAirplane,
  HiOutlinePaperClip,
} from "react-icons/hi";

const ChatInput = ({ chatInput, setChatInput, uploaderRef, handleSubmit }) => {
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
      </div>
    </form>
  );
};

export default ChatInput;
