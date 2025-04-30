import React, { useState } from "react";
import { Player, AppContextType } from "./types/types";

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playersList, setPlayersList] = useState<Player[]>([]);

  return (
    <AppContext.Provider value={{ playersList, setPlayersList }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
