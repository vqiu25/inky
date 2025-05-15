import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Progress, User } from "../types/types";
import styles from "../assets/css-modules/LobbyPage.module.css";
import PageHeader from "../components/layoutComponents/PageHeader";
import UserInfo from "../components/userInfoComponents/UserInfo";
import InfoPill from "../components/userInfoComponents/InfoPill";
import { socket } from "../services/socket";
import { GameStateContext } from "../context/GameStateContext";
import LoadingSpinner from "../components/layoutComponents/LoadingSpinner";
import spinnerStyles from "../assets/css-modules/LoadingSpinner.module.css";
import { AuthContext } from "../context/AuthContext";
import useCurrentUser from "../hooks/useCurrentUser";
import { Tooltip } from "react-tooltip";

export default function LobbyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();
  const { setNewPlayers, lobbyPlayers, setCurrentDrawer, setWordToGuess } =
    useContext(GameStateContext)!;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setProgress } = useContext(AuthContext)!;
  const canStart = lobbyPlayers.length >= 3;
  const tooltipId = "enter-game-tip";

  useEffect(() => {
    setProgress(Progress.LOBBY);
  }, [setProgress]);

  // Get the current user
  useEffect(() => {
    setIsLoading(currentUser === null);
  }, [currentUser]);

  // Get the list of players in the lobby
  useEffect(() => {
    const handleLobbyPlayer = (newPlayers: User[]) => {
      setNewPlayers(newPlayers);
    };

    socket.on("lobby-change", handleLobbyPlayer);

    return () => {
      socket.off("lobby-change", handleLobbyPlayer); // removes only this exact handler
    };
  }, [setNewPlayers]);

  useEffect(() => {
    const handleDrawerSelect = (drawer: User) => {
      setCurrentDrawer(drawer);
      navigate("/play");
    };

    socket.on("drawer-select", handleDrawerSelect);

    return () => {
      socket.off("drawer-select", handleDrawerSelect);
    };
  }, [navigate, setCurrentDrawer]);

  function handleLeaveLobby() {
    socket.emit("player-leave", currentUser);
  }

  useEffect(() => {
    window.addEventListener("popstate", handleLeaveLobby);
    window.addEventListener("beforeunload", handleLeaveLobby);

    return () => {
      setTimeout(() => {
        window.removeEventListener("popstate", handleLeaveLobby);
        window.removeEventListener("beforeunload", handleLeaveLobby);
      }, 0);
    };
  });

  useEffect(() => {
    if (location.pathname !== "/lobby") {
      handleLeaveLobby();
    }
  }, [location.pathname]);

  function onStartGame() {
    setWordToGuess("");
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
          <span
            style={{ display: "inline-block" }}
            {...(!canStart && {
              // only attach tooltip when needed
              "data-tooltip-id": tooltipId,
              "data-tooltip-content": "Not enough players",
            })}
          >
            <button
              className={styles.button}
              onClick={() => onStartGame()}
              disabled={!canStart}
            >
              Enter Game
            </button>
          </span>
          <Tooltip id={tooltipId} />
        </div>
      )}
    </div>
  );
}
