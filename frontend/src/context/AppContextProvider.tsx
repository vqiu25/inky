import React from "react";
import { UsersContextProvider } from "./UsersContextProvider";
import { GameStateContextProvider } from "./GameStateContextProvider";
import { AuthContextProvider } from "./AuthContextProvider";

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthContextProvider>
      <GameStateContextProvider>
        <UsersContextProvider>{children}</UsersContextProvider>
      </GameStateContextProvider>
    </AuthContextProvider>
  );
};

export { AppContextProvider };
