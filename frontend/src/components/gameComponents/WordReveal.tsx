import { useContext, useEffect, useState } from "react";
import { socket } from "../../services/socket";
import { GameStateContext } from "../../context/GameStateContext";
import styles from "../../assets/css-modules/WordReveal.module.css";

export default function WordReveal() {
  const { wordToGuess } = useContext(GameStateContext)!;
  const letters = wordToGuess.split("");

  // track which positions have been revealed
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  useEffect(() => {
    // whenever the word changes, start fresh
    setRevealedIndices([]);

    // handler for server-driven reveals
    const handleReveal = ({ index }: { index: number }) => {
      setRevealedIndices((prev) =>
        prev.includes(index) ? prev : [...prev, index],
      );
    };

    socket.on("reveal-letter", handleReveal);
    return () => {
      socket.off("reveal-letter", handleReveal);
    };
  }, [wordToGuess]);

  return (
    <div className={styles.wordReveal}>
      {letters.map((char, idx) => (
        <div key={idx} className={styles.letterBox}>
          {revealedIndices.includes(idx) ? char : "_"}
        </div>
      ))}
    </div>
  );
}
