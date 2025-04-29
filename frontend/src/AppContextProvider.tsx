import React, { useState } from "react";

export interface AppContextType {
  isGuest: boolean;
  setIsGuest: (value: boolean) => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isGuest, setIsGuest] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ isGuest, setIsGuest }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
