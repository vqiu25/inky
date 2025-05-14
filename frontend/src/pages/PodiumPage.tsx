import styles from "../assets/css-modules/PodiumPage.module.css";
import PodiumUser from "../components/podiumComponents/PodiumUser";
import PageHeader from "../components/layoutComponents/PageHeader";
import LoadingSpinner from "../components/layoutComponents/LoadingSpinner";
import spinnerStyles from "../assets/css-modules/LoadingSpinner.module.css";
import { useContext, useEffect } from "react";
import { GameStateContext } from "../context/GameStateContext";
import { UsersContext } from "../context/UsersContext";
import useCurrentUser from "../hooks/useCurrentUser";
import PodiumIcon from "../assets/images/numbered-podium.svg";

export default function PodiumPage() {
  const { updateGamePlayer } = useContext(UsersContext)!;
  const { playerPoints } = useContext(GameStateContext)!;
  const gamePlayers = playerPoints.map((player) => player[0]);
  const currentUser = useCurrentUser();
  // sort playerpoints by descending order
  playerPoints.sort((a, b) => b[1] - a[1]);

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
      <PageHeader>Game Finished!</PageHeader>
      {playerPoints.length > 0 ? (
        <div className={styles.podiumContainer}>
          <div className={styles.podium}>
            <div className={styles.podiumPlayers}>
              <div className={styles.second}>
                {playerPoints[1] && (
                  <PodiumUser
                    user={playerPoints[1][0]}
                    points={playerPoints[1][1]}
                    isWinner={false}
                  />
                )}
              </div>
              <div className={styles.first}>
                <PodiumUser
                  user={playerPoints[0][0]}
                  points={playerPoints[0][1]}
                  isWinner={true}
                />
              </div>
              <div className={styles.third}>
                {playerPoints[2] && (
                  <PodiumUser
                    user={playerPoints[2][0]}
                    points={playerPoints[2][1]}
                    isWinner={false}
                  />
                )}
              </div>
            </div>
            <div className={styles.podiumIcon}>
              <img src={PodiumIcon} alt="Podium" />
            </div>
          </div>
          {playerPoints[3] && (
            <div className={styles.podiumPlayers}>
              {playerPoints.slice(3, 6).map((player, index) => (
                <PodiumUser
                  key={index + 3}
                  user={player[0]}
                  points={player[1]}
                  isWinner={false}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={spinnerStyles.spinnerContainer}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
