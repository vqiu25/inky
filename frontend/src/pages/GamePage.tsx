import { useContext, useEffect, useRef } from "react";
import styles from "../assets/css-modules/GamePage.module.css";
import GameToolBar from "../components/gameComponents/GameToolBar";
import GamePowerups from "../components/gameComponents/GamePowerups";
import GameStatusBar from "../components/gameComponents/GameStatusBar";
import GamePlayerList from "../components/gameComponents/GamePlayerList";
import GameCanvasArea from "../components/gameComponents/GameCanvasArea";
import GameChat from "../components/gameComponents/GameChat";
import WordSelection from "../components/gameComponents/WordSelection";
import { GameStateContext } from "../context/GameStateContext";
import { socket } from "../services/socket";
import { GameState } from "../types/types";
import { UsersContext } from "../context/UsersContext";

export default function GamePage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const {
    isSelectingWord,
    setIsSelectingWord,
    setRound,
    setWordToGuess,
    setPlayerPoints,
    currentDrawer,
  } = useContext(GameStateContext)!;
  const { currentUser } = useContext(UsersContext)!;

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
    });

    setIsSelectingWord(true);
  }, []);

  return (
    <>
      {isSelectingWord && <WordSelection />}
      <div ref={wrapperRef} className={styles.gameWrapper}>
        <div className={styles.gameGrid}>
          <GameStatusBar />

          <div className={styles.left}>
            <GamePlayerList />
            <GamePowerups />
          </div>

          <GameCanvasArea />
          <GameChat />
          {currentDrawer?._id === currentUser?._id && <GameToolBar />}
        </div>
      </div>
    </>
  );
}
