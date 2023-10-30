import React from "react";
import { HiCheck } from "react-icons/hi";
import { FaRobot } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";

const ChatMessage = ({ chats }) => {
  return (
    <ul>
      {chats.map(({ id, message, sending, sender }) =>
        sender === "me" ? (
          <li key={id} className="message me">
            <span>{message}</span>
            <div className={`state${sending ? " sending" : ""}`}>
              {sending ? <ImSpinner8 /> : <HiCheck />}
            </div>
          </li>
        ) : (
          <li key={id} className="message bot">
            <div className="robot-icon">
              <FaRobot />
            </div>
            <span>{message}</span>
          </li>
        )
      )}
    </ul>
  );
};

export default ChatMessage;
