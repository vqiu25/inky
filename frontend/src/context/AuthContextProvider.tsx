import { ReactNode, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Progress } from "../types/types";

export interface AuthContextType {
  getJwt: () => string | null;
  setJwt: (jwt: string) => void;
  clearJwt: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isJwtValid: () => boolean;
  progress: Progress | null;
  setProgress: React.Dispatch<React.SetStateAction<Progress | null>>;
}

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const getJwt = () => {
    return localStorage.getItem("jwt");
  };

  const setJwt = (jwt: string) => {
    localStorage.setItem("jwt", jwt);
  };

  const clearJwt = () => {
    localStorage.removeItem("jwt");
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);

  function isJwtValid(): boolean {
    try {
      const jwt = getJwt();
      if (!jwt) {
        return false;
      }
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp && currentTime < payload.exp;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return false;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        getJwt,
        setJwt,
        clearJwt,
        isAuthenticated,
        setIsAuthenticated,
        isJwtValid,
        progress,
        setProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
