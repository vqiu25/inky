import "../App.css";
import logo from "../assets/images/logo.svg";
import infoIcon from "../assets/images/info.svg";
import InfoPopup from "../components/homeComponents/InfoPopup";
import styles from "../assets/css-modules/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GameStateContext } from "../context/GameStateContext";
import { socket } from "../services/socket";
import { Progress, User } from "../types/types";
import { AuthContext } from "../context/AuthContext";

function HomePage() {
  const { setNewPlayers } = useContext(GameStateContext)!;
  const navigate = useNavigate();
  const { setProgress } = useContext(AuthContext)!;
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setProgress(Progress.HOME);
  }, [setProgress]);

  function onClickLeaderboard() {
    navigate("/leaderboard");
  }

  useEffect(() => {
    const handleLobbyPlayer = (newPlayers: User[]) => {
      console.log(
        "I'm a client in the lobby and got players",
        newPlayers.length,
      );
      setNewPlayers(newPlayers);
    };

    const handleLobbyFull = (msg: string) => {
      console.log("I'm a client in the lobby and got this message D:", msg);
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

    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const currentUser: User = JSON.parse(storedUser);
      console.log("I'm joining a lobby now. I am", currentUser.username);

      socket.emit("player-join", currentUser);
    }
  }

  return (
    <div className={styles.container}>
      <img src={logo} className={styles.logo}></img>
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
      <img
        src={infoIcon}
        alt="Info"
        className={styles.infoButton}
        onClick={() => setShowInfo(true)}
      />
      {showInfo && <InfoPopup onClose={() => setShowInfo(false)} />}
    </div>
  );
}

export default HomePage;
