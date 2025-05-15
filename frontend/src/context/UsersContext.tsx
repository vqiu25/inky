import { createContext } from "react";
import { UsersContextType } from "./UsersContextProvider";

/**
 * Context to provide access to user data and users API calls.
 */
export const UsersContext = createContext<UsersContextType>(
  {} as UsersContextType,
);
