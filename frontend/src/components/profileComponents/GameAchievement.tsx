import { Tooltip } from "react-tooltip";

import styles from "../../assets/css-modules/GameAchievement.module.css";
import "react-tooltip/dist/react-tooltip.css";
import { CSSProperties } from "react";

interface GameAchievementsProps {
  src: string;
  tooltipContent: string;
  achieved?: boolean;
  imgSize?: CSSProperties;
}

export default function GameAchievements({
  src,
  tooltipContent,
  achieved,
  imgSize,
}: GameAchievementsProps) {
  const achievedStyle = {
    opacity: achieved ? 1 : 0.3, // Grey out if not achieved
  };

  return (
    <div
      className={styles.pictureBorder}
      style={achievedStyle}
      data-tooltip-id="tooltip"
      data-tooltip-content={tooltipContent}
    >
      <img className={styles.img} src={src} style={imgSize}></img>
      <Tooltip id="tooltip" />
    </div>
  );
}
