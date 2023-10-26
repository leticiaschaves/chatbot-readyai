import React, { useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { fetchOpenAIResponse } from "../redux/actions/actions";
import { nanoid } from "nanoid";
import { HiOutlinePlus } from "react-icons/hi";
import ChatInput from "./ChatInput";
import ChatHistoryList from "./ChatHistoryList";
import ChatMessage from "./ChatMessage";
import "./Chatbot.css";

const Chatbot = () => {
  const uploaderRef = useRef(null);
  const dispatch = useDispatch();

  const [chats, setChats] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatsHistory, setChatsHistory] = useState([
    {
      chatTitle: "Como usar o chatgpcubo",
      createdAt: Date.now(),
      id: nanoid(),
      loading: false,
    },
  ]);

  const disabled = chats.find(chat => chat.sending);

  const handleAddChat = (newChat) => {
    setChats((c) => [
      ...c,
      newChat,
    ]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chatInput || disabled) return;

    const id = nanoid();
    setChatInput("");

    const newMeMessage = {
      message: chatInput,
      sentAt: Date.now(),
      id,
      sending: true,
      sender: "me",
    };
    handleAddChat(newMeMessage);

    try {
      const chatgptresposta = await fetchOpenAIResponse(chatInput, chats);
      console.log('user', chatInput);
      console.log('bot', chatgptresposta.choices[0].message.content)
      const botMessage = {
        id: nanoid(),
        message: chatgptresposta.choices[0].message.content,
        sentAt: Date.now(),
        sending: false,
        sender: "bot",
      };
      handleAddChat(botMessage);
    } catch (e) {
      const errorMessage = {
        id: nanoid(),
        message: "errei fui mlk",
        sentAt: Date.now(),
        sending: false,
        sender: "bot",
      };
      handleAddChat(errorMessage);
    }
  };

  const handleRemoveChatHistory = async (id) => {
    setChatsHistory((c) =>
      c.map((history) =>
        history.id === id ? { ...history, loading: true } : history
      )
    );

    await new Promise((res) => {
      setTimeout(res, 1000);
    });

    setChatsHistory((c) => c.filter(({ id: chat_id }) => chat_id !== id));
  };

  const handleCreateChatHistory = () => {
    setChatsHistory((h) => [
      ...h,
      {
        chatTitle: "New chat",
        createdAt: Date.now(),
        id: nanoid(),
        loading: false,
      },
    ]);
  };

  return (
    <main className="main-page">
      <aside className="sidebar">
        <button type="button" onClick={handleCreateChatHistory}>
          <HiOutlinePlus />
          New chat
        </button>
        <ChatHistoryList chatsHistory={chatsHistory} handleRemoveChatHistory={handleRemoveChatHistory} />
      </aside>
      <div className="main-chat-wrapper">
        <ChatMessage chats={chats} />
        <ChatInput
          chatInput={chatInput}
          setChatInput={setChatInput}
          uploaderRef={uploaderRef}
          handleSubmit={handleSubmit}
        />
      </div>
      <input ref={uploaderRef} type="file" />
    </main>
  );
};

export default Chatbot;
