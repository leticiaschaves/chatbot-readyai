import { useRef, useState } from "react";
import { fetchOpenAIResponse } from "../redux/actions/actions";
import { nanoid } from "nanoid";
import { HiOutlinePlus } from "react-icons/hi";
import ChatInput from "./ChatInput";
import ChatHistoryList from "./ChatHistoryList";
import ChatMessage from "./ChatMessage";
import RecordAudio from "./RecordAudio";
import "./Chatbot.css";

const Chatbot = () => {
  const uploaderRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [audioRecording, setAudioRecording] = useState(null); // Novo estado para o áudio gravado
  const [chatsHistory, setChatsHistory] = useState([
    {
      chatTitle: "Como usar o chatgpcubo",
      createdAt: Date.now(),
      id: nanoid(),
      loading: false,
    },
  ]);

  const disabled = chats.find((chat) => chat.sending);

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

    setChats((c) => [...c, newMeMessage]);

    try {
      const chatgptresposta = await fetchOpenAIResponse(chatInput, chats);
      console.log("user", chatInput);

      if (chatgptresposta.choices[0].message.type === "audio") {
        setAudioRecording(chatgptresposta.choices[0].message.url);
        // Send the audio transcription as a user message after 2 seconds
        setTimeout(() => {
          const userMessage = {
            id: nanoid(),
            message: chatgptresposta.choices[0].message.transcription,
            sentAt: Date.now(),
            sender: "me",
          };
          setChats((c) => [...c, userMessage]);
        }, 2000);
      } else {
        const botMessage = {
          id: nanoid(),
          message: chatgptresposta.choices[0].message.content,
          sentAt: Date.now(),
          sending: false,
          sender: "bot",
        };

        setChats((c) => [
          ...c.map((chat) =>
            chat.id === id ? { ...chat, sending: false } : chat
          ),
          botMessage,
        ]);
      }
    } catch (e) {
      const errorMessage = {
        id: nanoid(),
        message: "errei fui mlk",
        sentAt: Date.now(),
        sending: false,
        sender: "bot",
      };

      setChats((c) => [
        ...c.map((chat) =>
          chat.id === id ? { ...chat, sending: false } : chat
        ),
        errorMessage,
      ]);
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
  
  const handleAudioTranscription = async (audioTranscription) => {
    if (audioTranscription !== null) {
      if (audioTranscription !== null) {
        // Send the audio transcription as a user message
        const userMessage = {
          id: nanoid(),
          message: audioTranscription,
          sentAt: Date.now(),
          sender: "me",
        };
        setChats((c) => [...c, userMessage]);
      }
      await fetchAndDisplayResponse(audioTranscription);
    }
  };
  
  const fetchAndDisplayResponse = async (inputMessage) => {
    const chatgptresposta = await fetchOpenAIResponse(inputMessage, chats);
  
    console.log("user", inputMessage);
    console.log("bot", chatgptresposta.choices[0].message.content);

    const id = nanoid();
    const botMessage = {
      id: id,
      message: chatgptresposta.choices[0].message.content,
      sentAt: Date.now(),
      sending: false,
      sender: "bot",
    };

    setChats((c) => [
      ...c.map((chat) =>
        chat.id === id ? { ...chat, sending: false } : chat
      ),
      botMessage,
    ]);
  };  

  return (
    <main className="main-page">
      <aside className="sidebar">
        <button type="button" onClick={handleCreateChatHistory}>
          <HiOutlinePlus />
          New chat
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
        />
        <RecordAudio onAudioTranscription={handleAudioTranscription} />
      </div>
      <input ref={uploaderRef} type="file" />
    </main>
  );
};

export default Chatbot;
