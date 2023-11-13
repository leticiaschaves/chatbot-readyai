import React from "react";
import { ImSpinner8 } from "react-icons/im";
import {
  HiOutlineChatAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import { getAllChats } from "./api.js";

const ChatHistoryList = ({ chatsHistory, handleRemoveChatHistory }) => {
  return (
    <ul>
      {chatsHistory.map(({ id, chatTitle, loading }) => (
        <li key={id}>
          <a href={`?chat-id=${id}`}>
            <HiOutlineChatAlt />
            <span>{chatTitle}</span>
            <button
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
