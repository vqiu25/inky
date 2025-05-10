import "dotenv/config";

import mongoose from "mongoose";
import User from "./user-schema.js";
import Phrase from "./phrase-schema.js";

const users = [
  {
    username: "testuser1",
    email: "testuser1@gmail.com",
    profilePicture: "src/assets/images/logo.svg"
  },
  {
    username: "testuser2",
    email: "testuser2@gmail.com",
    profilePicture: "src/assets/images/paintbrush.svg"
  }
];

const phrases = [
  {
    phrase: "Bungee jumping"
  },
  {
    phrase: "Sky diving"
  },
  {
    phrase: "Cinnamoroll"
  },
  {
    phrase: "SpongeBob SquarePants"
  },
  {
    phrase: "Harry Potter"
  },
  {
    phrase: "The Simpsons"
  },
  {
    phrase: "The Lion King"
  },
  {
    phrase: "The Matrix"
  },
  {
    phrase: "The Avengers"
  },
  {
    phrase: "The Incredibles"
  },
  {
    phrase: "Attack on Titan"
  },
  {
    phrase: "One Piece"
  },
  {
    phrase: "Naruto"
  },
  {
    phrase: "Dragon Ball Z"
  },
  {
    phrase: "My Hero Academia"
  },
  {
    phrase: "Demon Slayer"
  },
  {
    phrase: "Death Note"
  },
  {
    phrase: "Sword Art Online"
  },
  {
    phrase: "Fullmetal Alchemist"
  },
  {
    phrase: "Tokyo Ghoul"
  },
  {
    phrase: "Fairy Tail"
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
