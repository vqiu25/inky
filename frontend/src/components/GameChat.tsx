import React, {
  useEffect,
  useState,
  useRef,
  FormEvent,
  useContext,
} from "react";
import { socket } from "../services/socket";
import { ChatMessage } from "../types/types";
import { PlayersContext } from "../context/PlayersContextProvider";
import styles from "../assets/css-modules/GameChat.module.css";
import planeIcon from "../assets/images/plane.svg";

const Chat: React.FC = () => {
  const { currentPlayer } = useContext(PlayersContext)!;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const username = currentPlayer?.playerName ?? "Anonymous";

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            <strong>{msg.username}:</strong> <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
          <img src={planeIcon} alt="Send" className={styles.icon} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
