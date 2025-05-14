import styles from "../assets/css-modules/LeaderboardPage.module.css";
import PodiumUserRow from "../components/podiumComponents/PodiumUserRow";
import PageHeader from "../components/layoutComponents/PageHeader";
import LoadingSpinner from "../components/layoutComponents/LoadingSpinner";
import spinnerStyles from "../assets/css-modules/LoadingSpinner.module.css";
import { useContext, useEffect } from "react";
import { GameStateContext } from "../context/GameStateContext";
import { UsersContext } from "../context/UsersContext";
import useCurrentUser from "../hooks/useCurrentUser";

export default function PodiumPage() {
  const { updateGamePlayer } = useContext(UsersContext)!;
  const { playerPoints } = useContext(GameStateContext)!;
  const gamePlayers = playerPoints.map((player) => player[0]);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    const updateCurrentUser = async () => {
      for (const player of gamePlayers) {
        if (player._id === currentUser?._id) {
          await updateGamePlayer(player);
        }
      }
    };
    updateCurrentUser();
  }, [currentUser]);

  return (
    <div>
      <PageHeader>Results</PageHeader>
      {playerPoints.length > 0 ? (
        <div className={styles.usersContainer}>
          {playerPoints
            .slice()
            .sort((a, b) => b[1] - a[1])
            .map((user) => (
              <PodiumUserRow
                key={user[0]._id}
                user={user[0]}
                points={user[1]}
              />
            ))}
        </div>
      ) : (
        <div className={spinnerStyles.spinnerContainer}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
