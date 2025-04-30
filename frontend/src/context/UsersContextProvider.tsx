import React, { createContext, ReactNode } from "react";
import { User } from "../types/types";
import useGet from "../hooks/useGet";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface UsersContextType {
  users: User[];
  usersLoading: boolean;
  addUser: (
    username: string,
    profilePicture: string,
    email: string,
  ) => Promise<User>;
}

export const UsersContext = createContext<UsersContextType | undefined>(
  undefined,
);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    data: users,
    isLoading: usersLoading,
    refresh: refreshUsers,
  } = useGet<User[]>(`${API_BASE_URL}/api/users`, []);

  async function addUser(
    username: string,
    profilePicture: string,
    email: string,
  ): Promise<User> {
    const userToAdd = { username, profilePicture, email };
    const response = await axios.post<User>(
      `${API_BASE_URL}/api/users`,
      userToAdd,
    );
    refreshUsers();
    return response.data;
  }

  return (
    <UsersContext.Provider
      value={{ users: users ?? [], usersLoading, addUser }}
    >
      {children}
    </UsersContext.Provider>
  );
};
