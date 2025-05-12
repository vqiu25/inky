import { useContext, useEffect, useState } from "react";
import styles from "../../assets/css-modules/TurnEnd.module.css";
import { GameStateContext } from "../../context/GameStateContext";
import { socket } from "../../services/socket";
import { Line } from "rc-progress";

interface TurnEndProps {
  timeOut: boolean;
}

export default function TurnEnd({ timeOut }: TurnEndProps) {
  const { wordToGuess } = useContext(GameStateContext)!;
  const [timeRemaining, setTimeRemaining] = useState(5);

  useEffect(() => {
    socket.on("next-turn-timer", (duration: number) => {
      setTimeRemaining(duration);
    });

    return () => {
      socket.off("next-turn-timer");
    };
  }, [setTimeRemaining]);

  return (
    <div className={styles.turnEndContainer}>
      <>
        <div className={styles.turnEndText}>
          {timeOut ? "Time's up!" : "Everyone guessed the word!"}
          <br />
          The word was:{" "}
          <span className={styles.wordToGuess}>{wordToGuess}</span>
          <Line
            percent={timeRemaining ? (timeRemaining / 4) * 100 : 0}
            strokeWidth={4}
            strokeColor="#b1b5e0"
            trailWidth={4}
            style={{ marginTop: "20px" }}
          />
        </div>
      </>
    </div>
  );
}
