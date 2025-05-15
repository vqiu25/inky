import { render, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ProfilePage from "../ProfilePage";
import { AuthContext } from "../../context/AuthContext";
import { UsersContext } from "../../context/UsersContext";
import { Progress, User } from "../../types/types";
import { mockCurrentUser } from "./test-util";
import { UsersContextType } from "../../context/UsersContextProvider";
import { AuthContextType } from "../../context/AuthContextProvider";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock update functions
const mockUpdateCurrentUser = vi.fn();
const mockSetProgress = vi.fn();

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateCurrentUser.mockResolvedValue(mockCurrentUser);
  });

  function renderProfilePage(user: User | null) {
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

    const mockUsersContextValue: UsersContextType = {
      usersLoading: false,
      addUser: vi.fn(),
      refreshUsers: vi.fn(),
      getUserById: vi.fn(),
      updateGamePlayer: vi.fn(),
      usersList: [],
      setUsersList: vi.fn(),
      getCurrentUser: () => Promise.resolve(user),
      clearCurrentUser: vi.fn(),
      updateCurrentUser: mockUpdateCurrentUser,
      getUsers: vi.fn(),
    };
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <UsersContext.Provider value={mockUsersContextValue}>
            <ProfilePage />
          </UsersContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );
  }

  it("renders the profile page with user information", async () => {
    const { getByText, getByAltText } = renderProfilePage(mockCurrentUser);
    await waitFor(() => {
      expect(getByText("TestUser")).toBeInTheDocument();
      expect(getByText("10")).toBeInTheDocument();
      expect(getByText("500")).toBeInTheDocument();
      expect(getByText("300")).toBeInTheDocument();
      expect(getByText("5")).toBeInTheDocument();
      const profilePicture = getByAltText("TestUser's profile picture");
      expect(profilePicture).toBeInTheDocument();
    });
  });

  it("navigates back to home page when Back button is clicked", () => {
    const { getByTestId } = renderProfilePage(mockCurrentUser);

    const backButton = getByTestId("back-button");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("shows loading state when user data is not yet available", async () => {
    // Render with null user to simulate loading state
    const { getByTestId } = renderProfilePage(null);

    // Show the <LoadingSpinner> component
    await waitFor(() => {
      const loadingElement = getByTestId("loading-spinner");
      expect(loadingElement).toBeInTheDocument();
    });
  });
});
