import React, { ReactNode, useState } from "react";
import { User } from "../types/types";
import { GameStateContext } from "./GameStateContext";
import { canvasRef } from "../components/gameComponents/Canvas";

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

  function setNewPlayers(newPlayers: User[]) {
    setLobbyPlayers(newPlayers);
    console.log("Lobby player", newPlayers.length);
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
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
