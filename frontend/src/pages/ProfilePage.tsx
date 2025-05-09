import { useContext, useEffect, useState } from "react";
import styles from "../assets/css-modules/ProfilePage.module.css";
import PageHeader from "../components/layoutComponents/PageHeader";
import ProfilePicture from "../components/profileComponents/ProfilePicture";
import ProfileInfoContainer from "../components/profileComponents/ProfileInfoContainer";
import { PowerupNames } from "../types/types";
import { UsersContext } from "../context/UsersContext";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "../components/layoutComponents/LoadingSpinner";
import spinnerStyles from "../assets/css-modules/LoadingSpinner.module.css";
import squid from "../assets/images/squid.svg";
import rocket from "../assets/images/rocket.svg";
import cross from "../assets/images/cross.svg";
import greenHourglass from "../assets/images/green-hourglass.svg";
import redHourglass from "../assets/images/red-hourglass.svg";
import magnifyingGlass from "../assets/images/magnifying-glass.svg";
import PowerupAchievement from "../components/profileComponents/PowerupAchievement";
import GameAchievements from "../components/profileComponents/GameAchievements";

export default function ProfilePage() {
  const location = useLocation();
  const {
    getUserByEmail,
    refreshUsers,
    setCurrentUserFromLocalStorage,
    currentUser,
  } = useContext(UsersContext)!;
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    setCurrentUserFromLocalStorage();
    setLoading(false);
  }, [location, getUserByEmail, refreshUsers]);

  const commonStyle = {
    justifyContent: "center",
    height: "50px",
    marginBottom: "0",
    flex: 1,
    paddingInline: "25px",
  };

  const imgStyle = {
    width: "40px",
    height: "40px",
    marginInline: "10px",
  };

  return (
    <>
      <PageHeader>Profile</PageHeader>
      {loading || !currentUser ? (
        <div className={spinnerStyles.spinnerContainer}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className={styles.verticalContainer}>
            <div className={styles.container}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ProfilePicture
                  src={currentUser?.profilePicture}
                  pictureBorderSize={{ width: "200px", height: "200px" }}
                  profilePictureSize={{
                    width: "140px",
                    height: "140px",
                  }}
                />
                <div>
                  {(currentUser.achievements.gameAchievement ||
                    currentUser.achievements.powerupAchievement ||
                    currentUser.achievements.scoreAchievement) && (
                    <h2 style={{ textAlign: "center", marginTop: "30px" }}>
                      Achievements
                    </h2>
                  )}
                  <div className={styles.achievementsContainer}>
                    {currentUser.achievements.gameAchievement && (
                      <GameAchievements
                        iconName="military_tech"
                        tooltipContent="Played X Games"
                      ></GameAchievements>
                    )}
                    {currentUser.achievements.powerupAchievement && (
                      <GameAchievements
                        iconName="military_tech"
                        tooltipContent="Used X Powerups"
                      ></GameAchievements>
                    )}
                    {currentUser.achievements.scoreAchievement && (
                      <GameAchievements
                        iconName="military_tech"
                        tooltipContent="Achieved X Points"
                      ></GameAchievements>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <ProfileInfoContainer title="Name" pillStyles={commonStyle}>
                  {currentUser?.username}
                </ProfileInfoContainer>
                <ProfileInfoContainer title="Games" pillStyles={commonStyle}>
                  {currentUser?.totalGames}
                </ProfileInfoContainer>
                <ProfileInfoContainer title="Points" pillStyles={commonStyle}>
                  {currentUser?.totalPoints}
                </ProfileInfoContainer>
                <ProfileInfoContainer
                  title="High Score"
                  pillStyles={commonStyle}
                >
                  {currentUser?.highScore}
                </ProfileInfoContainer>
                <ProfileInfoContainer
                  title="Wins"
                  containerStyles={{ marginBottom: "0" }}
                  pillStyles={commonStyle}
                >
                  {currentUser?.totalWins}
                </ProfileInfoContainer>
              </div>
              <div>
                <PowerupAchievement
                  imgSrc={squid}
                  imgStyle={imgStyle}
                  pillContent={currentUser?.powerups.inkSplatter}
                  tooltipText={PowerupNames.inkSplatter}
                />
                <PowerupAchievement
                  imgSrc={cross}
                  imgStyle={imgStyle}
                  pillContent={currentUser?.powerups.eraseDrawing}
                  tooltipText={PowerupNames.eraseDrawing}
                />
                <PowerupAchievement
                  imgSrc={greenHourglass}
                  imgStyle={imgStyle}
                  pillContent={currentUser?.powerups.timeIncrease}
                  tooltipText={PowerupNames.timeIncrease}
                />
                <PowerupAchievement
                  imgSrc={redHourglass}
                  imgStyle={imgStyle}
                  pillContent={currentUser?.powerups.timeDecrease}
                  tooltipText={PowerupNames.timeDecrease}
                />
                <PowerupAchievement
                  imgSrc={rocket}
                  imgStyle={imgStyle}
                  pillContent={currentUser?.powerups.scoreMultiplier}
                  tooltipText={PowerupNames.scoreMultiplier}
                />
                <PowerupAchievement
                  imgSrc={magnifyingGlass}
                  imgStyle={imgStyle}
                  pillContent={currentUser?.powerups.revealLetter}
                  tooltipText={PowerupNames.revealLetter}
                  style={{ marginBottom: "0" }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
