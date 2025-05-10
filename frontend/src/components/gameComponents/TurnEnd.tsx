import { useContext } from "react";
import styles from "../../assets/css-modules/TurnEnd.module.css";
import { GameStateContext } from "../../context/GameStateContext";
import { socket } from "../../services/socket";

interface TurnEndProps {
  timeOut: boolean;
}

export default function TurnEnd({ timeOut }: TurnEndProps) {
  const { wordToGuess } = useContext(GameStateContext)!;

  function onContinue() {
    socket.emit("next-turn");
  }

  return (
    <div className={styles.turnEndContainer}>
      <div className={styles.turnEndText}>
        {timeOut ? "Time's up!" : "Everyone guessed the word!"}
        <br />
        The word was: <span className={styles.wordToGuess}>{wordToGuess}</span>
      </div>
      <button className={styles.button} onClick={() => onContinue()}>
        Continue
      </button>
    </div>
  );
}
