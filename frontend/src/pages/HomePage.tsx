import "../App.css";
import infoIcon from "../assets/images/info.svg";
import logoutIcon from "../assets/images/signout.svg";
import InfoPopup from "../components/homeComponents/InfoPopup";
import styles from "../assets/css-modules/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GameStateContext } from "../context/GameStateContext";
import { socket } from "../services/socket";
import { Progress, User } from "../types/types";
import { AuthContext } from "../context/AuthContext";
import useCurrentUser from "../hooks/useCurrentUser";
import AnimatedLogo from "../components/homeComponents/AnimatedLogo";
import { UsersContext } from "../context/UsersContext";

function HomePage() {
  const { setNewPlayers } = useContext(GameStateContext)!;
  const { clearCurrentUser } = useContext(UsersContext)!;
  const navigate = useNavigate();
  const { setProgress } = useContext(AuthContext)!;
  const [showInfo, setShowInfo] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    setProgress(Progress.HOME);
  }, [setProgress]);

  function onClickLeaderboard() {
    navigate("/leaderboard");
  }

  useEffect(() => {
    const handleLobbyPlayer = (newPlayers: User[]) => {
      setNewPlayers(newPlayers);
    };

    const handleLobbyFull = (msg: string) => {
      navigate("/home");
      alert("Lobby is full. Please try again later.");
    };

    socket.on("lobby-change", handleLobbyPlayer);
    socket.on("lobby-full", handleLobbyFull);

    return () => {
      socket.off("lobby-change", handleLobbyPlayer); // removes only this exact handler
      socket.off("lobby-full", handleLobbyFull); // removes only this exact handler
    };
  }, [navigate, setNewPlayers]);

  function onClickPlay() {
    navigate("/lobby");

    if (currentUser) {
      socket.emit("player-join", currentUser);
    }
  }

  function onClickLogout() {
    localStorage.removeItem("jwt");
    clearCurrentUser();
    navigate("/login");
  }

  return (
    <div className={styles.container}>
      <AnimatedLogo size={120} hoverThreshold={150} />
      <h1 className={styles.title}>Inky</h1>
      <button className={styles.button} onClick={() => onClickPlay()}>
        Play
      </button>
      <button className={styles.button} onClick={() => navigate("/profile")}>
        Profile
      </button>
      <button
        className={styles.leaderboardButton}
        onClick={() => onClickLeaderboard()}
      >
        Leaderboard
      </button>
      <div className={styles.buttonContainer}>
        <img
          src={infoIcon}
          alt="Info"
          className={styles.infoButton}
          onClick={() => setShowInfo(true)}
        />
        <img
          src={logoutIcon}
          alt="Logout"
          className={styles.infoButton}
          onClick={onClickLogout}
        />
      </div>
      {showInfo && <InfoPopup onClose={() => setShowInfo(false)} />}
    </div>
  );
}

export default HomePage;
