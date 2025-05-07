// AppContextProvider.tsx
import React from "react";
import { UsersProvider } from "./UsersContextProvider";
import { GameStateProvider } from "./GameStateContextProvider";

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <GameStateProvider>
      <UsersProvider>{children}</UsersProvider>
    </GameStateProvider>
  );
};

export { AppContextProvider };
