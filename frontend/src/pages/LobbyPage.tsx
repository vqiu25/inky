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
import LoadingSpinner from "../components/layoutComponents/LoadingSpinner";
import spinnerStyles from "../assets/css-modules/LoadingSpinner.module.css";

export default function LobbyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    getUserByEmail,
    refreshUsers,
    currentUser,
    setCurrentUserFromLocalStorage,
  } = useContext(UsersContext)!;
  const { setNewPlayers, lobbyPlayers, setCurrentDrawer } =
    useContext(GameStateContext)!;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get the current user
  useEffect(() => {
    setIsLoading(true);
    setCurrentUserFromLocalStorage();
    setIsLoading(false);
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
  }, [setNewPlayers]);

  useEffect(() => {
    const handleDrawerSelect = (drawer: User) => {
      console.log("Drawer selected:", drawer.username);
      setCurrentDrawer(drawer);
      navigate("/play");
    };

    socket.on("drawer-select", handleDrawerSelect);

    return () => {
      socket.off("drawer-select", handleDrawerSelect);
    };
  }, [navigate]);

  function onStartGame() {
    socket.emit("game-start", lobbyPlayers);
  }

  return (
    <div>
      <PageHeader exitLobby={true}>Lobby</PageHeader>
      {isLoading ? (
        <div className={spinnerStyles.spinnerContainer}>
          <LoadingSpinner />
        </div>
      ) : (
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
          <button className={styles.button} onClick={() => onStartGame()}>
            Enter Game
          </button>
        </div>
      )}
    </div>
  );
}
