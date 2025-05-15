import { Achievements, Phrase, Powerups, User } from "../../types/types";

export const mockPowerUps: Powerups = {
  timeIncrease: 1,
  timeDecrease: 1,
  revealLetter: 1,
  inkSplatter: 1,
  scoreMultiplier: 1,
  eraseDrawing: 1,
};

export const mockAchievements: Achievements = {
  gameAchievement: true,
  pointsAchievement: true,
  powerupAchievement: true,
  winsAchievement: true,
  highScoreAchievement: true,
};

export const mockCurrentUser: User = {
  _id: "user123",
  username: "TestUser",
  email: "test@example.com",
  profilePicture: "profile-pictures/cat.svg",
  totalGames: 10,
  totalPoints: 500,
  highScore: 300,
  totalWins: 5,
  powerups: mockPowerUps,
  achievements: mockAchievements,
};

export const newUsers: User[] = [
  {
    _id: "user1",
    username: "Player1",
    email: "p1@example.com",
    profilePicture: "pic1.png",
    totalGames: 5,
    totalPoints: 200,
    highScore: 100,
    totalWins: 2,
    powerups: mockPowerUps,
    achievements: mockAchievements,
  },
  {
    _id: "user2",
    username: "Player2",
    email: "p2@example.com",
    profilePicture: "pic2.png",
    totalGames: 3,
    totalPoints: 150,
    highScore: 80,
    totalWins: 1,
    powerups: mockPowerUps,
    achievements: mockAchievements,
  },
];

export const mockPhrases: Phrase[] = [
  { _id: "1", phrase: "cat" },
  { _id: "2", phrase: "dog" },
  { _id: "3", phrase: "bird" },
];

// Helper function to create a mock JWT
export function createMockJwt(payload: object): string {
  // Create a simple mock JWT with header, payload, and signature parts
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = "fake_signature";

  return `${header}.${encodedPayload}.${signature}`;
}
