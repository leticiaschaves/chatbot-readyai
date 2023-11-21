import React, { useRef, useState } from "react";
import { nanoid } from "nanoid";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import ChatInput from "./ChatInput";
import ChatHistoryList from "./ChatHistoryList";
import ChatMessage from "./ChatMessage";
import "./Chatbot.css";
import { useChat } from  '../utils/Chat/ChatFunctions';

const Chatbot = () => {
  const uploaderRef = useRef(null);
  const { chats, setChats, sendMessage, fetchAndDisplayResponse, handleAudioTranscription } = useChat();
  const [chatInput, setChatInput] = useState("");
  const [audioRecording, setAudioRecording] = useState(null); // Novo estado para o áudio gravado
  const [chatsHistory, setChatsHistory] = useState([
    {
      chatTitle: "Como usar o chatbot",
      createdAt: Date.now(),
      id: nanoid(),
      loading: false,
    },
  ]);

  const disabled = chats.find((chat) => chat.sending);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chatInput || disabled) return;

    // Chamar a função para enviar mensagem
    await sendMessage(chatInput, setChatInput);
    setChatInput(""); // Limpar o campo de entrada após o envio da mensagem
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
        <button type="button" className="new-chat" onClick={handleCreateChatHistory}>
          <HiOutlinePlus style={{ fontSize: '15px' }}/>
          Novo Chat
        </button>
        <button 
        type="button" 
        className="delete">
          <HiOutlineTrash style={{ fontSize: '15px' }}/>
          Apagar tudo
        </button>
        <ChatHistoryList
          chatsHistory={chatsHistory}
          handleRemoveChatHistory={handleRemoveChatHistory}
        />
      </aside>
      <div className="main-chat-wrapper">
        <ChatMessage chats={chats} audioRecording={audioRecording} />
        <ChatInput
          chatInput={chatInput}
          setChatInput={setChatInput}
          uploaderRef={uploaderRef}
          handleSubmit={handleSubmit}
          handleAudioTranscription={handleAudioTranscription}
        />
      </div>
      <input ref={uploaderRef} type="file" />
    </main>
  );
};

export default Chatbot;
