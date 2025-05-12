import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import PodiumPage from "./pages/PodiumPage";
import ProtectedRoute from "./services/ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Progress } from "./types/types";

function App() {
  const { isJwtValid } = useContext(AuthContext)!;
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            (() => {
              console.log("JWT valid?", isJwtValid());
              return isJwtValid() ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              );
            })()
          }
        />

      </Route>
      <Route path="home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route path="login" element={<LoginPage />} />
      <Route
        path="lobby"
        element={
          <ProtectedRoute requiredStep={Progress.HOME}>
            <LobbyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="play"
        element={
          <ProtectedRoute requiredStep={Progress.LOBBY}>
            <GamePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="leaderboard"
        element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="podium"
        element={
          <ProtectedRoute requiredStep={Progress.GAME}>
            <PodiumPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
