import "dotenv/config";

import mongoose from "mongoose";
import User from "./user-schema.js";
import Phrase from "./phrase-schema.js";

const users = [
  {
    username: "testuser1",
    email: "testuser1@gmail.com",
    profilePicture: "src/assets/images/logo.svg",
    lobby: 1,
    totalGames: 0,
    totalPoints: 0,
    highScore: 0,
    totalWins: 0,
    powerups: {
      timeIncrease: 0,
      timeDecrease: 0,
      revealLetter: 0,
      inkSplatter: 0,
      scoreMultiplier: 0,
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
    email: "testuser2@gmail.com",
    profilePicture: "src/assets/images/paintbrush.svg",
    lobby: 0,
    totalGames: 0,
    totalPoints: 0,
    highScore: 0,
    totalWins: 0,
    powerups: {
      timeIncrease: 0,
      timeDecrease: 0,
      revealLetter: 0,
      inkSplatter: 0,
      scoreMultiplier: 0,
      eraseDrawing: 0
    },
    achievements: {
      gameAchievement: false,
      powerupAchievement: false,
      scoreAchievement: false
    }
  }
];

const phrases = [
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
  await Phrase.deleteMany({});

  await User.insertMany(users);
  await Phrase.insertMany(phrases);

  await mongoose.disconnect();
}

run();
