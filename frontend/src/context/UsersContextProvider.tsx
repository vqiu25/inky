import React, { ReactNode, useContext, useState } from "react";
import { User } from "../types/types";
import axios from "axios";
import { UsersContext } from "./UsersContext";
import { AuthContext } from "./AuthContext";

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
  updateGamePlayer: (users: User) => Promise<User>;
  usersList: User[];
  setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
  getCurrentUser: () => Promise<User | null>;
  clearCurrentUser: () => void;
  updateCurrentUser: (user: User) => void;
  getUsers: () => Promise<User[]>;
}

/**
 * Provider component that manages and exposes users data and actions.
 *
 * @param children - React components that consume this provider.
 */
export const UsersContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const { getJwtEmail } = useContext(AuthContext);

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
   * Updates a game player and refreshes the users list.
   *
   * @param user - The user to update.
   * @returns The updated user.
   */
  async function updateGamePlayer(user: User): Promise<User> {
    const currentUser = await getCurrentUser();
    // Update the context
    if (currentUser && currentUser._id === user._id) {
      setUser(user);
    }
    try {
      // Update the database
      const response = await axios.patch<User>(
        `${API_BASE_URL}/api/users/${user._id}`,
        user,
      );
      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.data;
    } catch (error) {
      console.error("Error updating game players:", error);
      throw error;
    }
  }

  /**
   * Fetches the current user using the JWT email.
   *
   * @returns The current user or null if not found.
   */
  async function getCurrentUser(): Promise<User | null> {
    if (user) return user;

    const email = getJwtEmail();
    if (!email) throw new Error("No email found in JWT, are you logged in?");

    try {
      const { data: user } = await axios.get<User>(
        `${API_BASE_URL}/api/users`,
        {
          params: { email },
        },
      );
      if (user) {
        setUser(user);
        return user;
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }

    return null;
  }

  function clearCurrentUser() {
    setUser(null);
  }

  function updateCurrentUser(user: User) {
    setUser(user);
  }

  return (
    <UsersContext.Provider
      value={{
        addUser,
        refreshUsers,
        getUserById,
        updateGamePlayer,
        usersList,
        setUsersList,
        getCurrentUser,
        clearCurrentUser,
        updateCurrentUser,
        usersLoading,
        getUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
