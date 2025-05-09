import React from "react";
import InfoPill from "../userInfoComponents/InfoPill";
import { Tooltip } from "react-tooltip";
import styles from "../../assets/css-modules/PowerupAchievement.module.css";

interface PowerupDisplayProps {
  imgSrc: string;
  imgStyle: React.CSSProperties;
  pillContent: React.ReactNode;
  tooltipText: string;
  style?: React.CSSProperties;
}

export default function PowerupAchievement({
  imgSrc,
  imgStyle,
  pillContent,
  tooltipText,
  style,
}: PowerupDisplayProps) {
  return (
    <div className={styles.container} style={style}>
      <img
        src={imgSrc}
        style={imgStyle}
        alt="Powerup"
        data-tooltip-id="tooltip"
        data-tooltip-content={tooltipText}
      />
      <InfoPill
        className="lightBackground"
        style={{
          justifyContent: "center",
          marginBottom: "0",
          width: "65px",
          height: "65px",
        }}
      >
        {pillContent}
      </InfoPill>
      <Tooltip id="tooltip" />
    </div>
  );
}
