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
  pointsAchievement: boolean;
  powerupAchievement: boolean;
  winsAchievement: boolean;
  highScoreAchievement: boolean;
}

export interface User {
  _id: string;
  email: string;
  username: string;
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
  revealLetter = "Reveal a Letter",
}


export enum Progress {
  HOME = "home",
  LOBBY = "lobby",
  GAME = "game",
}
export interface Phrase {
  phrase: string;
}

export interface GameState {
  round: number;
  wordToGuess: string;
  drawer: User;
  playerPoints: [User, number][];
  timeRemaining: number;
}
