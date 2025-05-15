import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../LoginPage";
import { UsersContext } from "../../context/UsersContext";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextType } from "../../context/AuthContextProvider";
import { UsersContextType } from "../../context/UsersContextProvider";

// Mock the useNavigate hook
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Create mocks
const mockNavigate = vi.fn();
const mockAddUser = vi.fn();
const mockGetUsers = vi.fn();
const mockUpdateCurrentUser = vi.fn();
const mockSetJwt = vi.fn();
const mockSetIsAuthenticated = vi.fn();

// Mock Google Sign-In Button component to access its callback
vi.mock("../../components/signInComponents/GoogleSignInButton", () => ({
  default: ({
    onSignInSuccess,
  }: {
    onSignInSuccess: (response: { credential: string }) => void;
  }) => {
    // Store the callback for later use in tests
    window.googleSignInCallback = onSignInSuccess;
    return <div data-testid="google-signin-button">Google Sign In</div>;
  },
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup user mock data
    mockGetUsers.mockResolvedValue([
      { email: "existing@example.com", name: "Existing User" },
    ]);

    mockAddUser.mockResolvedValue({
      id: "new-user-id",
      email: "new@example.com",
      name: "New User",
      profilePicture: "profile-pictures/some-picture.svg",
    });
  });

  function renderLoginPage() {
    const mockAuthContextValue: AuthContextType = {
      getJwt: () => "mockJwt",
      setJwt: mockSetJwt,
      clearJwt: vi.fn(),
      isAuthenticated: false,
      setIsAuthenticated: mockSetIsAuthenticated,
      isJwtValid: vi.fn(),
      getJwtEmail: vi.fn(),
      progress: null,
      setProgress: vi.fn(),
      getUserByEmail: vi.fn(),
    };

    const mockUsersContextValue: UsersContextType = {
      usersLoading: false,
      addUser: mockAddUser,
      refreshUsers: mockGetUsers,
      getUserById: vi.fn(),
      updateGamePlayer: vi.fn(),
      usersList: [],
      setUsersList: vi.fn(),
      getCurrentUser: vi.fn(),
      clearCurrentUser: vi.fn(),
      updateCurrentUser: mockUpdateCurrentUser,
      getUsers: mockGetUsers,
    };

    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <UsersContext.Provider value={mockUsersContextValue}>
            <LoginPage />
          </UsersContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );
  }

  it("renders correctly with logo and Google sign-in button", () => {
    const { getByText, getByTestId } = renderLoginPage();
    expect(getByText("Inky")).toBeInTheDocument();
    expect(getByTestId("google-signin-button")).toBeInTheDocument();
  });

  it("handles Google sign-in for an existing user", async () => {
    renderLoginPage();

    // Create a mock JWT with the necessary payload structure
    const mockJwt = createMockJwt({
      email: "existing@example.com",
      name: "Existing User",
      exp: Math.floor(Date.now() / 1000) + 3600, // Expiry in 1 hour
    });

    // Trigger the Google sign-in callback with mock response
    await window.googleSignInCallback({ credential: mockJwt });

    // Verify JWT is processed correctly
    expect(mockSetJwt).toHaveBeenCalledWith(mockJwt);
    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);

    // For existing users, we shouldn't call addUser
    expect(mockAddUser).not.toHaveBeenCalled();

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("handles Google sign-in for a new user", async () => {
    renderLoginPage();

    // Create a mock JWT for a new user
    const mockJwt = createMockJwt({
      email: "new@example.com",
      name: "New User",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    // Trigger the Google sign-in callback
    await window.googleSignInCallback({ credential: mockJwt });

    // Verify JWT handling
    expect(mockSetJwt).toHaveBeenCalledWith(mockJwt);
    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);

    // For new users, we should call addUser with the right info
    await waitFor(() => {
      expect(mockAddUser).toHaveBeenCalledWith(
        "New User",
        expect.stringMatching(/^profile-pictures\/.+\.(png|svg)$/),
        "new@example.com",
      );
      expect(mockUpdateCurrentUser).toHaveBeenCalled();
    });

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("handles error during user creation", async () => {
    // Mock console.error to prevent test output clutter
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Make addUser throw an error
    mockAddUser.mockRejectedValue(new Error("Database error"));

    renderLoginPage();

    const mockJwt = createMockJwt({
      email: "new@example.com",
      name: "New User",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    // Trigger the Google sign-in callback
    await window.googleSignInCallback({ credential: mockJwt });

    await waitFor(() => {
      // Verify error is logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to create user:",
        expect.any(Error),
      );

      // Should not navigate
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});

// Helper function to create a mock JWT
function createMockJwt(payload: object): string {
  // Create a simple mock JWT with header, payload, and signature parts
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = "fake_signature";

  return `${header}.${encodedPayload}.${signature}`;
}

// Add the callback type to the global Window interface
declare global {
  interface Window {
    googleSignInCallback: (response: { credential: string }) => void;
  }
}
