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
import toast, { Toaster } from "react-hot-toast";

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

    socket.on("lobby-change", handleLobbyPlayer);

    return () => {
      socket.off("lobby-change", handleLobbyPlayer); // removes only this exact handler
    };
  }, [navigate, setNewPlayers]);

  function onClickPlay() {
    const callToast = (message: string) => {
      toast.error(message, {
        style: {
          padding: "16px",
          color: "#B1B5E0",
          background: "#282a35",
          borderRadius: "10px",
        },
        iconTheme: {
          primary: "#FF8686",
          secondary: "#FFFAEE",
        },
      });
    };

    if (!currentUser) return;

    socket.once("lobby-change", (newPlayers: User[]) => {
      setNewPlayers(newPlayers);
      navigate("/lobby");
    });
    socket.once("lobby-full", () => {
      callToast("Lobby is full. Please try again later.");
    });
    socket.once("game-in-progress", () => {
      callToast("Game is already in progress. Please try again later.");
    });

    socket.emit("player-join", currentUser);
  }

  function onClickLogout() {
    localStorage.removeItem("jwt");
    clearCurrentUser();
    navigate("/login");
  }

  return (
    <div className={styles.container}>
      <div>
        <Toaster />
      </div>
      <div style={{ marginBottom: "-30px" }}>
        <AnimatedLogo size={120} hoverThreshold={150} />
      </div>
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
