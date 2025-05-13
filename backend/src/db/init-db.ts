import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "./user-schema.js";
import Phrase from "./phrase-schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function loadPhrasesFromFile(filePath: string): Promise<{ phrase: string }[]> {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  return lines.map((line) => ({ phrase: line }));
}

async function insertPhrases() {
  const phrasesFilePath = path.resolve(__dirname, "phrases.txt");
  const phrases = await loadPhrasesFromFile(phrasesFilePath);
  for (let i = 0; i < phrases.length; i += 100) {
    const batch = phrases.slice(i, i + 100);
    await Phrase.insertMany(batch);
  }
}

async function run() {
  const dbConnectionString = process.env.MONGODB_CONNECTION_STRING;

  if (!dbConnectionString) {
    throw new Error("MONGODB_CONNECTION_STRING is not defined in .env file");
  }

  await mongoose.connect(dbConnectionString);

  await User.deleteMany({});
  await Phrase.deleteMany({});

  await User.insertMany(users);
  await insertPhrases();

  await mongoose.disconnect();
}

run();
