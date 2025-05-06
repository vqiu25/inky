import { useContext, useEffect, useState } from "react";
import styles from "../assets/css-modules/ProfilePage.module.css";
import PageHeader from "../components/layoutComponents/PageHeader";
import ProfilePicture from "../components/userInfoComponents/ProfilePicture";
import ProfileInfoContainer from "../components/userInfoComponents/ProfileInfoContainer";
import { User } from "../types/types";
import { UsersContext } from "../context/UsersContextProvider";
import { useLocation } from "react-router-dom";

export default function ProfilePage() {
  const location = useLocation();
  const { getUserByEmail, refreshUsers } = useContext(UsersContext)!;
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const commonStyle = {
    justifyContent: "center",
    height: "50px",
    marginBottom: "0",
    flex: 1,
    paddingInline: "25px",
  };

  return (
    <div>
      <PageHeader>Profile</PageHeader>
      <div className={styles.container}>
        <div>
          <ProfilePicture
            src={currentUser.profilePicture}
            pictureBorderSize={{ width: "200px", height: "200px" }}
            profilePictureSize={{
              width: "140px",
              height: "140px",
            }}
          />
        </div>
        <div>
          <ProfileInfoContainer title="Name" pillStyles={commonStyle}>
            {currentUser.username}
          </ProfileInfoContainer>
          <ProfileInfoContainer title="Games" pillStyles={commonStyle}>
            {currentUser.totalGames}
          </ProfileInfoContainer>
          <ProfileInfoContainer title="Points" pillStyles={commonStyle}>
            {currentUser.totalPoints}
          </ProfileInfoContainer>
          <ProfileInfoContainer
            title="High Score"
            containerStyles={{ marginBottom: "0" }}
            pillStyles={commonStyle}
          >
            {currentUser.highScore}
          </ProfileInfoContainer>
        </div>
      </div>
    </div>
  );
}
