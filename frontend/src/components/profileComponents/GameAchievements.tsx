import { Tooltip } from "react-tooltip";

import styles from "../../assets/css-modules/GameAchievements.module.css";
import "react-tooltip/dist/react-tooltip.css";

interface GameAchievementsProps {
  iconName: string;
  tooltipContent: string;
}

export default function GameAchievements({
  iconName,
  tooltipContent,
}: GameAchievementsProps) {
  return (
    <div>
      <div
        className={`${styles.img} material-icons`}
        data-tooltip-id="tooltip"
        data-tooltip-content={tooltipContent}
      >
        {iconName}
      </div>
      <Tooltip id="tooltip" />
    </div>
  );
}
