import React from "react";
import { HiCheck } from "react-icons/hi";
import { FaRobot } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import Waveform from "../utils/Waveform";

const ChatMessage = ({ chats }) => {
  const getChatIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chat-id');
    return chatId;
  };

  const filterMessagesByChatId = (chats, chatId) => {
    const filteredChat = chats.find(chat => chat.id == chatId);
  
    if (filteredChat) {
      const messages = filteredChat.messages.messages;
      return messages;
    } else {
      return [];
    }
  };

  const chatIdFromUrl = getChatIdFromUrl(); // Obtém o ID do chat da URL
  const filteredMessages = filterMessagesByChatId(chats, chatIdFromUrl); // Filtra as mensagens pelo ID do chat

  return (
    <ul>
      {filteredMessages ?
        filteredMessages.map(({ id, content, role }) =>
          role == "user" ? (
            <div key={id}>
            <li className={`message me`}>
              {content}
            </li>
            </div>
          ) : (
            <div key={id}>
            <li className="message bot">
              <div className="robot-icon">
                <FaRobot />
              </div>
              <span>{content}</span>
            </li>
            </div>
          ))
        :
        chats.map(({ id, message, sending, sender, type, objectUrl }) =>
          sender === "me" ? (
            <li
              key={id}
              className={`message me${type === "audio" ? " audio" : ""}`}
            >
              <span>{message}</span>

              <div className={`state${sending ? " sending" : ""}`}>
                {sending ? <ImSpinner8 /> : <HiCheck />}
              </div>

              {type === "audio" && (
                <span className="transcription-label">Transcrição:</span>
              )}

              {type === "audio" && <Waveform audio={objectUrl} />}
            </li>
          ) : (
            <li key={id} className="message bot">
              <div className="robot-icon">
                <FaRobot />
              </div>
              <span>{message}</span>
            </li>
          )
        )
      }
    </ul>
  );
};

export default ChatMessage;