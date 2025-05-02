import React, { useEffect, useState, FormEvent, useContext } from "react";
import { socket } from "../services/socket";
import { ChatMessage } from "../types/types";
import { PlayersContext } from "../context/PlayersContextProvider";
import styles from "../assets/css-modules/Chat.module.css";

const Chat: React.FC = () => {
  const { currentPlayer } = useContext(PlayersContext)!;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const username = currentPlayer?.playerName ?? "Anonymous";

  useEffect(() => {
    socket.on("chat-data", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off("chat-data");
    };
  }, []);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const text = currentMessage.trim();
    if (!text) return;

    const message: ChatMessage = { username: username, text };
    socket.emit("chat-data", message);
    setMessages((prev) => [...prev, message]);
    setCurrentMessage("");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div key={idx} className={styles.message}>
            <strong>{msg.username}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className={styles.form}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type a message..."
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
