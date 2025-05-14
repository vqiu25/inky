import { useEffect, useState } from "react";
import styles from "../assets/css-modules/ProfilePage.module.css";
import PageHeader from "../components/layoutComponents/PageHeader";
import ProfilePicture from "../components/profileComponents/ProfilePicture";
import ProfileInfoContainer from "../components/profileComponents/ProfileInfoContainer";
import { PowerupNames } from "../types/types";
import LoadingSpinner from "../components/layoutComponents/LoadingSpinner";
import spinnerStyles from "../assets/css-modules/LoadingSpinner.module.css";
import squid from "../assets/images/squid.svg";
import rocket from "../assets/images/rocket.svg";
import cross from "../assets/images/cross.svg";
import greenHourglass from "../assets/images/green-hourglass.svg";
import redHourglass from "../assets/images/red-hourglass.svg";
import magnifyingGlass from "../assets/images/magnifying-glass.svg";
import PowerupAchievement from "../components/profileComponents/PowerupAchievement";
import GameAchievement from "../components/profileComponents/GameAchievement";
import medal from "../assets/images/medal.svg";
import podium from "../assets/images/podium.svg";
import trophy from "../assets/images/trophy.svg";
import award from "../assets/images/award.svg";
import militaryTech from "../assets/images/military-tech.svg";
import useCurrentUser from "../hooks/useCurrentUser";

export default function ProfilePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const currentUser = useCurrentUser();

  useEffect(() => {
    setLoading(currentUser === null);
  }, [currentUser]);

  const commonStyle = {
    justifyContent: "center",
    height: "45px",
    marginBottom: "0",
    flex: 1,
    paddingInline: "25px",
    width: "fit-content",
    whiteSpace: "nowrap",
  };

  const imgStyle = {
    width: "50px",
    height: "50px",
    marginBottom: "15px",
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader marginTop="0">Profile</PageHeader>
      {loading || !currentUser ? (
        <div className={spinnerStyles.spinnerContainer}>
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <div className={styles.pageLayout}>
            <div
              className={styles.verticalContainer}
              style={{ padding: "30px", flex: "0 1" }}
            >
              <ProfilePicture
                src={currentUser?.profilePicture}
                pictureBorderSize={{
                  width: "140px",
                  height: "140px",
                  borderWidth: "5px",
                }}
                profilePictureSize={{
                  width: "100px",
                  height: "100px",
                }}
              />
              <div style={{ marginTop: "20px" }}>
                <ProfileInfoContainer title="Name" pillStyles={commonStyle}>
                  {currentUser?.username}
                </ProfileInfoContainer>
                <ProfileInfoContainer title="Games" pillStyles={commonStyle}>
                  {currentUser?.totalGames}
                </ProfileInfoContainer>
                <ProfileInfoContainer title="Points" pillStyles={commonStyle}>
                  {currentUser?.totalPoints}
                </ProfileInfoContainer>
                <ProfileInfoContainer title="Wins" pillStyles={commonStyle}>
                  {currentUser?.totalWins}
                </ProfileInfoContainer>
                <ProfileInfoContainer
                  title="High Score"
                  pillStyles={commonStyle}
                >
                  {currentUser?.highScore}
                </ProfileInfoContainer>
              </div>
            </div>
            <div className={styles.verticalLayout}>
              <div
                className={styles.verticalContainer}
                style={{ paddingInline: "70px" }}
              >
                <h2 className={styles.title}>Powerups Used</h2>
                <div className={styles.powerupsContainer}>
                  <PowerupAchievement
                    imgSrc={greenHourglass}
                    imgStyle={imgStyle}
                    pillContent={currentUser?.powerups.timeIncrease}
                    tooltipText={PowerupNames.timeIncrease}
                  />
                  <PowerupAchievement
                    imgSrc={magnifyingGlass}
                    imgStyle={imgStyle}
                    pillContent={currentUser?.powerups.revealLetter}
                    tooltipText={PowerupNames.revealLetter}
                  />
                  <PowerupAchievement
                    imgSrc={rocket}
                    imgStyle={imgStyle}
                    pillContent={currentUser?.powerups.scoreMultiplier}
                    tooltipText={PowerupNames.scoreMultiplier}
                  />
                  <PowerupAchievement
                    imgSrc={redHourglass}
                    imgStyle={imgStyle}
                    pillContent={currentUser?.powerups.timeDecrease}
                    tooltipText={PowerupNames.timeDecrease}
                  />
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
                </div>
              </div>
              <div
                className={styles.verticalContainer}
                style={{ marginTop: "20px" }}
              >
                <h2 className={styles.title}>Achievements</h2>
                <div className={styles.achievementsContainer}>
                  <GameAchievement
                    src={medal}
                    tooltipContent="Score 1000 Points"
                    achieved={currentUser.achievements.pointsAchievement}
                  />
                  <GameAchievement
                    src={award}
                    tooltipContent="Use 10 Powerups"
                    achieved={currentUser.achievements.powerupAchievement}
                  />
                  <GameAchievement
                    src={militaryTech}
                    tooltipContent="Play 5 Games"
                    achieved={currentUser.achievements.gameAchievement}
                    imgSize={{ width: "85px", height: "85px" }}
                  />
                  <GameAchievement
                    src={podium}
                    tooltipContent="Win 5 Games"
                    achieved={currentUser.achievements.winsAchievement}
                  />
                  <GameAchievement
                    src={trophy}
                    tooltipContent="High Score of 500+"
                    achieved={currentUser.achievements.highScoreAchievement}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
