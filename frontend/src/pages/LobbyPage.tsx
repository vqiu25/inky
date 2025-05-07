import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UsersContext } from "../context/UsersContext";
import { User } from "../types/types";
import styles from "../assets/css-modules/LobbyPage.module.css";
import PageHeader from "../components/layoutComponents/PageHeader";
import UserInfo from "../components/userInfoComponents/UserInfo";
import InfoPill from "../components/userInfoComponents/InfoPill";
import { socket } from "../services/socket";
import { GameStateContext } from "../context/GameStateContext";

export default function LobbyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserByEmail, refreshUsers } = useContext(UsersContext)!;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { setNewPlayers, lobbyPlayers } = useContext(GameStateContext)!;

  // Get the current user
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const email = JSON.parse(storedUser).email;
        const updatedUser = await getUserByEmail(email);
        setCurrentUser(updatedUser);
      }
    };

    fetchUser();
  }, [location, getUserByEmail, refreshUsers]);

  // Get the list of players in the lobby
  useEffect(() => {
    const handleLobbyPlayer = (newPlayers: User[]) => {
      console.log(
        "I'm a client in the lobby and got players",
        newPlayers.length,
      );
      setNewPlayers(newPlayers);
    };

    socket.on("lobby-change", handleLobbyPlayer);

    return () => {
      socket.off("lobby-change", handleLobbyPlayer); // removes only this exact handler
    };
  }, []);

  return (
    <div>
      <PageHeader exitLobby={true}>Lobby</PageHeader>
      <div className={styles.container}>
        {lobbyPlayers.map((player) => (
          <InfoPill
            key={player._id}
            children={
              <UserInfo
                user={player}
                isCurrent={currentUser?.email === player.email}
              />
            }
            className="darkBackground"
            style={{ minWidth: "450px", paddingInlineEnd: "10px" }}
          />
        ))}
        <div style={{ height: "20px" }}></div>
        <button className={styles.button} onClick={() => navigate("/play")}>
          Enter Game
        </button>
      </div>
    </div>
  );
}
