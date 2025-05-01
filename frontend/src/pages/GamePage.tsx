import { Outlet } from "react-router-dom";

export default function GamePage() {
  return (
    <div>
      <h1>Game Page</h1>
      <p>Welcome to the game!</p>
      <Outlet />
    </div>
  );
}
