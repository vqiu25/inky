import React, { ReactNode } from "react";
import styles from "../assets/css-modules/ProfilePage.module.css";
import InfoPill from "./InfoPill";

interface InfoContainerProps {
  title: string;
  children: ReactNode;
  pillStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
}

export default function ProfileInfoContainer({
  title,
  children,
  pillStyles,
  containerStyles,
}: InfoContainerProps) {
  return (
    <span className={styles.infoContainer} style={containerStyles}>
      <h2>{title}</h2>
      <InfoPill className="lightBackground" style={pillStyles}>
        {children}
      </InfoPill>
    </span>
  );
}
