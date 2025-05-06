// AppContextProvider.tsx
import React from "react";
import { UsersProvider } from "./UsersContextProvider";

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <UsersProvider>{children}</UsersProvider>;
};

export { AppContextProvider };
