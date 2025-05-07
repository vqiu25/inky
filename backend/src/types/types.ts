export interface Powerups {
  timeIncrease: number;
  timeDecrease: number;
  revealLetter: number;
  inkSplatter: number;
  scoreMultiplier: number;
  eraseDrawing: number;
}

export interface Achievements {
  gameAchievement: boolean;
  powerupAchievement: boolean;
  scoreAchievement: boolean;
}

export interface User {
  _id: string;
  email: string;
  username: string;
  lobby: number; // 0 = not in lobby, 1 = in lobby, > 1 if we have more lobbies in the future
  profilePicture: string;
  totalGames: number;
  totalPoints: number;
  highScore: number;
  totalWins: number;
  powerups: Powerups;
  achievements: Achievements;
}

export interface ChatMessage {
  username: string;
  text: string;
}

export enum PowerupNames {
  inkSplatter = "Ink Splotch",
  scoreMultiplier = "Score Multiplier",
  timeIncrease = "Add Time",
  timeDecrease = "Decrease Time",
  eraseDrawing = "Clear Drawing",
  revealLetter = "Reveal a Letter"
}
