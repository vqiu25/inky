import { Outlet } from "react-router-dom";
import Chat from "../components/Chat";
import styles from "../assets/GamePage.module.css";

export default function GamePage() {
  return (
    <div>
      <h1>Game Page</h1>
      <p>Welcome to the game!</p>
      <div className={styles.flexContainer}>
        <div className={styles.canvasWrapper}>
          <Outlet />
        </div>
        <div className={styles.chatWrapper}>
          <Chat />
        </div>
      </div>
    </div>
  );
}
