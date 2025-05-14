import { useContext, useEffect, useState } from "react";
import styles from "../../assets/css-modules/WordSelection.module.css";
import { GameStateContext } from "../../context/GameStateContext";
import { UsersContext } from "../../context/UsersContext";
import useGet from "../../hooks/useGet";
import { Phrase } from "../../types/types";
import { socket } from "../../services/socket";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export default function WordSelection() {
  const { currentUser } = useContext(UsersContext)!;
  const { currentDrawer, isSelectingWord } = useContext(GameStateContext)!;

  const { data: allWords } = useGet<Phrase[]>(
    `${API_BASE_URL}/api/phrases`,
    [],
  ) ?? { data: [] };
  const [wordsToSelect, setWordsToSelect] = useState<string[]>([]);
  const [wordSelected, setWordSelected] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(5);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    let interval: NodeJS.Timeout | null = null;

    if (
      isSelectingWord &&
      currentUser?._id === currentDrawer?._id &&
      allWords &&
      allWords.length > 0
    ) {
      console.log("allWords", allWords);
      const wordsCopy = [...allWords];
      const selectedWords: string[] = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * wordsCopy.length);
        selectedWords.push(wordsCopy.splice(randomIndex, 1)[0].phrase);
      }
      setWordsToSelect(selectedWords);
      console.log("selectedWords", selectedWords);

      // Set a timeout to auto-select a random word after 5 seconds
      timeout = setTimeout(() => {
        if (!wordSelected) {
          const randomWord =
            selectedWords[Math.floor(Math.random() * selectedWords.length)];
          handleWordSelection(randomWord);
        }
      }, 5000);

      // Sets an interval to update the timer every second
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev > 0) return prev - 1;
          return 0;
        });
      }, 1000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [currentUser, currentDrawer, allWords, isSelectingWord, wordSelected]);

  function handleWordSelection(word: string) {
    setWordSelected(true);
    // Emit the selected word to the server
    socket.emit("word-selected", word);
  }

  return (
    <div className={styles.wordSelection}>
      {currentUser?._id === currentDrawer?._id ? (
        <div className={styles.wordSelectionText}>
          <div className={styles.wordSelectionTitle}>
            Select a word to draw!
          </div>
          <div className={styles.wordSelectionWords}>
            {wordsToSelect.map((word, index) => (
              <button
                key={index}
                className={styles.wordSelectionWord}
                onClick={() => handleWordSelection(word)}
              >
                {word}
              </button>
            ))}
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${timeRemaining > 0 ? ((timeRemaining - 1) / 4) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div className={styles.wordSelectionTitle}>
          Waiting for {currentDrawer?.username} to select a word...
        </div>
      )}
    </div>
  );
}
