import "@testing-library/jest-dom";
import { beforeAll, afterEach, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { UsersContext } from "../UsersContext";
import { UsersContextProvider } from "../UsersContextProvider";
import { useContext, useEffect, useState } from "react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { User } from "../../types/types";
import { AuthContext } from "../AuthContext";
import { AuthContextProvider } from "../AuthContextProvider";
import { createMockJwt } from "../../pages/__tests__/test-util";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// Sample users for testing
const users = [
  {
    _id: "1",
    email: "alice@gmail.com",
    username: "alice",
    profilePicture: "pic1.svg",
    totalGames: 0,
    totalPoints: 0,
    highScore: 0,
    totalWins: 0,
    powerups: {
      timeIncrease: 0,
      timeDecrease: 0,
      revealLetter: 0,
      inkSplatter: 0,
      scoreMultiplier: 0,
      eraseDrawing: 0,
    },
    achievements: {
      gameAchievement: false,
      pointsAchievement: false,
      powerupAchievement: false,
      winsAchievement: false,
      highScoreAchievement: false,
    },
  },
  {
    _id: "2",
    username: "bob",
    email: "bob@gmail.com",
    profilePicture: "pic2.svg",
    totalGames: 0,
    totalPoints: 0,
    highScore: 0,
    totalWins: 0,
    powerups: {
      timeIncrease: 0,
      timeDecrease: 0,
      revealLetter: 0,
      inkSplatter: 0,
      scoreMultiplier: 0,
      eraseDrawing: 0,
    },
    achievements: {
      gameAchievement: false,
      pointsAchievement: false,
      powerupAchievement: false,
      winsAchievement: false,
      highScoreAchievement: false,
    },
  },
];

// Mock a proper JWT that contains the user's email
const mockJwt = createMockJwt({
  email: users[0].email,
  name: users[0].username,
  exp: Math.floor(Date.now() / 1000) + 3600,
});

// Create a mock implementation of getJwtEmail to return the expected email
const mockGetJwtEmail = vi.fn().mockReturnValue("alice@gmail.com");

let axiosMock: MockAdapter;

beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

afterEach(() => {
  axiosMock.reset();
});

describe("UsersContextProvider tests", () => {
  it("Test getting/refreshing users", async () => {
    axiosMock.onGet(`${API_BASE_URL}/api/users`).reply(200, users);

    function TestComponent() {
      const { refreshUsers, usersList } = useContext(UsersContext);

      useEffect(() => {
        const fetchUsers = async () => {
          await refreshUsers();
        };
        fetchUsers();
      }, []);

      return (
        <div>
          <p>{usersList ? usersList.length : 0} users in list</p>
          {usersList &&
            usersList.map((user: User) => (
              <p key={user._id}>{user.username}</p>
            ))}
        </div>
      );
    }

    const { getByText } = render(
      <UsersContextProvider>
        <TestComponent />
      </UsersContextProvider>,
    );

    await waitFor(() => getByText("alice"), { timeout: 1000 });

    expect(axiosMock.history.get.length).toBe(1);
    expect(axiosMock.history.get[0].url).toBe(`${API_BASE_URL}/api/users`);

    expect(getByText("alice")).toBeInTheDocument();
    expect(getByText("bob")).toBeInTheDocument();
  });

  it("Test getting a single user", async () => {
    axiosMock.onGet(`${API_BASE_URL}/api/users/1`).reply(200, users[0]);

    function TestComponent({ id }: { id: string }) {
      const { getUserById } = useContext(UsersContext);
      const [user, setUser] = useState<User | null>(null);

      useEffect(() => {
        const fetchUser = async () => {
          setUser(await getUserById(id));
        };
        fetchUser();
      }, []);

      return <div>{user && <p>{user.username}</p>}</div>;
    }

    const { getByText } = render(
      <UsersContextProvider>
        <TestComponent id={"1"} />
      </UsersContextProvider>,
    );

    await waitFor(() => getByText("alice"), { timeout: 1000 });

    expect(axiosMock.history.get.length).toBe(1);
    expect(axiosMock.history.get[0].url).toBe(`${API_BASE_URL}/api/users/1`);

    expect(getByText("alice")).toBeInTheDocument();
  });

  it("Test adding a single user", async () => {
    axiosMock.onGet(`${API_BASE_URL}/api/users`).reply(200, [users[0]]);
    axiosMock.onPost(`${API_BASE_URL}/api/users`).reply(201, users[0]);

    function TestComponent({ user }: { user: User }) {
      const { usersList, addUser } = useContext(UsersContext);

      useEffect(() => {
        const createUser = async () => {
          await addUser(user.username, user.profilePicture, user.email);
        };
        createUser();
      }, []);

      return (
        <div>
          <p>{usersList ? usersList.length : 0} users in list</p>
          {usersList &&
            usersList.map((user: User) => (
              <p key={user._id}>{user.username}</p>
            ))}
        </div>
      );
    }

    const { getByText } = render(
      <AuthContextProvider>
        <UsersContextProvider>
          <TestComponent user={users[0]} />
        </UsersContextProvider>
      </AuthContextProvider>,
    );

    await waitFor(() => getByText("alice"), { timeout: 1000 });

    expect(axiosMock.history.post.length).toBe(1);
    expect(axiosMock.history.post[0].url).toBe(`${API_BASE_URL}/api/users`);

    expect(getByText("alice")).toBeInTheDocument();
  });

  it("Test updating a single user", async () => {
    axiosMock.onGet(`${API_BASE_URL}/api/users`).reply(200, [users[0]]);
    axiosMock
      .onPatch(`${API_BASE_URL}/api/users/1`)
      .reply(200, { ...users[0], username: "updated alice" });
    axiosMock
      .onGet(`${API_BASE_URL}/api/users?email=alice@gmail.com`)
      .reply(200, users[0]);

    function TestComponentBefore() {
      const { usersList, refreshUsers } = useContext(UsersContext);

      useEffect(() => {
        const fetchUser = async () => {
          await refreshUsers();
        };
        fetchUser();
      }, []);

      return (
        <div>
          <p>{usersList ? usersList.length : 0} users in list</p>
          {usersList &&
            usersList.map((user: User) => (
              <p key={user._id}>{user.username}</p>
            ))}
        </div>
      );
    }

    function TestComponentAfter({ user }: { user: User }) {
      const { usersList, updateGamePlayer, refreshUsers } =
        useContext(UsersContext);

      useEffect(() => {
        const updateUser = async () => {
          await updateGamePlayer(user);
          await refreshUsers();
        };
        updateUser();
      }, [updateGamePlayer, user]);

      return (
        <div>
          <p>{usersList ? usersList.length : 0} users in list</p>
          {usersList &&
            usersList.map((user: User) => (
              <p key={user._id}>{user.username}</p>
            ))}
        </div>
      );
    }

    function WrapperComponent({
      user,
      showBefore,
    }: {
      user: User;
      showBefore: boolean;
    }) {
      return (
        <AuthContext.Provider
          value={{
            getJwt: vi.fn().mockReturnValue(mockJwt),
            setJwt: vi.fn(),
            clearJwt: vi.fn(),
            isAuthenticated: true,
            setIsAuthenticated: vi.fn(),
            isJwtValid: vi.fn().mockResolvedValue(true),
            getJwtEmail: mockGetJwtEmail,
            progress: null,
            setProgress: vi.fn(),
            getUserByEmail: vi.fn().mockResolvedValue(users[0]),
          }}
        >
          <UsersContextProvider>
            {showBefore ? (
              <TestComponentBefore />
            ) : (
              <TestComponentAfter user={user} />
            )}
          </UsersContextProvider>
        </AuthContext.Provider>
      );
    }

    const { getByText, rerender } = render(
      <WrapperComponent
        user={{ ...users[0], username: "updated alice" }}
        showBefore={true}
      />,
    );

    await waitFor(() => getByText("alice"), { timeout: 1000 });

    // Check for the GET request
    expect(axiosMock.history.get.length).toBe(1);
    expect(axiosMock.history.get[0].url).toBe(`${API_BASE_URL}/api/users`);

    // Update the mock for get users
    axiosMock
      .onGet(`${API_BASE_URL}/api/users`)
      .reply(200, [{ ...users[0], username: "updated alice" }]);

    // Re-render the component to reflect the updated user
    rerender(
      <WrapperComponent
        user={{ ...users[0], username: "updated alice" }}
        showBefore={false}
      />,
    );

    await waitFor(() => getByText("updated alice"), { timeout: 1000 });

    // Check for the PATCH request
    expect(axiosMock.history.patch.length).toBe(2);
    expect(axiosMock.history.patch[0].url).toBe(`${API_BASE_URL}/api/users/1`);

    // Verify the JWT email was accessed
    expect(mockGetJwtEmail).toHaveBeenCalled();
  });

  it("Test get current user", async () => {
    axiosMock
      .onGet(`${API_BASE_URL}/api/users`, {
        params: { email: users[0].email },
      })
      .reply(200, users[0]);

    function TestComponent() {
      const { getCurrentUser } = useContext(UsersContext);
      const [user, setUser] = useState<User | null>(null);

      useEffect(() => {
        const fetchUser = async () => {
          setUser(await getCurrentUser());
        };
        fetchUser();
      }, []);

      return <div>{user && <p>{user.username}</p>}</div>;
    }

    const { getByText } = render(
      <AuthContext.Provider
        value={{
          getJwt: vi.fn().mockReturnValue(mockJwt),
          setJwt: vi.fn(),
          clearJwt: vi.fn(),
          isAuthenticated: true,
          setIsAuthenticated: vi.fn(),
          isJwtValid: vi.fn().mockResolvedValue(true),
          getJwtEmail: mockGetJwtEmail,
          progress: null,
          setProgress: vi.fn(),
          getUserByEmail: vi.fn().mockResolvedValue(users[0]),
        }}
      >
        <UsersContextProvider>
          <TestComponent />
        </UsersContextProvider>
      </AuthContext.Provider>,
    );

    await waitFor(() => getByText("alice"), { timeout: 1000 });

    expect(axiosMock.history.get.length).toBe(1);
    expect(axiosMock.history.get[0].url).toBe(`${API_BASE_URL}/api/users`);
    expect(axiosMock.history.get[0].params.email).toBe(users[0].email);

    expect(getByText("alice")).toBeInTheDocument();

    // Verify the JWT email was accessed
    expect(mockGetJwtEmail).toHaveBeenCalled();
  });
});
