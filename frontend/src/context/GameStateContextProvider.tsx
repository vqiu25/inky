import React, { ReactNode, useState } from "react";
import { User } from "../types/types";
import { GameStateContext } from "./GameStateContext";

/**
 * Interface for the UsersContext values.
 */
export interface GameStateContextType {
  lobbyPlayers: User[];
  setNewPlayers: (newPlayers: User[]) => void;
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

  function setNewPlayers(newPlayers: User[]) {
    setLobbyPlayers(newPlayers);
    console.log("Lobby player", newPlayers.length);
  }

  return (
    <GameStateContext.Provider
      value={{
        lobbyPlayers,
        setNewPlayers,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
