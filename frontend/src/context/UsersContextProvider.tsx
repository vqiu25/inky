import React, { ReactNode, useState } from "react";
import { User } from "../types/types";
import axios from "axios";
import { UsersContext } from "./UsersContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * Interface for the UsersContext values.
 */
export interface UsersContextType {
  usersLoading: boolean;
  addUser: (
    username: string,
    profilePicture: string,
    email: string,
  ) => Promise<User>;
  refreshUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<User>;
  getUserByEmail: (email: string) => Promise<User>;
  usersList: User[];
  setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
  setCurrentUser: (u: User) => void;
  setCurrentUserFromLocalStorage: () => Promise<void>;
  getUsers: () => Promise<User[]>;
}

/**
 * Provider component that manages and exposes users data and actions.
 *
 * @param children - React components that consume this provider.
 */
export const UsersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);

  async function refreshUsers() {
    await getUsers();
  }

  /**
   * Fetches all users.
   *
   * @returns An array of user objects.
   */
  async function getUsers(): Promise<User[]> {
    try {
      setUsersLoading(true);
      const response = await axios.get<User[]>(`${API_BASE_URL}/api/users`);
      const users = response.data;
      setUsersList(users);
      return users;
    } catch (error) {
      console.error(`Failed to fetch users`, error);
      throw error;
    } finally {
      setUsersLoading(false);
    }
  }

  /**
   * Adds a new user and refreshes the users list.
   *
   * @param username - The new user's username.
   * @param profilePicture - The path to the new user's profile picture.
   * @param email - The new user's email address.
   * @returns The created user.
   */
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

  /**
   * Fetches a user using their ID.
   *
   * @param id - The user's ID.
   * @returns The user matching the ID.
   */
  async function getUserById(id: string): Promise<User> {
    try {
      const response = await axios.get<User>(`${API_BASE_URL}/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user with ID ${id}:`, error);
      throw error;
    }
  }

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

  async function setCurrentUserFromLocalStorage(): Promise<void> {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const email = JSON.parse(storedUser).email;
      const updatedUser = await getUserByEmail(email);
      setCurrentUser(updatedUser);
    }
  }

  return (
    <UsersContext.Provider
      value={{
        addUser,
        refreshUsers,
        getUserById,
        getUserByEmail,
        usersList,
        setUsersList,
        currentUser,
        setCurrentUser,
        setCurrentUserFromLocalStorage,
        usersLoading,
        getUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
