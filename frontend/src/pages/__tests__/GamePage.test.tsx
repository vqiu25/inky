import { vi } from "vitest";
import { mockCurrentUser, mockPhrases, newUsers } from "./test-util";
import { UsersContextType } from "../../context/UsersContextProvider";
import { GameStateContextType } from "../../context/GameStateContextProvider";
import { AuthContextType } from "../../context/AuthContextProvider";
import { GameState, Progress, User } from "../../types/types";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import { GameStateContext } from "../../context/GameStateContext";
import GamePage from "../GamePage";
import { UsersContext } from "../../context/UsersContext";
import { socket } from "../../services/socket";

// Mock socket
vi.mock("../../services/socket", () => ({
  socket: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: "/game",
      search: "",
      hash: "",
      state: null,
      key: "default",
    }),
  };
});

// Mock the hook implementation
vi.mock("../../hooks/useCurrentUser", () => ({
  default: () => mockCurrentUser,
}));

// Mock the components
vi.mock("../../components/gameComponents/Canvas", () => ({
  default: () => <div data-testid="mock-canvas">Canvas Mock</div>,
}));

vi.mock("../../components/gameComponents/WordSelection", () => ({
  default: () => (
    <div data-testid="mock-word-selection">WordSelection Mock</div>
  ),
}));

vi.mock("../../components/gameComponents/GameToolBar", () => ({
  default: () => <div data-testid="mock-turn-end">GameToolBar Mock</div>,
}));

vi.mock("../../components/gameComponents/GamePowerups", () => ({
  default: () => <div data-testid="mock-powerups">GamePowerups Mock</div>,
}));

vi.mock("../../components/gameComponents/GameStatusBar", () => ({
  default: () => <div data-testid="mock-status-bar">GameStatusBar Mock</div>,
}));

vi.mock("../../components/gameComponents/TurnEnd", () => ({
  default: () => <div data-testid="mock-turn-end">TurnEnd Mock</div>,
}));

// Add this with your other component mocks at the top of the file
vi.mock("../../components/gameComponents/GameChat", () => ({
  default: () => {
    const handleSendMessage = () => {
      socket.emit("chat-data", {
        username: mockCurrentUser.username,
        text: "Hello everyone!",
      });
    };

    return (
      <div data-testid="mock-chat">
        <input placeholder="Type a message..." data-testid="chat-input" />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    );
  },
}));

describe("GamePage", () => {
  const mockSetNewPlayers = vi.fn();
  const mockSetProgress = vi.fn();
  const mockSetCurrentDrawer = vi.fn();
  const mockSetIsSelectingWord = vi.fn();
  const mockSetRound = vi.fn();
  const mockSetWordToGuess = vi.fn();
  const mockSetPlayersStates = vi.fn();
  const mockSetIsTurnFinished = vi.fn();
  const mockClearCanvas = vi.fn();

  beforeAll(() => {
    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // Mock Element.scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderGamePage(
    isTurnFinished: boolean,
    isSelectingWord: boolean,
    currentDrawer: User | null,
  ) {
    const mockAuthContextValue: AuthContextType = {
      getJwt: () => "mockJwt",
      setJwt: vi.fn(),
      clearJwt: vi.fn(),
      isAuthenticated: true,
      setIsAuthenticated: vi.fn(),
      isJwtValid: vi.fn(),
      getJwtEmail: vi.fn(),
      progress: Progress.LOBBY,
      setProgress: mockSetProgress,
      getUserByEmail: vi.fn(),
    };

    const mockGameStateContextValue: GameStateContextType = {
      lobbyPlayers: [mockCurrentUser, ...newUsers],
      setNewPlayers: mockSetNewPlayers,
      currentDrawer: currentDrawer,
      setCurrentDrawer: mockSetCurrentDrawer,
      isSelectingWord: isSelectingWord,
      setIsSelectingWord: mockSetIsSelectingWord,
      round: 1,
      setRound: mockSetRound,
      wordToGuess: "",
      setWordToGuess: mockSetWordToGuess,
      playerStates: [
        {
          user: mockCurrentUser,
          points: 0,
          scoreMultiplier: false,
          hasLeftGame: false,
          hasGuessedWord: false,
        },
        {
          user: newUsers[0],
          points: 50,
          scoreMultiplier: false,
          hasLeftGame: false,
          hasGuessedWord: false,
        },
        {
          user: newUsers[1],
          points: 100,
          scoreMultiplier: false,
          hasLeftGame: false,
          hasGuessedWord: false,
        },
      ],
      setPlayerStates: mockSetPlayersStates,
      timeRemaining: 90,
      updateTime: vi.fn(),
      clearCanvas: mockClearCanvas,
      isTurnFinished: isTurnFinished,
      setIsTurnFinished: mockSetIsTurnFinished,
      phrases: mockPhrases,
    };

    const mockUsersContextValue: UsersContextType = {
      usersLoading: false,
      addUser: vi.fn(),
      refreshUsers: vi.fn(),
      getUserById: vi.fn(),
      updateGamePlayer: vi.fn(),
      usersList: newUsers,
      setUsersList: vi.fn(),
      getCurrentUser: () => Promise.resolve(mockCurrentUser),
      clearCurrentUser: vi.fn(),
      updateCurrentUser: vi.fn(),
      getUsers: vi.fn(),
    };
    return render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <GameStateContext.Provider value={mockGameStateContextValue}>
          <UsersContext.Provider value={mockUsersContextValue}>
            <GamePage />
          </UsersContext.Provider>
        </GameStateContext.Provider>
      </AuthContext.Provider>,
    );
  }
  it("Renders the GamePage and make sure the components are displayed", async () => {
    const { getByText } = renderGamePage(false, true, null);
    expect(getByText("Canvas Mock")).toBeInTheDocument();
    expect(getByText("WordSelection Mock")).toBeInTheDocument();
    expect(getByText("GameStatusBar Mock")).toBeInTheDocument();
  });

  it("Renders the GameToolBar when the player is a drawer", () => {
    const { getByText } = renderGamePage(false, true, mockCurrentUser);
    expect(getByText("GameToolBar Mock")).toBeInTheDocument();
  });

  it("Renders the GamePowerups when the player is not a drawer", () => {
    const { getByText } = renderGamePage(false, true, newUsers[0]);
    expect(getByText("GamePowerups Mock")).toBeInTheDocument();
  });

  it("Renders the TurnEnd when the turn is finished", () => {
    const { getByText } = renderGamePage(true, false, null);
    expect(getByText("TurnEnd Mock")).toBeInTheDocument();
  });

  it("Displays player list in order of points", async () => {
    const { getAllByTestId } = renderGamePage(false, false, null);

    await waitFor(() => {
      const gameListPlayer = getAllByTestId("game-list-player");
      expect(gameListPlayer).toHaveLength(3);

      expect(gameListPlayer[0]).toHaveTextContent(newUsers[1].username);
      expect(gameListPlayer[1]).toHaveTextContent(newUsers[0].username);
      expect(gameListPlayer[2]).toHaveTextContent(mockCurrentUser.username);
    });
  });

  it("sets progress to GAME when component mounts", () => {
    renderGamePage(false, false, null);
    expect(mockSetProgress).toHaveBeenCalledWith(Progress.GAME);
  });

  it("handles socket 'new-turn' event correctly", async () => {
    // Render the component
    renderGamePage(false, false, mockCurrentUser);

    // Wait for all useEffects to complete
    await waitFor(() => {
      // Get all the socket.on calls
      const socketOnMock = vi.mocked(socket.on);

      // Find the latest new-turn handler (in case there are multiple registrations)
      const newTurnCalls = socketOnMock.mock.calls.filter(
        (call) => call[0] === "new-turn",
      );
      const newTurnHandler = newTurnCalls[newTurnCalls.length - 1]?.[1];

      // Call the handler with the test data if found
      if (newTurnHandler) {
        const gameState: GameState = {
          round: 2,
          wordToGuess: "elephant",
          playerStates: [
            {
              user: mockCurrentUser,
              points: 0,
              scoreMultiplier: false,
              hasLeftGame: false,
              hasGuessedWord: false,
            },
            {
              user: newUsers[0],
              points: 50,
              scoreMultiplier: false,
              hasLeftGame: false,
              hasGuessedWord: false,
            },
            {
              user: newUsers[1],
              points: 100,
              scoreMultiplier: false,
              hasLeftGame: false,
              hasGuessedWord: false,
            },
          ],
          drawer: newUsers[0],
          timeRemaining: 90,
        };

        // Invoke the handler with gameState
        newTurnHandler(gameState);

        // Check if the functions were called with the expected values
        expect(mockSetIsSelectingWord).toHaveBeenCalledWith(false);
        expect(mockSetRound).toHaveBeenCalledWith(gameState.round);
        expect(mockSetWordToGuess).toHaveBeenCalledWith(gameState.wordToGuess);
        expect(mockSetPlayersStates).toHaveBeenCalledWith(
          gameState.playerStates,
        );
        expect(mockClearCanvas).toHaveBeenCalled();
      } else {
        fail("new-turn event handler not found");
      }
    });
  });

  it("handles socket 'new-scores' event correctly", () => {
    renderGamePage(false, false, null);

    const socketOnMock = vi.mocked(socket.on);
    const newScoresHandler = socketOnMock.mock.calls.find(
      (call) => call[0] === "new-scores",
    )?.[1];

    if (newScoresHandler) {
      const updatedPoints = [
        [mockCurrentUser, 20],
        [newUsers[0], 70],
        [newUsers[1], 120],
      ];
      newScoresHandler(updatedPoints);

      expect(mockSetPlayersStates).toHaveBeenCalledWith(updatedPoints);
    } else {
      fail("new-scores event handler not found");
    }
  });

  it("handles socket 'turn-end' event correctly", () => {
    renderGamePage(false, false, null);

    const socketOnMock = vi.mocked(socket.on);
    const turnEndHandler = socketOnMock.mock.calls.find(
      (call) => call[0] === "turn-end",
    )?.[1];

    if (turnEndHandler) {
      // Test timeout case
      turnEndHandler(true, false);
      expect(mockSetIsTurnFinished).toHaveBeenCalledWith(true);

      // Test drawer left case
      vi.clearAllMocks();
      turnEndHandler(false, true);
      expect(mockSetIsTurnFinished).toHaveBeenCalledWith(true);
    } else {
      fail("turn-end event handler not found");
    }
  });

  it("handles socket 'lobby-change' event correctly", () => {
    renderGamePage(false, false, null);

    const socketOnMock = vi.mocked(socket.on);
    const lobbyChangeHandler = socketOnMock.mock.calls.find(
      (call) => call[0] === "lobby-change",
    )?.[1];

    if (lobbyChangeHandler) {
      const updatedPlayers = [mockCurrentUser, newUsers[0]]; // One player left
      lobbyChangeHandler(updatedPlayers);

      expect(mockSetNewPlayers).toHaveBeenCalledWith(updatedPlayers);
    } else {
      fail("lobby-change event handler not found");
    }
  });

  it("handles socket 'game-finished' event correctly", () => {
    renderGamePage(false, false, null);

    const socketOnMock = vi.mocked(socket.on);
    const gameFinishedHandler = socketOnMock.mock.calls.find(
      (call) => call[0] === "game-finished",
    )?.[1];

    if (gameFinishedHandler) {
      const finalGameState: GameState = {
        round: 3,
        wordToGuess: "tiger",
        drawer: mockCurrentUser,
        playerStates: [
          {
            user: mockCurrentUser,
            points: 0,
            scoreMultiplier: false,
            hasLeftGame: false,
            hasGuessedWord: false,
          },
          {
            user: newUsers[0],
            points: 50,
            scoreMultiplier: false,
            hasLeftGame: false,
            hasGuessedWord: false,
          },
          {
            user: newUsers[1],
            points: 100,
            scoreMultiplier: false,
            hasLeftGame: false,
            hasGuessedWord: false,
          },
        ],
        timeRemaining: 90,
      };

      gameFinishedHandler(finalGameState);

      expect(mockSetPlayersStates).toHaveBeenCalledWith(
        finalGameState.playerStates,
      );
      expect(mockNavigate).toHaveBeenCalledWith("/podium");
      expect(socket.emit).toHaveBeenCalledWith("player-leave", mockCurrentUser);
    } else {
      fail("game-finished event handler not found");
    }
  });

  it("handles socket 'drawer-select' event correctly", () => {
    renderGamePage(false, false, null);

    const socketOnMock = vi.mocked(socket.on);
    const drawerSelectHandler = socketOnMock.mock.calls.find(
      (call) => call[0] === "drawer-select",
    )?.[1];

    if (drawerSelectHandler) {
      const newDrawer = newUsers[0];
      drawerSelectHandler(newDrawer);

      expect(mockSetWordToGuess).toHaveBeenCalledWith("");
      expect(mockSetCurrentDrawer).toHaveBeenCalledWith(newDrawer);
      expect(mockSetIsSelectingWord).toHaveBeenCalledWith(true);
      expect(mockSetIsTurnFinished).toHaveBeenCalledWith(false);
    } else {
      fail("drawer-select event handler not found");
    }
  });

  it("handles chat messages correctly", async () => {
    // Setup the mock for socketio events
    const mockSocketEmit = vi.mocked(socket.emit);

    // Render the component
    const { getByTestId } = renderGamePage(false, false, null);

    // Find the send button in the mocked component
    const sendButton = getByTestId("mock-chat").querySelector("button");

    // Simulate sending the message
    fireEvent.click(sendButton!);

    // Verify socket.emit was called with the correct data
    expect(mockSocketEmit).toHaveBeenCalledWith("chat-data", {
      username: mockCurrentUser.username,
      text: "Hello everyone!",
    });
  });
});
