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

  useEffect(() => {
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
    }
  }, [currentUser, currentDrawer, allWords]);

  function handleWordSelection(word: string) {
    console.log("Selected word:", word);
    // Emit the selected word to the server
    socket.emit("word-selected", word);
  }

  return (
    <div className={styles.wordSelection}>
      {currentUser?._id === currentDrawer?._id ? (
        <div className={styles.wordSelectionText}>
          Select a word to draw!
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
        </div>
      ) : (
        <div>Waiting for the {currentDrawer?.username} to select a word...</div>
      )}
    </div>
  );
}
