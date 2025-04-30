import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Navigate to="/login" replace />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="lobby" element={<LobbyPage />} />
    </Routes>
  );
}

export default App;
