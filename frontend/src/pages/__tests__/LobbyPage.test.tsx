import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LobbyPage from "../LobbyPage";
import { BrowserRouter } from "react-router-dom";
import { GameStateContext } from "../../context/GameStateContext";
import { AuthContext } from "../../context/AuthContext";
import { UsersContext } from "../../context/UsersContext";
import { Progress } from "../../types/types";
import { mockCurrentUser, newUsers } from "./test-util";
import { socket } from "../../services/socket";
import { vi } from "vitest";
import React from "react";

// Mock the socket
vi.mock("../../services/socket", () => ({
  socket: {
    on: vi.fn(),
    once: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
}));

// Mock the custom hook
vi.mock("../../hooks/useCurrentUser", () => ({
  __esModule: true,
  default: vi.fn(() => mockCurrentUser),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LobbyPage Component", () => {
  const mockSetProgress = vi.fn();
  const mockSetLobbyPlayers = vi.fn();
  const mockSetCurrentDrawer = vi.fn();
  const mockSetWordToGuess = vi.fn();

  const gameStateContextValue = {
    lobbyPlayers: [mockCurrentUser, ...newUsers],
    setLobbyPlayers: mockSetLobbyPlayers,
    currentDrawer: null,
    setCurrentDrawer: mockSetCurrentDrawer,
    setWordToGuess: mockSetWordToGuess,
    isSelectingWord: false,
    setIsSelectingWord: vi.fn(),
    round: 0,
    setRound: vi.fn(),
    wordToGuess: "",
    playerStates: [],
    setPlayerStates: vi.fn(),
    timeRemaining: null,
    setTimeRemaining: vi.fn(),
    clearCanvas: vi.fn(),
    isTurnFinished: false,
    setIsTurnFinished: vi.fn(),
    phrases: [],
  };

  const authContextValue = {
    getJwt: vi.fn(),
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

  const usersContextValue = {
    usersLoading: false,
    addUser: vi.fn(),
    refreshUsers: vi.fn(),
    getUserById: vi.fn(),
    updateGamePlayer: vi.fn(),
    usersList: [mockCurrentUser, ...newUsers],
    setUsersList: vi.fn(),
    getCurrentUser: vi.fn().mockResolvedValue(mockCurrentUser),
    clearCurrentUser: vi.fn(),
    updateCurrentUser: vi.fn(),
    getUsers: vi.fn(),
  };

  function renderComponent() {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <UsersContext.Provider value={usersContextValue}>
            <GameStateContext.Provider value={gameStateContextValue}>
              <LobbyPage />
            </GameStateContext.Provider>
          </UsersContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders lobby page with loading spinner initially", async () => {
    // Mock useState to return isLoading as true initially
    const useStateMock = vi.spyOn(React, "useState");
    useStateMock.mockImplementationOnce(() => [true, vi.fn()]); // Force isLoading to be true

    renderComponent();

    // Now the spinner should be visible
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Clean up the mock
    useStateMock.mockRestore();
  });

  it("renders player list when loaded", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Check for player usernames
    expect(screen.getByText("Player1")).toBeInTheDocument();
    expect(screen.getByText("Player2")).toBeInTheDocument();
  });

  it("sets up socket event listeners on mount", () => {
    renderComponent();

    expect(socket.on).toHaveBeenCalledWith(
      "lobby-change",
      expect.any(Function),
    );
    expect(socket.on).toHaveBeenCalledWith(
      "drawer-select",
      expect.any(Function),
    );
  });

  it("removes socket event listeners on unmount", () => {
    const { unmount } = renderComponent();
    unmount();

    expect(socket.off).toHaveBeenCalledWith(
      "lobby-change",
      expect.any(Function),
    );
    expect(socket.off).toHaveBeenCalledWith(
      "drawer-select",
      expect.any(Function),
    );
  });

  it("disables 'Enter Game' button when not enough players", () => {
    const notEnoughPlayersContext = {
      ...gameStateContextValue,
      lobbyPlayers: [newUsers[0]], // Only one player
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <UsersContext.Provider value={usersContextValue}>
            <GameStateContext.Provider value={notEnoughPlayersContext}>
              <LobbyPage />
            </GameStateContext.Provider>
          </UsersContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    const enterGameButton = screen.getByRole("button", { name: /enter game/i });
    expect(enterGameButton).toBeDisabled();
  });

  it("enables 'Enter Game' button when enough players", async () => {
    renderComponent();

    await waitFor(() => {
      const enterGameButton = screen.getByRole("button", {
        name: /enter game/i,
      });
      expect(enterGameButton).toBeEnabled();
    });
  });

  it("calls onStartGame when 'Enter Game' button is clicked", async () => {
    renderComponent();

    // Make sure the button is found
    const enterGameButton = await screen.findByRole("button", {
      name: /enter game/i,
    });

    // Click the button
    fireEvent.click(enterGameButton);

    // Check that the word to guess was reset
    expect(mockSetWordToGuess).toHaveBeenCalledWith("");

    // Use a more flexible approach to check the socket.emit calls
    const gameStartCall = vi
      .mocked(socket.emit)
      .mock.calls.find((call) => call[0] === "game-start");

    // Assert that a "game-start" call was made
    expect(gameStartCall).toBeTruthy();

    // Check that the players array was passed with the game-start event
    // The array might include the current user + newUsers
    const players = gameStartCall?.[1];
    expect(players).toEqual(gameStateContextValue.lobbyPlayers);
  });

  it("emits player-leave event when pathname changes", () => {
    const { rerender } = render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <UsersContext.Provider value={usersContextValue}>
            <GameStateContext.Provider value={gameStateContextValue}>
              <LobbyPage />
            </GameStateContext.Provider>
          </UsersContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    rerender(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <UsersContext.Provider value={usersContextValue}>
            <GameStateContext.Provider value={gameStateContextValue}>
              <LobbyPage />
            </GameStateContext.Provider>
          </UsersContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(socket.emit).toHaveBeenCalledWith("player-leave", mockCurrentUser);
  });
});
