import { ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css-modules/PageHeader.module.css";
import { socket } from "../../services/socket";
import { UsersContext } from "../../context/UsersContext";
import backArrow from "../../assets/images/back-arrow.svg";

interface PageHeaderProps {
  children: ReactNode;
  backTo?: string; // This is optional and it defaults to "/home"
  exitLobby?: boolean; // Set lobby field of player back to 0 if true
}

export default function PageHeader({
  children,
  backTo = "/home",
  exitLobby = false,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const { currentUser } = useContext(UsersContext)!;

  const handleBackButtonClick = async () => {
    navigate(backTo);
    if (exitLobby) {
      if (currentUser) {
        console.log("im leave a lobby now. i am", currentUser.username);
        socket.emit("player-leave", currentUser);
      }
    }
  };

  return (
    <span className={styles.titleContainer}>
      <div className={styles.left}>
        <button
          className={styles.backButton}
          onClick={() => handleBackButtonClick()}
        >
          <img src={backArrow} className={styles.arrow} />
        </button>
      </div>
      <h1>{children}</h1>
      <div className={styles.right}></div>
    </span>
  );
}
