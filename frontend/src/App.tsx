import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import DrawerCanvas from "./components/DrawerCanvas";
import GuesserCanvas from "./components/GuesserCanvas";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Navigate to="/login" replace />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="lobby" element={<LobbyPage />} />
      <Route path="play" element={<GamePage />}>
        <Route index element={<DrawerCanvas />} />
      </Route>
      <Route path="play/guesser" element={<GuesserCanvas />} />
      <Route path="leaderboard" element={<LeaderboardPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
