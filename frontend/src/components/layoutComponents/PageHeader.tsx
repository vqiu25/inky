import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css-modules/PageHeader.module.css";
import { socket } from "../../services/socket";
import backArrow from "../../assets/images/back-arrow.svg";
import useCurrentUser from "../../hooks/useCurrentUser";

interface PageHeaderProps {
  children: ReactNode;
  backTo?: string; // This is optional and it defaults to "/home"
  exitLobby?: boolean; // Set lobby field of player back to 0 if true
  marginTop?: string; // Optional margin top for the header
}

export default function PageHeader({
  children,
  backTo = "/home",
  exitLobby = false,
  marginTop = "",
}: PageHeaderProps) {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  // Function to handle back button click
  const handleBackButtonClick = async () => {
    navigate(backTo);
    if (exitLobby) {
      if (currentUser) {
        socket.emit("player-leave", currentUser);
      }
    }
  };

  return (
    <span
      className={styles.titleContainer}
      style={marginTop ? { marginTop } : {}}
    >
      <div className={styles.left}>
        <button
          className={styles.backButton}
          onClick={() => handleBackButtonClick()}
          data-testid="back-button"
        >
          <img src={backArrow} className={styles.arrow} />
        </button>
      </div>
      <h1>{children}</h1>
      <div className={styles.right}></div>
    </span>
  );
}
