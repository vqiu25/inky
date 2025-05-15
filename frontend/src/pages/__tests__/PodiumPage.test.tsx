import { render, screen, within } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import PodiumPage from "../PodiumPage";
import { GameStateContext } from "../../context/GameStateContext";
import { UsersContext } from "../../context/UsersContext";
import { mockCurrentUser, newUsers } from "./test-util";
import { PlayerState } from "../../types/types";
import { GameStateContextType } from "../../context/GameStateContextProvider";
import { UsersContextType } from "../../context/UsersContextProvider";

// Mock useCurrentUser hook
vi.mock("../../hooks/useCurrentUser", () => ({
  default: () => mockCurrentUser,
}));

describe("PodiumPage", () => {
  // Mock player states with different scores for testing order
  const mockPlayerStates: PlayerState[] = [
    {
      user: newUsers[0], // Player1
      points: 200, // This player should be 3rd
      scoreMultiplier: false,
      hasLeftGame: false,
      hasGuessedWord: true,
    },
    {
      user: newUsers[1], // Player2
      points: 300, // This player should be 1st
      scoreMultiplier: false,
      hasLeftGame: false,
      hasGuessedWord: true,
    },
    {
      user: mockCurrentUser, // TestUser
      points: 250, // This player should be 2nd
      scoreMultiplier: false,
      hasLeftGame: false,
      hasGuessedWord: true,
    },
    {
      user: {
        ...newUsers[0],
        _id: "user3",
        username: "Player3",
        email: "p3@example.com",
      },
      points: 150, // This player should be 4th
      scoreMultiplier: false,
      hasLeftGame: false,
      hasGuessedWord: true,
    },
    {
      user: {
        ...newUsers[0],
        _id: "user4",
        username: "Player4",
        email: "p4@example.com",
      },
      points: 100, // This player should be 5th
      scoreMultiplier: false,
      hasLeftGame: false,
      hasGuessedWord: true,
    },
    {
      user: {
        ...newUsers[0],
        _id: "user5",
        username: "Player5",
        email: "p5@example.com",
      },
      points: 50, // This player should be 6th
      scoreMultiplier: false,
      hasLeftGame: false,
      hasGuessedWord: true,
    },
  ];

  const mockUpdateGamePlayer = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderPodiumPage(playerStates: PlayerState[] = []) {
    const mockGameStateContextValue: Partial<GameStateContextType> = {
      playerStates: playerStates,
    };

    const mockUsersContextValue: Partial<UsersContextType> = {
      updateGamePlayer: mockUpdateGamePlayer,
    };

    return render(
      <BrowserRouter>
        <GameStateContext.Provider
          value={mockGameStateContextValue as GameStateContextType}
        >
          <UsersContext.Provider
            value={mockUsersContextValue as UsersContextType}
          >
            <PodiumPage />
          </UsersContext.Provider>
        </GameStateContext.Provider>
      </BrowserRouter>,
    );
  }

  it("displays loading spinner when player states are not available", () => {
    renderPodiumPage();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("updates the current user's data on component mount", () => {
    renderPodiumPage(mockPlayerStates);
    expect(mockUpdateGamePlayer).toHaveBeenCalledWith(mockCurrentUser);
  });

  it("displays the correct header", () => {
    renderPodiumPage(mockPlayerStates);
    expect(screen.getByText("Game Finished!")).toBeInTheDocument();
  });

  it("displays top three players in correct order based on points", () => {
    renderPodiumPage(mockPlayerStates);

    // Get all podium users by test ID
    const podiumUsers = screen.getAllByTestId("podium-user");

    // Check that we have all the expected users
    expect(podiumUsers.length).toBeGreaterThanOrEqual(3);

    // Verify the first three users are in the right order
    // First place (Player2)
    expect(within(podiumUsers[0]).getByText("Player2")).toBeInTheDocument();
    // Second place (TestUser)
    expect(within(podiumUsers[1]).getByText(/TestUser/)).toBeInTheDocument();
    // Third place (Player1)
    expect(within(podiumUsers[2]).getByText("Player1")).toBeInTheDocument();
  });

  it("displays a crown only for the winner (first place)", () => {
    renderPodiumPage(mockPlayerStates);

    // There should be exactly one crown
    const crown = screen.getByAltText("Winner");
    expect(screen.getAllByAltText("Winner").length).toBe(1);

    // The crown should be in the first podium user
    const podiumUsers = screen.getAllByTestId("podium-user");
    expect(podiumUsers[0]).toContainElement(crown);
  });

  it("displays 4th-6th place players in correct order below the podium", () => {
    renderPodiumPage(mockPlayerStates);

    // Get all podium users by test ID
    const podiumUsers = screen.getAllByTestId("podium-user");

    // Ensure we have at least 6 users
    expect(podiumUsers.length).toBeGreaterThanOrEqual(6);

    // Verify 4th-6th place users
    // 4th place (Player3)
    expect(within(podiumUsers[3]).getByText("Player3")).toBeInTheDocument();
    // 5th place (Player4)
    expect(within(podiumUsers[4]).getByText("Player4")).toBeInTheDocument();
    // 6th place (Player5)
    expect(within(podiumUsers[5]).getByText("Player5")).toBeInTheDocument();

    // Verify the positions are shown
    expect(screen.getByText("4th")).toBeInTheDocument();
    expect(screen.getByText("5th")).toBeInTheDocument();
    expect(screen.getByText("6th")).toBeInTheDocument();

    // Verify points are shown in the right order
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("handles fewer than 6 players", () => {
    // Create a subset of players (just 4 players)
    const fewerPlayers = mockPlayerStates.slice(0, 4);
    renderPodiumPage(fewerPlayers);

    // Get all podium users by test ID
    const podiumUsers = screen.getAllByTestId("podium-user");

    // Should have exactly 4 users
    expect(podiumUsers.length).toBe(4);

    // Should show top 3 in podium
    expect(screen.getByText("1st")).toBeInTheDocument();
    expect(screen.getByText("2nd")).toBeInTheDocument();
    expect(screen.getByText("3rd")).toBeInTheDocument();

    // Should only show one player in bottom section
    expect(screen.getByText("4th")).toBeInTheDocument();

    // Should NOT have 5th and 6th places
    expect(screen.queryByText("5th")).not.toBeInTheDocument();
    expect(screen.queryByText("6th")).not.toBeInTheDocument();
  });

  it("handles less than 3 players by showing only available positions", () => {
    // Only two players in this scenario
    const twoPlayers = mockPlayerStates.slice(0, 2);
    renderPodiumPage(twoPlayers);

    // Get all podium users by test ID
    const podiumUsers = screen.getAllByTestId("podium-user");

    // Should have exactly 2 users
    expect(podiumUsers.length).toBe(2);

    // Should show only two positions in podium
    expect(screen.getByText("1st")).toBeInTheDocument();
    expect(screen.getByText("2nd")).toBeInTheDocument();
    expect(screen.queryByText("3rd")).not.toBeInTheDocument();

    // No players in bottom section
    expect(screen.queryByText("4th")).not.toBeInTheDocument();
  });

  it("marks the current user with '(You)' text", () => {
    renderPodiumPage(mockPlayerStates);
    expect(screen.getByText("TestUser (You)")).toBeInTheDocument();
  });

  it("handles player state changes correctly", () => {
    // Create player states with different ordering to test re-sorting
    const reorderedPlayers = [
      { ...mockPlayerStates[5] }, // Player5 (50 points - should be 6th)
      { ...mockPlayerStates[1] }, // Player2 (300 points - should be 1st)
      { ...mockPlayerStates[3] }, // Player3 (150 points - should be 4th)
      { ...mockPlayerStates[4] }, // Player4 (100 points - should be 5th)
      { ...mockPlayerStates[0] }, // Player1 (200 points - should be 3rd)
      { ...mockPlayerStates[2] }, // TestUser (250 points - should be 2nd)
    ];

    renderPodiumPage(reorderedPlayers);

    // Get all podium users
    const podiumUsers = screen.getAllByTestId("podium-user");

    // Verify the ordering after sorting by points
    // First place should still be Player2 even if not first in the array
    expect(within(podiumUsers[0]).getByText("Player2")).toBeInTheDocument();
    // Second place should be TestUser
    expect(within(podiumUsers[1]).getByText(/TestUser/)).toBeInTheDocument();
    // Third place should be Player1
    expect(within(podiumUsers[2]).getByText("Player1")).toBeInTheDocument();
    // Fourth place should be Player3
    expect(within(podiumUsers[3]).getByText("Player3")).toBeInTheDocument();
  });
});
