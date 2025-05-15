import { useContext, useEffect, useState } from "react";
import styles from "../../assets/css-modules/TurnEnd.module.css";
import { GameStateContext } from "../../context/GameStateContext";
import { socket } from "../../services/socket";

interface TurnEndProps {
  timeOut: boolean;
  drawerLeft: boolean;
}

export default function TurnEnd({ timeOut, drawerLeft }: TurnEndProps) {
  const { wordToGuess } = useContext(GameStateContext);
  const [timeRemaining, setTimeRemaining] = useState<number>(5);

  useEffect(() => {
    socket.on("next-turn-timer", (duration: number) => {
      setTimeRemaining(duration);
    });
    return () => {
      socket.off("next-turn-timer");
    };
  }, []);

  return (
    <div className={styles.turnEndContainer}>
      <div className={styles.turnEndText}>
        {drawerLeft
          ? "The drawer left the game!"
          : timeOut
            ? "Time's up!"
            : "Everyone guessed the word!"}
        {wordToGuess && (
          <>
            <br />
            The word was:{" "}
            <span className={styles.wordToGuess}>{wordToGuess}</span>
          </>
        )}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${timeRemaining > 0 ? ((timeRemaining - 1) / 4) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
