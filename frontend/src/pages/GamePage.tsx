import { useContext, useEffect, useRef, useState } from "react";
import styles from "../assets/css-modules/GamePage.module.css";
import GameToolBar from "../components/gameComponents/GameToolBar";
import GamePowerups from "../components/gameComponents/GamePowerups";
import GameStatusBar from "../components/gameComponents/GameStatusBar";
import GamePlayerList from "../components/gameComponents/GamePlayerList";
import GameCanvasArea from "../components/gameComponents/GameCanvasArea";
import GameChat from "../components/gameComponents/GameChat";
import WordSelection from "../components/gameComponents/WordSelection";
import TurnEnd from "../components/gameComponents/TurnEnd";
import { GameStateContext } from "../context/GameStateContext";
import { socket } from "../services/socket";
import { GameState, Progress, User } from "../types/types";
import { UsersContext } from "../context/UsersContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GamePage() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const {
    isSelectingWord,
    setIsSelectingWord,
    setRound,
    setWordToGuess,
    setPlayerPoints,
    currentDrawer,
    setCurrentDrawer,
    clearCanvas,
    isTurnFinished,
    setIsTurnFinished,
    setNewPlayers,
  } = useContext(GameStateContext)!;
  const { currentUser } = useContext(UsersContext)!;
  const [timedOut, setTimedOut] = useState(false);
  const [isCurrentUserDrawer, setIsCurrentUserDrawer] = useState(false);
  const { setProgress } = useContext(AuthContext)!;
  const [drawerLeft, setDrawerLeft] = useState(false);

  useEffect(() => {
    setProgress(Progress.GAME);
  }, [setProgress]);

  useEffect(() => {
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
      console.log("New turn started", gameState);
      setIsSelectingWord(false);
      setRound(gameState.round);
      setWordToGuess(gameState.wordToGuess);
      setPlayerPoints(gameState.playerPoints);
      clearCanvas();
    });

    setIsSelectingWord(true);
    setIsTurnFinished(false);
    setIsCurrentUserDrawer(currentUser?._id === currentDrawer?._id);
  }, []);

  useEffect(() => {
    socket.on("new-scores", (playersPoints) => {
      setPlayerPoints(playersPoints);
    });
    return () => {
      socket.off("new-scores");
    };
  });

  useEffect(() => {
    socket.on("turn-end", (timeOut: boolean, drawerLeft: boolean) => {
      console.log("Turn ended");
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
      setNewPlayers(newPlayers);
    };

    socket.on("lobby-change", handleLobbyPlayer);

    return () => {
      socket.off("lobby-change", handleLobbyPlayer);
    };
  }, [setNewPlayers]);

  useEffect(() => {
    console.log("Registering game-finished listener");
    socket.on("game-finished", (gameState: GameState) => {
      setPlayerPoints(gameState.playerPoints);
      socket.emit("player-leave", currentUser);
      navigate("/podium");
    });
  }, [navigate, setPlayerPoints]);

  useEffect(() => {
    const handleDrawerSelect = (drawer: User) => {
      setWordToGuess("");
      console.log("Drawer selected:", drawer.username);
      setCurrentDrawer(drawer);
      setIsSelectingWord(true);
      setIsTurnFinished(false);
      setIsCurrentUserDrawer(currentUser?._id === drawer._id);
    };

    socket.on("drawer-select", handleDrawerSelect);

    return () => {
      socket.off("drawer-select", handleDrawerSelect);
    };
  }, [setCurrentDrawer]);

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
          {currentDrawer?._id === currentUser?._id && <GameToolBar />}
        </div>
      </div>
    </>
  );
}
