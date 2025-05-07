import React from "react";
import InfoPill from "../userInfoComponents/InfoPill";
import { Tooltip } from "react-tooltip";

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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        marginLeft: "40px",
        alignItems: "center",
        marginBottom: "10px",
        ...style,
      }}
      data-tooltip-id="tooltip"
      data-tooltip-content={tooltipText}
    >
      <img src={imgSrc} style={imgStyle} alt="Powerup" />
      <InfoPill
        className="lightBackground"
        style={{ justifyContent: "center", marginBottom: "0", width: "60px" }}
      >
        {pillContent}
      </InfoPill>
      <Tooltip id="tooltip" />
    </div>
  );
}
