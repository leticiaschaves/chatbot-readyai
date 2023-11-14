import React from "react";
import { ImSpinner8 } from "react-icons/im";
import {
  HiOutlineChatAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import { getAllChats } from "./api.js";

const ChatHistoryList = ({ chatsHistory, handleRemoveChatHistory }) => {
  return (
    <ul className="chats-list-sidebar">
      {chatsHistory.map(({ id, chatTitle, loading }) => (
        <li key={id} className="chats-list-listing">
          <a href={`?chat-id=${id}`}>
            <HiOutlineChatAlt style={{ fontSize: '17px' }} />
            <span>{chatTitle}</span>
            <button className="remove-chat"
              onClick={(e) => {
                e.preventDefault();
                if (!loading) handleRemoveChatHistory(id);
              }}
              disabled={loading}
            >
              {loading ? <ImSpinner8 /> : <HiOutlineTrash />}
            </button>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ChatHistoryList;
