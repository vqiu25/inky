import { createContext } from "react";
import { GameStateContextType } from "./GameStateContextProvider";

/**
 * Context to provide access to user data and users API calls.
 */
export const GameStateContext = createContext<GameStateContextType>(
  {} as GameStateContextType,
);
