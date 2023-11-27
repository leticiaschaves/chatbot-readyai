import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { nanoid } from "nanoid";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import axios from 'axios';
import ChatInput from "./ChatInput";
import ChatHistoryList from "./ChatHistoryList";
import ChatMessage from "./ChatMessage";
import "./Chatbot.css";
import { useChat } from  '../utils/Chat/ChatFunctions';

const Chatbot = () => {
  const uploaderRef = useRef(null);
  const { chats, setChats, sendMessage, fetchAndDisplayResponse, handleAudioTranscription } = useChat();
  const [chatInput, setChatInput] = useState("");
  const [audioRecording, setAudioRecording] = useState(null);
  const [chatsHistory, setChatsHistory] = useState([
    {
      title: "Como usar o chatbot",
      createdAt: Date.now(),
      id: nanoid(),
      loading: false,
    },
  ]);

  const disabled = chats.find((chat) => chat.sending);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chatInput || disabled) return;
    const params = Object.fromEntries(new URLSearchParams(window.location.search))
    await handleSendMessage(params["chat-id"],chatInput);
    await sendMessage(chatInput, setChatInput);
    setChatInput("");
  };

  //deleta os chats da API
  const handleRemoveChatHistory = async (id) => {
    setChatsHistory((c) =>
      c.map((history) =>
        history.id === id ? { ...history, loading: true } : history
      )
    );

    try {
      await axios.delete(`https://aiready.azurewebsites.net/chats/?chat_id=${id}`);
      setChatsHistory((c) => c.filter(({ id: chat_id }) => chat_id !== id));
    } catch (error) {
      console.error("Erro ao excluir o chat da API:", error);
    }
  
    await new Promise((res) => {
      setTimeout(res, 1000);
    });

    setChatsHistory((c) => c.filter(({ id: chat_id }) => chat_id !== id));
  };


  //recupera os chats da api
const getChatsFromAPI = async () => {
    try {
      const response = await axios.get("https://aiready.azurewebsites.net/chats/", {
        params: {
          owner_id: 5
        }
      });
      console.log("Chats obtidos da API:", response.data);
  
      //filtra apenas os chats do owner_id 5
      const chatsWithId5 = response.data.filter(chat => chat.owner_id === 5);
  
      //fusca as mensagens para cada chat 
      const chatsWithMessages = await Promise.all(
        chatsWithId5.map(async (chat) => {
          const chatWithMessages = { ...chat };
          chatWithMessages.messages = await getMessagesForChat(chat.id); //função para buscar as mensagens de cada chat
          return chatWithMessages;
        })
      );
  
      setChatsHistory(chatsWithMessages); //atualiza o estado dos chats com as mensagens obtidas da API
    } catch (error) {
      console.error("Erro ao buscar chats da API:", error);
    }
  };
  
  const getMessagesForChat = async (chatId) => {
    try {
      const response = await axios.get(`https://aiready.azurewebsites.net/chats/`);
      return response.data.find(({ owner_id }) => owner_id === 5)
    } catch (error) {
      console.error(`Erro ao buscar mensagens do chat ${chatId}:`, error);
      return [];
    }
  };
  
  useEffect(() => {
    getChatsFromAPI(); //busca os chats do owner_id 5 quando a página eh recarregada
  }, []);
  
  //envia os chats pra API
  const sendChatsToAPI = async (chatData) => {
    try {
      const response = await axios.post("https://aiready.azurewebsites.net/users/5/chats/", chatData);
      console.log("Chat enviado para a API:", response.data);
      await getChatsFromAPI(); //depois enviar o chat para a API, buscar dnv os chats do owner_id 5
    } catch (error) {
      console.error("Erro ao enviar o chat para a API:", error);
    }
  };
  
  const sendMessageToChat = async (chatId, messageData) => {
    try {
      const response = await axios.post(`https://aiready.azurewebsites.net/messages?chat_id=${chatId}`, messageData);
      console.log("Mensagem enviada para o chat:", response.data);
      await getChatsFromAPI();
    } catch (error) {
      console.error("Erro ao enviar a mensagem para o chat:", error);
    }
  };
  
  const handleCreateChatHistory = async () => {
    const title = "New Chat";
    const description = "---------";
    const newChat = {
      title: title,
      description: description,
      id: nanoid(),
      owner_id: "5",
      messages: [],
    };
    try {
      await sendChatsToAPI(newChat);
    } catch (error) {
      console.error("Erro ao enviar novo chat para a API:", error);
    }
    //atualiza a lista de chats dps de enviar um novo chat para a API
  };
  
  const handleSendMessage = async (chatId, message) => {
    const messageData = {
      text: message,
      timestamp: Date.now(),
      sender_id: "5",
    };
    try {
      await sendMessageToChat(chatId, messageData);
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);
    }
  };
  
  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      const file = uploaderRef.current?.files[0];
      formData.append("file", file);
  
      const response = await axios.post("https://aiready.azurewebsites.net/uploadfile/", formData, {headers:{"Content-Type":"application/pdf"}});
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
    }
  };

  return (
    <main className="main-page">
      <aside className="sidebar">
        <button type="button" className="new-chat" onClick={handleCreateChatHistory}>
          <HiOutlinePlus style={{ fontSize: '15px' }}/>
          Novo Chat
        </button>
        <button type="button" className="delete">
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
      <input ref={uploaderRef} type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
    </main>
  );
};


export default Chatbot;
