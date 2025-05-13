import { useState, useEffect, useRef } from "react";
import logoSrc from "../../assets/images/logo.svg";
import dropletSrc from "../../assets/images/droplet.svg";
import styles from "../../assets/css-modules/AnimatedLogo.module.css";

interface Droplet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export interface AnimatedLogoProps {
  size?: number;
  hoverThreshold?: number;
}

export default function AnimatedLogo({
  size = 120,
  hoverThreshold = 150,
}: AnimatedLogoProps) {
  // Cursor-follow offset
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const logoRef = useRef<HTMLImageElement>(null);

  // Droplets
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const nextId = useRef(0);
  const lastSpawn = useRef(0);

  // Track mouse for tilt
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const damp = 0.2;
      setOffset(
        dist < hoverThreshold ? { x: dx * damp, y: dy * damp } : { x: 0, y: 0 },
      );
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [hoverThreshold]);

  // Droplet physics
  useEffect(() => {
    const GRAVITY = 40; // px/sec²
    const LIFESPAN = 3; // seconds
    let last = performance.now();

    const frame = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      setDroplets((list) =>
        list
          .map((d) => {
            const nd = { ...d };
            nd.vy += GRAVITY * dt;
            nd.x += nd.vx * dt;
            nd.y += nd.vy * dt;
            nd.life += dt;
            return nd;
          })
          .filter((d) => d.life < LIFESPAN),
      );

      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }, []);

  // Spawn droplets on hover
  const handleMouseEnter = () => {
    const now = performance.now();
    if (now - lastSpawn.current < 500) return;
    lastSpawn.current = now;

    if (!logoRef.current) return;
    const rect = logoRef.current.getBoundingClientRect();
    const w = rect.width,
      h = rect.height;
    const spreadX = w * 0.2,
      spreadY = h * 0.2;
    const randX = w / 2 + (Math.random() * 2 - 1) * spreadX;
    const randY = h / 2 + (Math.random() * 2 - 1) * spreadY;
    const vx = (Math.random() * 2 - 1) * 20;
    const vy = Math.random() * 10;
    const id = nextId.current++;
    setDroplets((ds) => [...ds, { id, x: randX, y: randY, vx, vy, life: 0 }]);
  };

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      style={{ width: size, height: size }}
    >
      <img
        ref={logoRef}
        src={logoSrc}
        alt="Inky Logo"
        className={styles.logo}
        style={{
          width: size,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: "transform 0.2s ease",
        }}
      />
      {droplets.map((d) => (
        <img
          key={d.id}
          src={dropletSrc}
          className={styles.droplet}
          style={{
            left: d.x,
            top: d.y,
            opacity: 1 - d.life / 2,
          }}
          alt="droplet"
        />
      ))}
    </div>
  );
}
