import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage } from "../redux/actions/index";
import "./Chatbot.css"; // Import your CSS file for styling

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.messages);

  const handleSendMessage = () => {
    dispatch(sendMessage(message));
    // Add logic here to send the message to your chatbot service
    // and handle the bot's response
    // You can use websockets or an API for this purpose
    setMessage("");
  };

  return (
    <div className="chatbot-container">
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="input-field"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
