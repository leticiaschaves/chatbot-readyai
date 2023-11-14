import React, { useRef, useState, useEffect } from "react";
import { fetchOpenAIResponse } from "../redux/actions/actions";
import { nanoid } from "nanoid";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import ChatInput from "./ChatInput";
import ChatHistoryList from "./ChatHistoryList";
import ChatMessage from "./ChatMessage";
import { saveChat } from "./api";
import "./Chatbot.css";

const Chatbot = () => {
  const uploaderRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [audioRecording, setAudioRecording] = useState(null);
  const [chatTitle, setChatTitle] = useState('Novo Chat');
  const [chatsHistory, setChatsHistory] = useState(() => {
    const storedChatsHistory = localStorage.getItem("chatsHistory");
    return storedChatsHistory
      ? JSON.parse(storedChatsHistory)
      : [
          {
            chatTitle: "Como usar o chatbot",
            createdAt: Date.now(),
            id: nanoid(),
            messages: [],
          },
        ];
  });
  const [activeChatId, setActiveChatId] = useState(chatsHistory[0]?.id);

  useEffect(() => {
    localStorage.setItem("chatsHistory", JSON.stringify(chatsHistory));
  }, [chatsHistory]);

  const handleCreateChatHistory = () => {
    const newChat = {
      chatTitle: chatTitle,
      createdAt: Date.now(),
      id: nanoid(),
      messages: [],
    };

    setChatsHistory((prevChatsHistory) => [...prevChatsHistory, newChat]);
  };

const handleRemoveChatHistory = (id) => {
  setChatsHistory((prevChatsHistory) => {
    const deletedChat = prevChatsHistory.find((chat) => chat.id === id);

    // Remover as mensagens associadas ao chat excluído
    setChats((prevChats) =>
      prevChats.filter((chat) => chat.chatId !== id)
    );

    return prevChatsHistory.filter((chat) => chat.id !== id);
  });

  setActiveChatId(chatsHistory[0]?.id);
};
  const handleDeleteAllMessages = () => {
    setChats([]);
    setChatsHistory([]);
    localStorage.removeItem("chatsHistory");
    setActiveChatId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chatInput) return;

    const id = nanoid();
    setChatInput("");

    const newMeMessage = {
      message: chatInput,
      sentAt: Date.now(),
      id,
      sending: true,
      sender: "me",
      type: "text",
      chatId: activeChatId,
    };

    setChats((prevChats) => [...prevChats, newMeMessage]);

    try {
      const chatgptresposta = await fetchOpenAIResponse(chatInput, chats);

      if (chatgptresposta.choices[0].message.type === "audio") {
        setAudioRecording(chatgptresposta.choices[0].message.url);

        setTimeout(() => {
          const userMessage = {
            id: nanoid(),
            message: chatgptresposta.choices[0].message.transcription,
            sentAt: Date.now(),
            sender: "me",
            type: "text",
            chatId: activeChatId,
          };

          setChats((prevChats) => [...prevChats, userMessage]);

          setChatsHistory((prevChatsHistory) => {
            const currentChatIndex = prevChatsHistory.findIndex(
              (chat) => chat.id === activeChatId
            );
            const updatedChat = {
              ...prevChatsHistory[currentChatIndex],
              messages: [
                ...prevChatsHistory[currentChatIndex].messages,
                newMeMessage,
                userMessage,
              ],
            };
            return [
              ...prevChatsHistory.slice(0, currentChatIndex),
              updatedChat,
              ...prevChatsHistory.slice(currentChatIndex + 1),
            ];
          });

          localStorage.setItem(
            "chatsHistory",
            JSON.stringify(chatsHistory)
          );
        }, 2000);
      } else {
        const botMessage = {
          id: nanoid(),
          message: chatgptresposta.choices[0].message.content,
          sentAt: Date.now(),
          sending: false,
          sender: "bot",
          type: "text",
          chatId: activeChatId,
        };

        setChats((prevChats) => [...prevChats, botMessage]);

        saveChat({
          user: chatInput,
          bot: chatgptresposta.choices[0].message.content,
        });

        setChatsHistory((prevChatsHistory) => {
          const currentChatIndex = prevChatsHistory.findIndex(
            (chat) => chat.id === activeChatId
          );
          const updatedChat = {
            ...prevChatsHistory[currentChatIndex],
            messages: [
              ...prevChatsHistory[currentChatIndex].messages,
              newMeMessage,
              botMessage,
            ],
          };
          return [
            ...prevChatsHistory.slice(0, currentChatIndex),
            updatedChat,
            ...prevChatsHistory.slice(currentChatIndex + 1),
          ];
        });

        localStorage.setItem(
          "chatsHistory",
          JSON.stringify(chatsHistory)
        );

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === newMeMessage.id ? { ...chat, sending: false } : chat
          )
        );
      }
    } catch (e) {
      const errorMessage = {
        id: nanoid(),
        message: "errei fui mlk",
        sentAt: Date.now(),
        sending: false,
        sender: "bot",
        chatId: activeChatId,
      };

      setChats((prevChats) => [...prevChats, errorMessage]);
    }
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
      chatId: activeChatId,
    };

    setChats((prevChats) => [...prevChats, userMessage]);

    await fetchAndDisplayResponse(audioTranscription, userMessage.id);

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === userMessage.id ? { ...chat, sending: false } : chat
      )
    );
  };

  const fetchAndDisplayResponse = async (inputMessage, messageId) => {
    const chatgptresposta = await fetchOpenAIResponse(inputMessage, chats);

    const id = nanoid();
    const botMessage = {
      id: id,
      message: chatgptresposta.choices[0].message.content,
      sentAt: Date.now(),
      sending: false,
      sender: "bot",
      chatId: activeChatId,
    };

    setChats((prevChats) => [
      ...prevChats.map((chat) =>
        chat.id === messageId ? { ...chat, sending: false, type: "text" } : chat
      ),
      botMessage,
    ]);
  };

  return (
    <main className="main-page">
      <aside className="sidebar">
        <button type="button" className="new-chat" onClick={handleCreateChatHistory}>
          <HiOutlinePlus style={{ fontSize: '15px' }} />
          Novo Chat
        </button>
        <button 
        type="button" 
        className="delete" 
        onClick={handleDeleteAllMessages}>
          <HiOutlineTrash style={{ fontSize: '15px' }}/>
          Apagar tudo
        </button>
        <ChatHistoryList
          chatsHistory={chatsHistory}
          handleRemoveChatHistory={handleRemoveChatHistory}
          setActiveChatId={setActiveChatId}
        />
      </aside>
      <div className="main-chat-wrapper">
        <ChatMessage
          chats={chats}
          setChats={setChats}
          audioRecording={audioRecording}
          activeChatId={activeChatId}
        />
        <ChatInput
          chatInput={chatInput}
          setChatInput={setChatInput}
          uploaderRef={uploaderRef}
          handleSubmit={handleSubmit}
          handleAudioTranscription={handleAudioTranscription}
          activeChatId={activeChatId}
        />
      </div>
      <input ref={uploaderRef} type="file" />
    </main>
  );
};

export default Chatbot;




// import React, { useRef, useState } from "react";
// import { fetchOpenAIResponse } from "../redux/actions/actions";
// import { nanoid } from "nanoid";
// import { HiOutlinePlus } from "react-icons/hi";
// import ChatInput from "./ChatInput";
// import ChatHistoryList from "./ChatHistoryList";
// import ChatMessage from "./ChatMessage";
// import { saveChat } from "./api";
// import "./Chatbot.css";

// const Chatbot = () => {
//   const uploaderRef = useRef(null);
//   const [chats, setChats] = useState([]);
//   const [chatInput, setChatInput] = useState("");
//   const [audioRecording, setAudioRecording] = useState(null); // Novo estado para o áudio gravado
//   const [chatsHistory, setChatsHistory] = useState([
//     {
//       chatTitle: "Como usar o chatbot",
//       createdAt: Date.now(),
//       id: nanoid(),
//       loading: false,
//     },
//   ]);

//   const disabled = chats.find((chat) => chat.sending);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!chatInput || disabled) return;

//     const id = nanoid();
//     setChatInput("");

//     const newMeMessage = {
//       message: chatInput,
//       sentAt: Date.now(),
//       id,
//       sending: true,
//       sender: "me",
//       type: "text",
//     };

//     setChats((c) => [...c, newMeMessage]);

//     try {
//       const chatgptresposta = await fetchOpenAIResponse(chatInput, chats);

//       if (chatgptresposta.choices[0].message.type === "audio") {
//         setAudioRecording(chatgptresposta.choices[0].message.url);
//         // Send the audio transcription as a user message after 2 seconds
//         setTimeout(() => {
//           const userMessage = {
//             id: nanoid(),
//             message: chatgptresposta.choices[0].message.transcription,
//             sentAt: Date.now(),
//             sender: "me",
//             type: "text",
//           };
//           setChats((c) => [...c, userMessage]);
//         }, 2000);
//       } else {
//         const botMessage = {
//           id: nanoid(),
//           message: chatgptresposta.choices[0].message.content,
//           sentAt: Date.now(),
//           sending: false,
//           sender: "bot",
//           type: "text",
//         };

//         setChats((c) => [
//           ...c.map((chat) =>
//             chat.id === id ? { ...chat, sending: false } : chat
//           ),
//           botMessage,
//         ]);
//               // Salve a conversa no histórico
//       saveChat({ user: chatInput, bot: chatgptresposta.choices[0].message.content });
//       }
//     } catch (e) {
//       const errorMessage = {
//         id: nanoid(),
//         message: "errei fui mlk",
//         sentAt: Date.now(),
//         sending: false,
//         sender: "bot",
//       };

//       setChats((c) => [
//         ...c.map((chat) =>
//           chat.id === id ? { ...chat, sending: false } : chat
//         ),
//         errorMessage,
//       ]);
//     }
//   };

//   const handleRemoveChatHistory = async (id) => {
//     setChatsHistory((c) =>
//       c.map((history) =>
//         history.id === id ? { ...history, loading: true } : history
//       )
//     );

//     await new Promise((res) => {
//       setTimeout(res, 1000);
//     });

//     setChatsHistory((c) => c.filter(({ id: chat_id }) => chat_id !== id));
//   };

//   const handleCreateChatHistory = () => {
//     setChatsHistory((h) => [
//       ...h,
//       {
//         chatTitle: "New chat",
//         createdAt: Date.now(),
//         id: nanoid(),
//         loading: false,
//       },
//     ]);
//   };

//   const handleAudioTranscription = async (audioTranscription, objectUrl) => {
//     // Send the audio transcription as a user message
//     const userMessage = {
//       id: nanoid(),
//       message: audioTranscription,
//       sentAt: Date.now(),
//       sender: "me",
//       type: "audio",
//       sending: true,
//       objectUrl,
//     };

//     setChats((c) => [...c, userMessage]);

//     await fetchAndDisplayResponse(audioTranscription);

//     setChats((c) =>
//       c.map((chat) =>
//         chat.id === userMessage.id ? { ...chat, sending: false } : chat
//       )
//     );
//   };

//   const fetchAndDisplayResponse = async (inputMessage) => {
//     const chatgptresposta = await fetchOpenAIResponse(inputMessage, chats);

//     const id = nanoid();
//     const botMessage = {
//       id: id,
//       message: chatgptresposta.choices[0].message.content,
//       sentAt: Date.now(),
//       sending: false,
//       sender: "bot",
//     };

//     setChats((c) => [
//       ...c.map((chat) =>
//         chat.id === id ? { ...chat, sending: false, type: "text" } : chat
//       ),
//       botMessage,
//     ]);
//   };

//   return (
//     <main className="main-page">
//       <aside className="sidebar">
//         <button type="button" onClick={handleCreateChatHistory}>
//           <HiOutlinePlus />
//           New chat
//         </button>
//         <ChatHistoryList
//           chatsHistory={chatsHistory}
//           handleRemoveChatHistory={handleRemoveChatHistory}
//         />
//       </aside>
//       <div className="main-chat-wrapper">
//         <ChatMessage chats={chats} audioRecording={audioRecording} />
//         <ChatInput
//           chatInput={chatInput}
//           setChatInput={setChatInput}
//           uploaderRef={uploaderRef}
//           handleSubmit={handleSubmit}
//           handleAudioTranscription={handleAudioTranscription}
//         />
//       </div>
//       <input ref={uploaderRef} type="file" />
//     </main>
//   );
// };

// export default Chatbot;
