import "../App.css";
import logo from "../assets/images/logo.svg";
import styles from "../assets/css-modules/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UsersContext } from "../context/UsersContext";
import { GameStateContext } from "../context/GameStateContext";
import { socket } from "../services/socket";
import { User } from "../types/types";

function HomePage() {
  const { setNewPlayers } = useContext(GameStateContext)!;
  const navigate = useNavigate();
  const { refreshUsers, getUserByEmail } = useContext(UsersContext)!;

  function onClickLeaderboard() {
    navigate("/leaderboard");
    refreshUsers();
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

  async function onClickPlay() {
    navigate("/lobby");
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const email = JSON.parse(storedUser).email;
      const currentUser = await getUserByEmail(email);
      if (currentUser) {
        console.log("im join a lobby now. i am", currentUser.username);
        socket.emit("player-join", currentUser);
      }
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
    </div>
  );
}

export default HomePage;
