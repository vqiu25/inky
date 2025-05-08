import squidIcon from "../assets/images/squid.svg";
import magnifyingGlassIcon from "../assets/images/magnifying-glass.svg";
import rocketIcon from "../assets/images/rocket.svg";
import crossIcon from "../assets/images/cross.svg";
import greenHourGlassIcon from "../assets/images/green-hourglass.svg";
import redHourGlassIcon from "../assets/images/red-hourglass.svg";

export interface PowerupConfig {
  imageSrc: string;
  alt: string;
  colour: string;
  handler: () => void;
}

export const powerupConfigs: PowerupConfig[] = [
  {
    imageSrc: greenHourGlassIcon,
    alt: "Time Increase",
    colour: "#a3e635",
    handler: () => console.log("Activated: Time Increase"),
  },
  {
    imageSrc: magnifyingGlassIcon,
    alt: "Reveal Letter",
    colour: "#d946ef",
    handler: () => console.log("Activated: Reveal Letter"),
  },
  {
    imageSrc: rocketIcon,
    alt: "Score Multiplier",
    colour: "#f3e3ab",
    handler: () => console.log("Activated: Score Multiplier"),
  },
  {
    imageSrc: redHourGlassIcon,
    alt: "Time Decrease",
    colour: "#ef4444",
    handler: () => console.log("Activated: Time Decrease"),
  },
  {
    imageSrc: squidIcon,
    alt: "Ink Splatter",
    colour: "#6366f1",
    handler: () => console.log("Activated: Ink Splatter"),
  },
  {
    imageSrc: crossIcon,
    alt: "Erase Drawing",
    colour: "#f97316",
    handler: () => console.log("Activated: Erase Drawing"),
  },
];
