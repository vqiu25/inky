import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UsersContext } from "../context/UsersContext";
import { User } from "../types/types";
import styles from "../assets/css-modules/LobbyPage.module.css";
import PageHeader from "../components/layoutComponents/PageHeader";
import UserInfo from "../components/userInfoComponents/UserInfo";
import InfoPill from "../components/userInfoComponents/InfoPill";

export default function LobbyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserByEmail, refreshUsers } = useContext(UsersContext)!;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [playersList, setPlayersList] = useState<User[]>([]);

  // Get the current user
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const email = JSON.parse(storedUser).email;
        const updatedUser = await getUserByEmail(email);
        setCurrentUser(updatedUser);
      }
    };

    fetchUser();
  }, [location, getUserByEmail, refreshUsers]);

  // Get the list of players in the lobby
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users?inLobby=true`,
        );
        const data: User[] = await res.json();
        setPlayersList(data);
      } catch (err) {
        console.error("Failed to fetch players:", err);
      }
    };

    fetchPlayers();

    // The socket.io method requires the io object to be passed from app.ts all the way down to users, so I am just polling instead
    const interval = setInterval(fetchPlayers, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <PageHeader exitLobby={true}>Lobby</PageHeader>
      <div className={styles.container}>
        {playersList.map((player) => (
          <InfoPill
            key={player._id}
            children={
              <UserInfo
                user={player}
                isCurrent={currentUser?.email === player.email}
              />
            }
            className="darkBackground"
            style={{ minWidth: "450px", paddingInlineEnd: "10px" }}
          />
        ))}
        <div style={{ height: "20px" }}></div>
        <button className={styles.button} onClick={() => navigate("/play")}>
          Enter Game
        </button>
      </div>
    </div>
  );
}
