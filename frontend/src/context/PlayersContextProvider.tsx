import React, { createContext, useState, ReactNode } from "react";
import { Player } from "../types/types";

interface PlayersContextType {
  playersList: Player[];
  setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
}

export const PlayersContext = createContext<PlayersContextType | undefined>(
  undefined,
);

export const PlayersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playersList, setPlayersList] = useState<Player[]>([]);

  return (
    <PlayersContext.Provider value={{ playersList, setPlayersList }}>
      {children}
    </PlayersContext.Provider>
  );
};

export default PlayersContext;
