// ChatFunctions.js
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { fetchOpenAIResponse } from "../../redux/actions/actions";

export const useChat = () => {
  const [chats, setChats] = useState([]);
  
  const sendMessage = async (message, setChatInput) => {
    const id = nanoid();
    setChatInput("");

    const newMeMessage = {
      message: message,
      sentAt: Date.now(),
      id,
      sending: true,
      sender: "me",
      type: "text",
    };

    setChats((c) => [...c, newMeMessage]);

    try {
      const chatgptresposta = await fetchOpenAIResponse(message, chats);

      if (chatgptresposta.choices[0].message.type === "audio") {
        setAudioRecording(chatgptresposta.choices[0].message.url);
        // Send the audio transcription as a user message after 2 seconds
        setTimeout(() => {
          const userMessage = {
            id: nanoid(),
            message: chatgptresposta.choices[0].message.transcription,
            sentAt: Date.now(),
            sender: "me",
            type: "text",
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
          type: "text",
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
    setChatInput("");
  };

  const fetchAndDisplayResponse = async (inputMessage) => {
    const chatgptresposta = await fetchOpenAIResponse(inputMessage, chats);

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
        chat.id === id ? { ...chat, sending: false, type: "text" } : chat
      ),
      botMessage,
    ]);
  };

  const handleAudioTranscription = async (audioTranscription, objectUrl) => {
        const userMessage = {
          id: nanoid(),
          message: audioTranscription,
          sentAt: Date.now(),
          sender: "me",
          type: "audio",
          sending: true,
          objectUrl,
        };
    
        setChats((c) => [...c, userMessage]);
    
        await fetchAndDisplayResponse(audioTranscription);
    
        setChats((c) =>
          c.map((chat) =>
            chat.id === userMessage.id ? { ...chat, sending: false } : chat
          )
        );
  };

  return { chats, setChats, sendMessage, fetchAndDisplayResponse, handleAudioTranscription };
};
