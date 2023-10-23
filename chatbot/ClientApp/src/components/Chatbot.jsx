import { useRef, useState } from "react";
import {
  HiCheck,
  HiOutlineChatAlt,
  HiOutlinePaperAirplane,
  HiOutlinePaperClip,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi";
import { FaRobot } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import { nanoid } from "nanoid";

import "./Chatbot.css";

const Chatbot = () => {
  const uploader = useRef(null);

  const [chats, setChats] = useState([]);
  const [chat_input, setChatInput] = useState("");
  const [chats_history, setChatsHistory] = useState([
    {
      chat_title: "Como usar o chatgpcubo",
      created_at: Date.now(),
      id: nanoid(),
      loading: false,
    },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chat_input) return;

    const id = nanoid();

    setChatInput("");
    setChats((c) => [
      ...c,
      {
        message: chat_input,
        sent_at: Date.now(),
        id,
        sending: true,
        sender: "me",
      },
    ]);

    await new Promise((res) => {
      setTimeout(res, 1000);
    });

    setChats((c) =>
      c.map((chat) => (chat.id === id ? { ...chat, sending: false } : chat))
    );

    await new Promise((res) => {
      setTimeout(res, 500);
    });

    setChats((c) => [
      ...c,
      {
        id: nanoid(),
        message: "oi eu sou o chatgpcubo",
        sent_at: Date.now(),
        sending: false,
        sender: "bot",
      },
    ]);
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
        chat_title: "New chat",
        created_at: Date.now(),
        id: nanoid(),
        loading: false,
      },
    ]);
  };

  const renderChats = () => (
    <ul>
      {chats.map(({ id, message, sending, sender }) =>
        sender === "me" ? (
          <li key={id} className="message me">
            <span>{message}</span>

            <div className={`state${sending ? " sending" : ""}`}>
              {!sending ? <HiCheck /> : <ImSpinner8 />}
            </div>
          </li>
        ) : (
          <li key={id} className="message bot">
            <FaRobot />

            <span>{message}</span>
          </li>
        )
      )}
    </ul>
  );

  const renderChatsHistory = () => (
    <ul>
      {chats_history.map(({ id, chat_title, loading }) => (
        <li key={id}>
          <a href={`?chat-id=${id}`}>
            <HiOutlineChatAlt />

            <span>{chat_title}</span>

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

  return (
<main className="main-page">
      <aside className="sidebar">
        <button type="button" onClick={handleCreateChatHistory}>
          <HiOutlinePlus />
          New chat
        </button>

        {renderChatsHistory()}
      </aside>

      <div className="main-chat-wrapper">
        {renderChats()}

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              label="message"
              placeholder="Send a message"
              onChange={(e) => setChatInput(e.target.value)}
              value={chat_input}
            />

            {uploader.current?.value && <span>{uploader.current?.value}</span>}

            <button
              className="form-button"
              type="button"
              onClick={() => {
                uploader.current.click();
              }}
            >
              <HiOutlinePaperClip />
            </button>

            <button
              className="form-button"
              type="submit"
              onClick={handleSubmit}
            >
              <HiOutlinePaperAirplane />
            </button>
          </div>
        </form>
      </div>
      <input ref={uploader} type="file" />
    </main>
  );
};

export default Chatbot;
