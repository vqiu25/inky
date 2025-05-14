import React, {
  useEffect,
  useState,
  useRef,
  FormEvent,
  useContext,
} from "react";
import { socket } from "../../services/socket";
import { ChatMessage, User } from "../../types/types";
import styles from "../../assets/css-modules/GameChat.module.css";
import planeIcon from "../../assets/images/plane.svg";
import { GameStateContext } from "../../context/GameStateContext";
import useCurrentUser from "../../hooks/useCurrentUser";

const Chat: React.FC = () => {
  const currentUser = useCurrentUser();
  const { wordToGuess, currentDrawer, timeRemaining } =
    useContext(GameStateContext)!;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [haveGuessed, setHaveGuessed] = useState(false);

  const username = currentUser?.username ?? "Anonymous";

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

  useEffect(() => {
    socket.on("new-turn", () => {
      setMessages([]);
      setHaveGuessed(false);
    });
    return () => {
      socket.off("new-turn");
    };
  }, []);

  useEffect(() => {
    socket.on("word-guessed", (player: User) => {
      const message = {
        username: "System",
        text: `${player.username} has guessed the word!`,
      };
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off("word-guessed");
    };
  }, []);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const text = currentMessage.trim();
    if (!text) return;
    let message: ChatMessage | null = null;

    if (text.toLowerCase().includes(wordToGuess.toLowerCase())) {
      if (currentUser?._id !== currentDrawer?._id) {
        // Guesser case
        if (text.toLowerCase() === wordToGuess.toLowerCase()) {
          // If they have actually guessed the word and not previously guessed
          if (!haveGuessed) {
            socket.emit("word-guessed", currentUser, timeRemaining);
            message = { username: username, text };
            setHaveGuessed(true);
          } else {
            // If they have already guessed the word
            message = {
              username: "System",
              text: `You have already guessed the word!`,
            };
          }
        } else {
          // If their answer contains the word
          message = { username: "System", text: `"${text}" is very close` };
        }
      } else {
        // Drawer case
        message = {
          username: "System",
          text: "Do not reveal the answer to the guessers!",
        };
      }
    } else {
      // Normal chat message
      message = { username: username, text };
      socket.emit("chat-data", message);
    }
    if (message) {
      setMessages((prev) => [...prev, message]);
    }
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
