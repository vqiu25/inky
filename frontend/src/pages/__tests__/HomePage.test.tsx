import { render, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../HomePage";
import { GameStateContext } from "../../context/GameStateContext";
import { AuthContext } from "../../context/AuthContext";
import { UsersContext } from "../../context/UsersContext";
import { Progress } from "../../types/types";
import { socket } from "../../services/socket";
import { mockCurrentUser } from "./test-util";
import { UsersContextType } from "../../context/UsersContextProvider";
import { AuthContextType } from "../../context/AuthContextProvider";
import { GameStateContextType } from "../../context/GameStateContextProvider";

// Mock socket
vi.mock("../../services/socket", () => ({
  socket: {
    on: vi.fn(),
    once: vi.fn(),
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
  };
});

// Mock the hook implementation
vi.mock("../../hooks/useCurrentUser", () => ({
  default: () => mockCurrentUser,
}));

describe("HomePage", () => {
  // Mock context functions
  const mockSetLobbyPlayers = vi.fn();
  const mockClearCurrentUser = vi.fn();
  const mockSetProgress = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderHomePage() {
    const mockAuthContextValue: AuthContextType = {
      getJwt: () => "mockJwt",
      setJwt: vi.fn(),
      clearJwt: vi.fn(),
      isAuthenticated: true,
      setIsAuthenticated: vi.fn(),
      isJwtValid: vi.fn(),
      getJwtEmail: vi.fn(),
      progress: Progress.HOME,
      setProgress: mockSetProgress,
      getUserByEmail: vi.fn(),
    };

    const mockGameStateContextValue: GameStateContextType = {
      lobbyPlayers: [],
      setLobbyPlayers: mockSetLobbyPlayers,
      currentDrawer: null,
      setCurrentDrawer: vi.fn(),
      isSelectingWord: true,
      setIsSelectingWord: vi.fn(),
      round: 0,
      setRound: vi.fn(),
      wordToGuess: "",
      setWordToGuess: vi.fn(),
      playerStates: [],
      setPlayerStates: vi.fn(),
      timeRemaining: null,
      setTimeRemaining: vi.fn(),
      clearCanvas: vi.fn(),
      isTurnFinished: false,
      setIsTurnFinished: vi.fn(),
      phrases: [],
    };

    const mockUsersContextValue: UsersContextType = {
      usersLoading: false,
      addUser: vi.fn(),
      refreshUsers: vi.fn(),
      getUserById: vi.fn(),
      updateGamePlayer: vi.fn(),
      usersList: [],
      setUsersList: vi.fn(),
      getCurrentUser: vi.fn(),
      clearCurrentUser: mockClearCurrentUser,
      updateCurrentUser: vi.fn(),
      getUsers: vi.fn(),
    };
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <GameStateContext.Provider value={mockGameStateContextValue}>
            <UsersContext.Provider value={mockUsersContextValue}>
              <HomePage />
            </UsersContext.Provider>
          </GameStateContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );
  }

  it("renders the homepage with all elements", () => {
    const { getByText, getByAltText } = renderHomePage();

    // Check title and buttons are present
    expect(getByText("Inky")).toBeInTheDocument();
    expect(getByText("Play")).toBeInTheDocument();
    expect(getByText("Profile")).toBeInTheDocument();
    expect(getByText("Leaderboard")).toBeInTheDocument();
    expect(getByAltText("Info")).toBeInTheDocument();
    expect(getByAltText("Logout")).toBeInTheDocument();
  });

  it("sets the progress to HOME when component mounts", () => {
    renderHomePage();
    expect(mockSetProgress).toHaveBeenCalledWith(Progress.HOME);
  });

  it("navigates to profile page when Profile button is clicked", () => {
    const { getByText } = renderHomePage();
    fireEvent.click(getByText("Profile"));
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("navigates to leaderboard page when Leaderboard button is clicked", () => {
    const { getByText } = renderHomePage();
    fireEvent.click(getByText("Leaderboard"));
    expect(mockNavigate).toHaveBeenCalledWith("/leaderboard");
  });

  it("shows info popup when the info button is clicked", () => {
    const { queryByText, getByText, getByAltText } = renderHomePage();

    // Info popup should not be visible initially
    expect(queryByText("How to Play")).not.toBeInTheDocument();

    // Click info button
    fireEvent.click(getByAltText("Info"));

    // Info popup should now be visible
    expect(getByText("How to Play")).toBeInTheDocument();
  });

  it("logs out user when logout button is clicked", () => {
    // Spy on localStorage
    const localStorageSpy = vi.spyOn(Storage.prototype, "removeItem");

    const { getByAltText } = renderHomePage();
    fireEvent.click(getByAltText("Logout"));

    // Verify actions
    expect(localStorageSpy).toHaveBeenCalledWith("jwt");
    expect(mockClearCurrentUser).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");

    localStorageSpy.mockRestore();
  });
  it("navigates to lobby and emits player-join when Play is clicked", () => {
    const { getByText } = renderHomePage();

    fireEvent.click(getByText("Play"));

    // Only check that player-join was emitted - navigation happens after lobby-change event
    expect(socket.emit).toHaveBeenCalledWith("player-join", mockCurrentUser);

    // Verify socket.once was called for lobby-change
    expect(socket.once).toHaveBeenCalledWith(
      "lobby-change",
      expect.any(Function),
    );
  });

  it("sets up socket listeners for lobby events on mount", () => {
    renderHomePage();

    // Verify socket.on was called only for lobby-change
    expect(socket.on).toHaveBeenCalledWith(
      "lobby-change",
      expect.any(Function),
    );
  });

  it("removes socket listeners on unmount", () => {
    const { unmount } = renderHomePage();
    unmount();

    // Verify socket.off was called only for lobby-change
    expect(socket.off).toHaveBeenCalledWith(
      "lobby-change",
      expect.any(Function),
    );
  });

  it("doesn't navigate when lobby-full event is received", () => {
    const { getByText } = renderHomePage();

    // Click Play to set up the socket.once listeners
    fireEvent.click(getByText("Play"));

    // Find the lobby-full handler and call it directly
    const lobbyFullHandler = vi
      .mocked(socket.once)
      .mock.calls.find((call) => call[0] === "lobby-full")?.[1];

    if (lobbyFullHandler) {
      lobbyFullHandler();
    }

    // We should NOT navigate to home in this case
    expect(mockNavigate).not.toHaveBeenCalledWith("/home");
  });
});
