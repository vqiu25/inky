import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import LeaderboardPage from "../LeaderboardPage";
import { UsersContext } from "../../context/UsersContext";
import { mockCurrentUser, newUsers } from "./test-util";
import { User } from "../../types/types";
import { UsersContextType } from "../../context/UsersContextProvider";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LeaderboardPage", () => {
  const mockRefreshUsers = vi.fn().mockResolvedValue(undefined);

  const renderLeaderboardPage = (
    usersLoading = false,
    usersList: User[] = [],
  ) => {
    const mockUsersContextValue: UsersContextType = {
      usersLoading,
      usersList,
      refreshUsers: mockRefreshUsers,
      addUser: vi.fn(),
      getUserById: vi.fn(),
      updateGamePlayer: vi.fn(),
      setUsersList: vi.fn(),
      getCurrentUser: vi.fn(),
      clearCurrentUser: vi.fn(),
      updateCurrentUser: vi.fn(),
      getUsers: vi.fn(),
    };

    return render(
      <UsersContext.Provider value={mockUsersContextValue}>
        <LeaderboardPage />
      </UsersContext.Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the leaderboard page with header", () => {
    const { getByText } = renderLeaderboardPage();
    expect(getByText("Leaderboard")).toBeInTheDocument();
  });

  it("calls refreshUsers on mount", () => {
    renderLeaderboardPage();
    expect(mockRefreshUsers).toHaveBeenCalledTimes(1);
  });

  it("shows loading spinner when users are loading", async () => {
    const { getByTestId } = renderLeaderboardPage(false, []);
    await waitFor(() => {
      expect(getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });

  it("displays users sorted by total points in descending order", async () => {
    const { getAllByTestId } = renderLeaderboardPage(true, newUsers);

    await waitFor(() => {
      const userRows = getAllByTestId("leaderboard-user-row");
      expect(userRows).toHaveLength(2);

      expect(userRows[0]).toHaveTextContent("200");
      expect(userRows[1]).toHaveTextContent("150");
    });
  });

  it("displays multiple users from the context", async () => {
    const combinedUsers = [mockCurrentUser, ...newUsers];
    const { getByText } = renderLeaderboardPage(true, combinedUsers);

    await waitFor(() => {
      expect(getByText("TestUser")).toBeInTheDocument();
      expect(getByText("Player1")).toBeInTheDocument();
      expect(getByText("Player2")).toBeInTheDocument();
    });
  });

  it("updates the view when users are loaded", async () => {
    // Start with loading state
    const { rerender, getByTestId, getByText } = renderLeaderboardPage(
      false,
      [],
    );
    await waitFor(() => {
      const loadingElement = getByTestId("loading-spinner");
      expect(loadingElement).toBeInTheDocument();
    });

    // Update to loaded state with users
    rerender(
      <UsersContext.Provider
        value={{
          usersLoading: false,
          usersList: [mockCurrentUser],
          refreshUsers: mockRefreshUsers,
          addUser: vi.fn(),
          getUserById: vi.fn(),
          updateGamePlayer: vi.fn(),
          setUsersList: vi.fn(),
          getCurrentUser: vi.fn(),
          clearCurrentUser: vi.fn(),
          updateCurrentUser: vi.fn(),
          getUsers: vi.fn(),
        }}
      >
        <LeaderboardPage />
      </UsersContext.Provider>,
    );

    await waitFor(() => {
      expect(getByText("TestUser")).toBeInTheDocument();
    });
  });
});
