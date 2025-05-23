import { useContext, useEffect, useState } from "react";
import { socket } from "../../services/socket";
import { GameStateContext } from "../../context/GameStateContext";
import styles from "../../assets/css-modules/WordReveal.module.css";
import useCurrentUser from "../../hooks/useCurrentUser";

type WordRevealProps = {
  isDrawer: boolean;
  revealWord: boolean;
};

export default function WordReveal({ isDrawer, revealWord }: WordRevealProps) {
  const { wordToGuess } = useContext(GameStateContext);
  const currentUser = useCurrentUser();
  const letters = wordToGuess.split("");

  // track which positions have been revealed
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    // reveal all letters if the drawer
    setRevealedIndices(
      isDrawer || revealWord ? letters.map((_, idx) => idx) : [],
    );
    // handler for server-driven reveals
    const handleReveal = ({
      index,
      userId,
    }: {
      index: number;
      userId: string;
    }) => {
      const isCurrentUser = currentUser?._id === userId;

      if ((userId && isCurrentUser) || !userId) {
        setRevealedIndices((prev) =>
          prev.includes(index) ? prev : [...prev, index],
        );
      }
    };

    socket.on("reveal-letter", handleReveal);
    return () => {
      socket.off("reveal-letter", handleReveal);
    };
  }, [wordToGuess, revealWord, isDrawer, currentUser]);

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
