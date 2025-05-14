import React, { ReactNode, useEffect, useState } from "react";
import { Phrase, User } from "../types/types";
import { GameStateContext } from "./GameStateContext";
import { canvasRef } from "../components/gameComponents/Canvas";
import useGet from "../hooks/useGet";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
/**
 * Interface for the UsersContext values.
 */
export interface GameStateContextType {
  lobbyPlayers: User[];
  setNewPlayers: (newPlayers: User[]) => void;
  currentDrawer: User | null;
  setCurrentDrawer: (drawer: User) => void;
  isSelectingWord: boolean;
  setIsSelectingWord: (isSelectingWord: boolean) => void;
  round: number;
  setRound: (round: number) => void;
  wordToGuess: string;
  setWordToGuess: (word: string) => void;
  playerPoints: [User, number][];
  setPlayerPoints: (playerPoints: [User, number][]) => void;
  timeRemaining: number | null;
  updateTime: (newTime: number) => void;
  clearCanvas: () => void;
  isTurnFinished: boolean;
  setIsTurnFinished: (isTurnFinished: boolean) => void;
  phrases: Phrase[];
}

/**
 * Provider component that manages and exposes users data and actions.
 *
 * @param children - React components that consume this provider.
 */
export const GameStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lobbyPlayers, setLobbyPlayers] = useState<User[]>([]);
  const [currentDrawer, setCurrentDrawer] = useState<User | null>(null);
  const [isSelectingWord, setIsSelectingWord] = useState(true);
  const [round, setRound] = useState(0);
  const [wordToGuess, setWordToGuess] = useState("");
  const [playerPoints, setPlayerPoints] = useState<[User, number][]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTurnFinished, setIsTurnFinished] = useState(false);
  const [phrases, setPhrases] = useState<Phrase[]>([]);

  function setNewPlayers(newPlayers: User[]) {
    setLobbyPlayers(newPlayers);
  }

  function updateTime(newTime: number) {
    setTimeRemaining(newTime);
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.clear();
      canvas.setBackgroundColor("white", () => canvas.renderAll());
    }
  };

  const { data: allWords } = useGet<Phrase[]>(
    `${API_BASE_URL}/api/phrases`,
    [],
  ) ?? { data: [] };

  useEffect(() => {
    setPhrases(allWords ?? []);
  }, [allWords]);

  return (
    <GameStateContext.Provider
      value={{
        lobbyPlayers,
        setNewPlayers,
        currentDrawer,
        setCurrentDrawer,
        isSelectingWord,
        setIsSelectingWord,
        round,
        setRound,
        wordToGuess,
        setWordToGuess,
        playerPoints,
        setPlayerPoints,
        timeRemaining,
        updateTime,
        clearCanvas,
        isTurnFinished,
        setIsTurnFinished,
        phrases,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
