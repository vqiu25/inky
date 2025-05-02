export type Player = {
  playerName: string;
  playerProfile: string;
};

export interface Powerups {
  timeIncrease: number;
  timeDecrease: number;
  revealLetter: number;
  inkSplatter: number;
  removePoints: number;
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
  powerups: Powerups;
  achievements: Achievements;
}

export interface ChatMessage {
  username: string;
  text: string;
}
