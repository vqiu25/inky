import "dotenv/config";

import mongoose from "mongoose";
import User from "./user-schema";
import Dictionary from "./dictionary-schema";

const users = [
  {
    username: "testuser1",
    profileImage: "https://example.com/image1.jpg",
    totalGames: 0,
    totalPoints: 0,
    highScore: 0,
    powerups: {
      timeIncrease: 0,
      timeDecrease: 0,
      revealLetter: 0,
      inkSplatter: 0,
      removePoints: 0,
      eraseDrawing: 0
    },
    achievements: {
      gameAchievement: false,
      powerupAchievement: false,
      scoreAchievement: false
    }
  },
  {
    username: "testuser2",
    profileImage: "https://example.com/image2.jpg",
    totalGames: 0,
    totalPoints: 0,
    highScore: 0,
    powerups: {
      timeIncrease: 0,
      timeDecrease: 0,
      revealLetter: 0,
      inkSplatter: 0,
      removePoints: 0,
      eraseDrawing: 0
    },
    achievements: {
      gameAchievement: false,
      powerupAchievement: false,
      scoreAchievement: false
    }
  }
];

const dictionary = [
  {
    phrase: "Bungee jumping"
  },
  {
    phrase: "Sky diving"
  }
];

async function run() {
  const dbConnectionString = process.env.MONGODB_CONNECTION_STRING;

  if (!dbConnectionString) {
    throw new Error("MONGODB_CONNECTION_STRING is not defined in .env file");
  }

  await mongoose.connect(dbConnectionString);

  await User.deleteMany({});
  await Dictionary.deleteMany({});

  await User.insertMany(users);
  await Dictionary.insertMany(dictionary);

  await mongoose.disconnect();
}

run();
