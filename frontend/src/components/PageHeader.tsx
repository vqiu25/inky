import { ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css-modules/PageHeader.module.css";
import axios from "axios";
import { UsersContext } from "../context/UsersContextProvider";

interface PageHeaderProps {
  children: ReactNode;
  backTo?: string; // This is optional and it defaults to "/home"
  exitLobby?: boolean; // Set lobby field of player back to 0 if true
}

export default function PageHeader({
  children,
  backTo = "/home",
  exitLobby = false,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const { getUserByEmail } = useContext(UsersContext)!;

  const handleBackButtonClick = async () => {
    if (exitLobby) {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const email = JSON.parse(storedUser).email;
        const currentUser = await getUserByEmail(email);
        if (currentUser) {
          const res = await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/api/users/${currentUser._id}`,
            {
              lobby: 0,
            },
          );
          if (res.status === 200) {
            console.log(`User ${currentUser.username} left the lobby`);
          } else {
            console.error(`Failed to leave the lobby: ${res}`);
          }
        }
      }
    }
    navigate(backTo);
  };

  return (
    <span className={styles.titleContainer}>
      <div className={styles.left}>
        <button
          className={`${styles.backButton} material-icons ${styles.arrow}`}
          onClick={() => handleBackButtonClick()}
        >
          arrow_back
        </button>
      </div>
      <h1>{children}</h1>
      <div className={styles.right}></div>
    </span>
  );
}
