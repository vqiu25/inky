import React, { createContext, useState, ReactNode } from "react";
import { Player } from "../types/types";

interface PlayersContextType {
  playersList: Player[];
  setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
  currentPlayer: Player | null;
  setCurrentPlayer: (p: Player) => void;
}

export const PlayersContext = createContext<PlayersContextType | undefined>(
  undefined,
);

export const PlayersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  return (
    <PlayersContext.Provider
      value={{ playersList, setPlayersList, currentPlayer, setCurrentPlayer }}
    >
      {children}
    </PlayersContext.Provider>
  );
};

export default PlayersContext;
