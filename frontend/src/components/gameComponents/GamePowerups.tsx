import React, { useState, useContext, useEffect, useRef, JSX } from "react";
import ReactDOM from "react-dom";
import styles from "../../assets/css-modules/GamePowerups.module.css";
import Button from "./Button";
import squidIcon from "../../assets/images/squid.svg";
import magnifyingGlassIcon from "../../assets/images/magnifying-glass.svg";
import rocketIcon from "../../assets/images/rocket.svg";
import crossIcon from "../../assets/images/cross.svg";
import greenHourGlassIcon from "../../assets/images/green-hourglass.svg";
import redHourGlassIcon from "../../assets/images/red-hourglass.svg";
import { UsersContext } from "../../context/UsersContext";
import { GameStateContext } from "../../context/GameStateContext";
import { socket } from "../../services/socket";
import InkSplatterOverlay from "./InkSplatterOverlay";

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
  const { currentUser } = useContext(UsersContext)!;
  const { currentDrawer } = useContext(GameStateContext)!;

  // State for ink splash overlay
  const [showSplash, setShowSplash] = useState(false);
  const [isSplashFading, setIsSplashFading] = useState(false);

  // Listen for splash-changed events
  useEffect(() => {
    if (!currentUser) return;

    const handler = (payload: {
      userId: string;
      expiry: number;
      drawer: string;
    }) => {
      const { userId, expiry, drawer } = payload;
      if (currentUser._id === userId || currentUser._id === drawer) return;

      const now = Date.now();
      const msLeft = expiry - now;
      if (msLeft <= 0) return;

      setShowSplash(true);
      setIsSplashFading(false);

      const fadeTimer = setTimeout(() => setIsSplashFading(true), msLeft - 250);
      const hideTimer = setTimeout(() => {
        setShowSplash(false);
        setIsSplashFading(false);
      }, msLeft);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    };

    socket.on("splash-changed", handler);
    return () => {
      socket.off("splash-changed", handler);
    };
  }, [currentUser, currentDrawer]);

  useEffect(() => {
    const endHandler = () => {
      if (showSplash) {
        setIsSplashFading(true);
        setTimeout(() => {
          setShowSplash(false);
          setIsSplashFading(false);
        }, 250);
      }
    };

    socket.on("new-turn", endHandler);
    socket.on("game-finished", endHandler);
    return () => {
      socket.off("new-turn", endHandler);
      socket.off("game-finished", endHandler);
    };
  }, [showSplash]);

  const [selected, setSelected] = useState<PowerupConfig | null>(null);

  const powerupConfigs: PowerupConfig[] = [
    {
      imageSrc: greenHourGlassIcon,
      alt: "timeIncrease",
      colour: "#a3e635",
      handler: () => {
        if (currentUser) socket.emit("increase-time", currentUser._id);
      },
    },
    {
      imageSrc: magnifyingGlassIcon,
      alt: "revealLetter",
      colour: "#d946ef",
      handler: () => {
        if (currentUser) socket.emit("reveal-letter-powerup", currentUser._id);
      },
    },
    {
      imageSrc: rocketIcon,
      alt: "scoreMultiplier",
      colour: "#f3e3ab",
      handler: () => {
        if (currentUser)
          socket.emit("increment-powerup", currentUser._id, "scoreMultiplier");
      },
    },
    {
      imageSrc: redHourGlassIcon,
      alt: "timeDecrease",
      colour: "#ef4444",
      handler: () => {
        if (currentUser) socket.emit("decrease-time", currentUser._id);
      },
    },
    {
      imageSrc: squidIcon,
      alt: "inkSplatter",
      colour: "#6366f1",
      handler: () => {
        if (currentUser) {
          socket.emit("ink-splash", currentUser._id);
        }
      },
    },
    {
      imageSrc: crossIcon,
      alt: "eraseDrawing",
      colour: "#f97316",
      handler: () => {
        if (currentUser)
          socket.emit("increment-powerup", currentUser._id, "eraseDrawing");
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
        <Overlay powerup={selected} onClose={() => setSelected(null)} />
      )}
      {showSplash && <InkSplatterOverlay fading={isSplashFading} />}
    </>
  );
}

function Overlay({ powerup, onClose }: OverlayProps): React.ReactPortal {
  const [visible, setVisible] = useState(true);
  const handlerCalledRef = useRef(false);

  useEffect(() => {
    if (!handlerCalledRef.current) {
      powerup.handler();
      handlerCalledRef.current = true;
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
    document.body
  );
}
