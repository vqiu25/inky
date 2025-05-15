import "@testing-library/jest-dom";
import { beforeAll, afterEach, it } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { useContext, useEffect, useState } from "react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { AuthContextProvider } from "../AuthContextProvider";
import { Progress, User } from "../../types/types";
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

let axiosMock: MockAdapter;

beforeAll(() => {
  axiosMock = new MockAdapter(axios);
  localStorage.setItem("jwt", mockJwt);
});

afterEach(() => {
  axiosMock.reset();
  localStorage.clear();
});

describe("AuthContextProvider tests", () => {
  it("Test getJwt", async () => {
    function TestComponent() {
      const { getJwt } = useContext(AuthContext);

      const jwt = getJwt();

      return (
        <div>
          <p>{jwt}</p>
        </div>
      );
    }

    const { getByText } = render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>,
    );

    await waitFor(() => getByText(mockJwt), { timeout: 1000 });
  });

  it("Test setJwt", async () => {
    function TestComponent() {
      const { setJwt, getJwt } = useContext(AuthContext);

      setJwt("TestJwt");
      const jwt = getJwt();

      return (
        <div>
          <p>{jwt}</p>
        </div>
      );
    }

    const { getByText } = render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>,
    );

    await waitFor(() => getByText("TestJwt"), { timeout: 1000 });
  });

  it("Test clearJwt", async () => {
    function TestComponent() {
      const { clearJwt, getJwt } = useContext(AuthContext);

      clearJwt();
      const jwt = getJwt();

      return (
        <div>
          <p>{jwt ? "defined" : "undefined"}</p>
        </div>
      );
    }

    const { getByText } = render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>,
    );

    await waitFor(() => getByText("undefined"), { timeout: 1000 });
  });

  it("Test isAuthenticated", async () => {
    function TestComponent() {
      const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

      setIsAuthenticated(true);

      return (
        <div>
          <p>{isAuthenticated.valueOf().toString()}</p>
        </div>
      );
    }

    const { getByText } = render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>,
    );

    await waitFor(() => getByText("true"), { timeout: 1000 });

    expect(getByText("true")).toBeInTheDocument();
  });

  it("Test progress", async () => {
    function TestComponent() {
      const { progress, setProgress } = useContext(AuthContext);

      setProgress(Progress.GAME);

      return (
        <div>
          <p>{progress && progress.valueOf().toString()}</p>
        </div>
      );
    }

    const { getByText } = render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>,
    );

    await waitFor(() => getByText("game"), { timeout: 1000 });

    expect(getByText("game")).toBeInTheDocument();
  });

  it("Test getUserByEmail", async () => {
    axiosMock
      .onGet(`${API_BASE_URL}/api/users?email=${users[0].email}`)
      .reply(200, users[0]);

    function TestComponent() {
      const { getUserByEmail } = useContext(AuthContext);
      const [user, setUser] = useState<User | null>(null);

      useEffect(() => {
        const fetchUser = async () => {
          setUser(await getUserByEmail(users[0].email));
        };
        fetchUser();
      }, []);

      return (
        <div>
          <p>{user && user.username}</p>
        </div>
      );
    }

    const { getByText } = render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>,
    );

    await waitFor(() => getByText("alice"), { timeout: 1000 });
  });
});
