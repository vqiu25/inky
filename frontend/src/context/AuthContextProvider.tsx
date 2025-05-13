import { ReactNode, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Progress, User } from "../types/types";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
export interface AuthContextType {
  getJwt: () => string | null;
  setJwt: (jwt: string) => void;
  clearJwt: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  getUserByEmail: (email: string) => Promise<User>;
  isJwtValid: () => Promise<boolean>;
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

  /**
   * Fetches a user using their email.
   *
   * @param email - The user's email address.
   * @returns The user matching the email.
   */
  async function getUserByEmail(email: string): Promise<User> {
    try {
      const response = await axios.get<User>(
        `${API_BASE_URL}/api/users?email=${email}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user with email ${email}:`, error);
      throw error;
    }
  }

  async function isJwtValid(): Promise<boolean> {
    try {
      const jwt = getJwt();
      if (!jwt) {
        return false;
      }
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeCheck = payload.exp && currentTime < payload.exp;
      const userCheck = await getUserByEmail(payload.email);
      return timeCheck && !!userCheck;
    } catch (error) {
      console.error("Failed to decode JWT:", error, "returning false");
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
        getUserByEmail,
        isJwtValid,
        progress,
        setProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
