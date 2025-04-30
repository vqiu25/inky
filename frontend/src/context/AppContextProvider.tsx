// AppContextProvider.tsx
import React from "react";
import { PlayersProvider } from "./PlayersContextProvider";
import { UsersProvider } from "./UsersContextProvider";

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <PlayersProvider>
      <UsersProvider>{children}</UsersProvider>
    </PlayersProvider>
  );
};

export { AppContextProvider };
