// AppContextProvider.tsx
import React from "react";
import { UsersProvider } from "./UsersContextProvider";
import { GameStateProvider } from "./GameStateContextProvider";
import { AuthContextProvider } from "./AuthContextProvider";

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthContextProvider>
      <GameStateProvider>
        <UsersProvider>{children}</UsersProvider>
      </GameStateProvider>
    </AuthContextProvider>
  );
};

export { AppContextProvider };
