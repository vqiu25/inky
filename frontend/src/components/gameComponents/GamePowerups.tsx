import React, { useState, useEffect, JSX, useContext, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "../../assets/css-modules/GamePowerups.module.css";
import Button from "./Button";
import { UsersContext } from "../../context/UsersContext";
import { socket } from "../../services/socket";
import squidIcon from "../../assets/images/squid.svg";
import magnifyingGlassIcon from "../../assets/images/magnifying-glass.svg";
import rocketIcon from "../../assets/images/rocket.svg";
import crossIcon from "../../assets/images/cross.svg";
import greenHourGlassIcon from "../../assets/images/green-hourglass.svg";
import redHourGlassIcon from "../../assets/images/red-hourglass.svg";

interface PowerupConfig {
  imageSrc: string;
  alt: string;
  colour: string;
  handler: () => void;
}

interface OverlayProps {
  powerup: PowerupConfig;
  onClose: () => void;
}

export default function GamePowerups(): JSX.Element {
  const [selected, setSelected] = useState<PowerupConfig | null>(null);
  const { currentUser } = useContext(UsersContext)!;

  const powerupConfigs: PowerupConfig[] = [
    {
      imageSrc: greenHourGlassIcon,
      alt: "timeIncrease",
      colour: "#a3e635",
      handler: () => {
        console.log("client: emitting increment-powerup");
        if (currentUser) {
          socket.emit("increase-time", currentUser._id);
        }
      },
    },
    {
      imageSrc: magnifyingGlassIcon,
      alt: "revealLetter",
      colour: "#d946ef",
      handler: () => {
        if (currentUser) {
          socket.emit("increment-powerup", currentUser._id, "revealLetter");
        }
      },
    },
    {
      imageSrc: rocketIcon,
      alt: "scoreMultiplier",
      colour: "#f3e3ab",
      handler: () => {
        if (currentUser) {
          socket.emit("increment-powerup", currentUser._id, "scoreMultiplier");
        }
      },
    },
    {
      imageSrc: redHourGlassIcon,
      alt: "timeDecrease",
      colour: "#ef4444",
      handler: () => {
        if (currentUser) {
          socket.emit("decrease-time", currentUser._id);
        }
      },
    },
    {
      imageSrc: squidIcon,
      alt: "inkSplatter",
      colour: "#6366f1",
      handler: () => {
        if (currentUser) {
          socket.emit("increment-powerup", currentUser._id, "inkSplatter");
        }
      },
    },
    {
      imageSrc: crossIcon,
      alt: "eraseDrawing",
      colour: "#f97316",
      handler: () => {
        if (currentUser) {
          socket.emit("increment-powerup", currentUser._id, "eraseDrawing");
        }
      },
    },
  ];

  return (
    <>
      <div className={styles.powerupArea}>
        <div className={styles.powerupGrid}>
          {powerupConfigs.map((powerup, idx) => (
            <Button
              key={idx}
              imageSrc={powerup.imageSrc}
              alt={powerup.alt}
              onClick={() => setSelected(powerup)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <Overlay
          powerup={selected}
          onClose={() => {
            setSelected(null);
          }}
        />
      )}
    </>
  );
}

function Overlay({ powerup, onClose }: OverlayProps): React.ReactPortal {
  const [visible, setVisible] = useState(true);

  const handlerCalledRef = useRef(false);

  useEffect(() => {
    if (!handlerCalledRef.current) {
      console.log("Calling powerup handler");
      powerup.handler();
      handlerCalledRef.current = true; // Mark the handler as called
    }
  }, [powerup]);

  useEffect(() => {
    const autoHide = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(autoHide);
  }, []);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onClose, 250);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return ReactDOM.createPortal(
    <div
      className={`${styles.overlay} ${visible ? styles.fadeIn : styles.fadeOut}`}
    >
      <div className={styles.sparkles}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={styles.sparkle}
            style={
              { "--i": i, "--color": powerup.colour } as React.CSSProperties
            }
          />
        ))}
      </div>
      <img
        src={powerup.imageSrc}
        alt={powerup.alt}
        className={`${styles.overlayImage} ${visible ? styles.popIn : styles.popOut}`}
      />
    </div>,
    document.body,
  );
}
