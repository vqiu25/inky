import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { useContext } from "react";
import { User } from "../../types/types";
import { GameStateContext } from "../GameStateContext";
import { GameStateContextProvider } from "../GameStateContextProvider";

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

const phrases = [
  {
    _id: "1",
    phrase: "test1",
  },
  {
    _id: "2",
    phrase: "test2",
  },
];

let axiosMock: MockAdapter;

beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

afterEach(() => {
  axiosMock.reset();
});

describe("GameStateContextProvider tests", () => {
  it("Test lobbyPlayers", async () => {
    function TestComponent() {
      const { lobbyPlayers, setLobbyPlayers } = useContext(GameStateContext);

      setLobbyPlayers(users);

      return (
        <div>
          <p>{lobbyPlayers ? lobbyPlayers.length : 0} users in list</p>
          {lobbyPlayers &&
            lobbyPlayers.map((user: User) => (
              <p key={user._id}>{user.username}</p>
            ))}
        </div>
      );
    }

    const { getByText } = render(
      <GameStateContextProvider>
        <TestComponent />
      </GameStateContextProvider>,
    );

    await waitFor(() => getByText("alice"), { timeout: 1000 });

    expect(getByText("alice")).toBeInTheDocument();
    expect(getByText("bob")).toBeInTheDocument();
  });

  it("Test currentDrawer", async () => {
    function TestComponent() {
      const { currentDrawer, setCurrentDrawer } = useContext(GameStateContext);

      setCurrentDrawer(users[0]);

      return <div>{currentDrawer && <p>{currentDrawer.username}</p>}</div>;
    }

    const { getByText } = render(
      <GameStateContextProvider>
        <TestComponent />
      </GameStateContextProvider>,
    );

    await waitFor(() => getByText("alice"), { timeout: 1000 });

    expect(getByText("alice")).toBeInTheDocument();
  });

  it("Test isSelectingWord", async () => {
    function TestComponent() {
      const { isSelectingWord, setIsSelectingWord } =
        useContext(GameStateContext);

      setIsSelectingWord(true);

      return (
        <div>
          <p>{isSelectingWord.valueOf().toString()}</p>
        </div>
      );
    }

    const { getByText } = render(
      <GameStateContextProvider>
        <TestComponent />
      </GameStateContextProvider>,
    );

    await waitFor(() => getByText("true"), { timeout: 1000 });

    expect(getByText("true")).toBeInTheDocument();
  });

  it("Test round", async () => {
    function TestComponent() {
      const { round, setRound } = useContext(GameStateContext);

      setRound(1);

      return (
        <div>
          <p>{round}</p>
        </div>
      );
    }

    const { getByText } = render(
      <GameStateContextProvider>
        <TestComponent />
      </GameStateContextProvider>,
    );

    await waitFor(() => getByText("1"), { timeout: 1000 });

    expect(getByText("1")).toBeInTheDocument();
  });

  it("Test wordToGuess", async () => {
    function TestComponent() {
      const { wordToGuess, setWordToGuess } = useContext(GameStateContext);

      setWordToGuess("test");

      return (
        <div>
          <p>{wordToGuess}</p>
        </div>
      );
    }

    const { getByText } = render(
      <GameStateContextProvider>
        <TestComponent />
      </GameStateContextProvider>,
    );

    await waitFor(() => getByText("test"), { timeout: 1000 });

    expect(getByText("test")).toBeInTheDocument();
  });

  it("Test timeRemaining", async () => {
    function TestComponent() {
      const { timeRemaining, setTimeRemaining } = useContext(GameStateContext);

      setTimeRemaining(90);

      return (
        <div>
          <p>{timeRemaining}</p>
        </div>
      );
    }

    const { getByText } = render(
      <GameStateContextProvider>
        <TestComponent />
      </GameStateContextProvider>,
    );

    await waitFor(() => getByText("90"), { timeout: 1000 });

    expect(getByText("90")).toBeInTheDocument();
  });

  it("Test isTurnFinished", async () => {
    function TestComponent() {
      const { isTurnFinished, setIsTurnFinished } =
        useContext(GameStateContext);

      setIsTurnFinished(true);

      return (
        <div>
          <p>{isTurnFinished.valueOf().toString()}</p>
        </div>
      );
    }

    const { getByText } = render(
      <GameStateContextProvider>
        <TestComponent />
      </GameStateContextProvider>,
    );

    await waitFor(() => getByText("true"), { timeout: 1000 });

    expect(getByText("true")).toBeInTheDocument();
  });

  it("Test phrases", async () => {
    axiosMock.onGet(`${API_BASE_URL}/api/phrases`).reply(200, phrases);

    function TestComponent() {
      const { phrases } = useContext(GameStateContext);

      return (
        <div>
          {phrases &&
            phrases.map((phrase) => <p key={phrase._id}>{phrase.phrase}</p>)}
        </div>
      );
    }

    const { getByText } = render(
      <GameStateContextProvider>
        <TestComponent />
      </GameStateContextProvider>,
    );

    await waitFor(() => getByText("test1"), { timeout: 1000 });

    expect(getByText("test1")).toBeInTheDocument();
    expect(getByText("test2")).toBeInTheDocument();
  });
});
