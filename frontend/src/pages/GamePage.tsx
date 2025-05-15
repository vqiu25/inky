import { useContext, useEffect, useRef, useState } from "react";
import styles from "../assets/css-modules/GamePage.module.css";
import GameToolBar from "../components/gameComponents/GameToolBar";
import GamePowerups from "../components/gameComponents/GamePowerups";
import GameStatusBar from "../components/gameComponents/GameStatusBar";
import GamePlayerList from "../components/gameComponents/GamePlayerList";
import GameCanvasArea from "../components/gameComponents/GameCanvasArea";
import GameChat from "../components/gameComponents/GameChat";
import DrawerDisplay from "../components/gameComponents/DrawerDisplay";
import WordSelection from "../components/gameComponents/WordSelection";
import TurnEnd from "../components/gameComponents/TurnEnd";
import { GameStateContext } from "../context/GameStateContext";
import { socket } from "../services/socket";
import { GameState, Progress, User } from "../types/types";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useCurrentUser from "../hooks/useCurrentUser";

export default function GamePage() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const {
    isSelectingWord,
    setIsSelectingWord,
    setRound,
    setWordToGuess,
    setPlayerStates: setPlayerStates,
    currentDrawer,
    setCurrentDrawer,
    clearCanvas,
    isTurnFinished,
    setIsTurnFinished,
    setLobbyPlayers,
  } = useContext(GameStateContext);
  const [timedOut, setTimedOut] = useState(false);
  const [isCurrentUserDrawer, setIsCurrentUserDrawer] = useState(false);
  const { setProgress } = useContext(AuthContext);
  const currentUser = useCurrentUser();
  const [drawerLeft, setDrawerLeft] = useState(false);

  useEffect(() => {
    setProgress(Progress.GAME);
  }, [setProgress]);

  useEffect(() => {
    if (!currentUser) return;
    const el = wrapperRef.current;
    if (el) {
      const width = window.innerWidth * 0.95;
      const height = (width * 9) / 16;

      if (height > window.innerHeight * 0.95) {
        const maxHeight = window.innerHeight * 0.95;
        const adjustedWidth = (maxHeight * 16) / 9;
        el.style.width = `${adjustedWidth}px`;
        el.style.height = `${maxHeight}px`;
      } else {
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
      }
    }

    socket.on("new-turn", (gameState: GameState) => {
      setIsSelectingWord(false);
      setRound(gameState.round);
      setWordToGuess(gameState.wordToGuess);
      setPlayerStates(gameState.playerStates);
      clearCanvas();
    });

    setIsSelectingWord(true);
    setIsTurnFinished(false);
    setIsCurrentUserDrawer(currentUser?._id === currentDrawer?._id);
  }, [currentUser]);

  useEffect(() => {
    // Listen for when the scores are updated
    socket.on("new-scores", (playersPoints) => {
      setPlayerStates(playersPoints);
    });
    return () => {
      socket.off("new-scores");
    };
  });

  useEffect(() => {
    // Listen for when the turn ends
    socket.on("turn-end", (timeOut: boolean, drawerLeft: boolean) => {
      setIsTurnFinished(true);
      setTimedOut(timeOut);
      setDrawerLeft(drawerLeft);
    });

    return () => {
      socket.off("turn-end");
    };
  });

  // Get the list of players in the lobby
  useEffect(() => {
    const handleLobbyPlayer = (newPlayers: User[]) => {
      setLobbyPlayers(newPlayers);
    };

    // Listen for when a player joins or leaves the lobby
    socket.on("lobby-change", handleLobbyPlayer);

    return () => {
      socket.off("lobby-change", handleLobbyPlayer);
    };
  }, [setLobbyPlayers]);

  // useEffect for when a game finishes
  useEffect(() => {
    if (!currentUser) return;
    socket.on("game-finished", (gameState: GameState) => {
      setPlayerStates(gameState.playerStates);
      socket.emit("player-leave", currentUser);
      navigate("/podium");
    });
  }, [navigate, setPlayerStates, currentUser]);

  // useEffect for when the drawer selects a word
  useEffect(() => {
    if (!currentUser) return;
    const handleDrawerSelect = (drawer: User) => {
      setWordToGuess("");
      setCurrentDrawer(drawer);
      setIsSelectingWord(true);
      setIsTurnFinished(false);
      setIsCurrentUserDrawer(currentUser?._id === drawer._id);
    };

    socket.on("drawer-select", handleDrawerSelect);

    return () => {
      socket.off("drawer-select", handleDrawerSelect);
    };
  }, [setCurrentDrawer, currentUser]);

  return (
    <>
      {!isTurnFinished && isSelectingWord && <WordSelection />}
      {isTurnFinished && <TurnEnd timeOut={timedOut} drawerLeft={drawerLeft} />}
      <div ref={wrapperRef} className={styles.gameWrapper}>
        <div className={styles.gameGrid}>
          <GameStatusBar />

          <div className={styles.left}>
            <GamePlayerList />
            {!isCurrentUserDrawer && <GamePowerups />}
          </div>

          <GameCanvasArea />
          <GameChat />
          {currentDrawer?._id === currentUser?._id ? (
            <GameToolBar />
          ) : (
            <DrawerDisplay />
          )}
        </div>
      </div>
    </>
  );
}
