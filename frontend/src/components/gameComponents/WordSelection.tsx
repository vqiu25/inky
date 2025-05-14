import { useContext, useEffect, useState } from "react";
import styles from "../../assets/css-modules/WordSelection.module.css";
import { GameStateContext } from "../../context/GameStateContext";
import { socket } from "../../services/socket";
import useCurrentUser from "../../hooks/useCurrentUser";

export default function WordSelection() {
  const currentUser = useCurrentUser();
  const { currentDrawer, isSelectingWord, phrases } =
    useContext(GameStateContext)!;

  const [wordsToSelect, setWordsToSelect] = useState<string[]>([]);
  const [wordSelected, setWordSelected] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(5);

  useEffect(() => {
    if (!currentUser) return;
    let timeout: NodeJS.Timeout | null = null;
    let interval: NodeJS.Timeout | null = null;

    if (
      isSelectingWord &&
      currentUser?._id === currentDrawer?._id &&
      phrases?.length > 0
    ) {
      console.log("allWords", phrases);
      const wordsCopy = [...phrases];
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
  }, [currentUser, currentDrawer, phrases, isSelectingWord, wordSelected]);

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
