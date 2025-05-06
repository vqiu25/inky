import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ObjectId } from "mongodb";
import {
  GameState,
  getInitialGameState,
  getNewGameState,
  updatePlayerPoints,
  getMaxRounds
} from "./game-state/game-state.js";

const PORT = process.env.PORT ?? 3000;

let currentGameState: GameState;
let numPlayersGuessed = 0;

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

import routes from "./routes/routes.js";
app.use("/", routes);

const dbConnectionString = process.env.MONGODB_CONNECTION_STRING;

if (!dbConnectionString) {
  throw new Error("MONGODB_CONNECTION_STRING is not defined in .env file");
}

io.on("connection", (socket: Socket) => {
  const endTurn = (): void => {
    currentGameState = getNewGameState(currentGameState);
    // if the game is finished
    if (currentGameState.round > getMaxRounds()) {
      socket.emit("game-finished", currentGameState);
    } else {
      socket.emit("drawer-select", currentGameState.drawer);
    }
  };
  console.log("A user connected", socket.id);

  /**
   * Listener for when a player joins the game.
   * Broadcasts the updated list of players to all clients.
   *
   * @param players - The players in the game. Will be updated on the clients side.
   */
  socket.on("player-join", (players: ObjectId[]) => {
    console.log("Players is now", players);
    socket.emit("player-join", players);
  });

  /**
   * listener for when the game starts (from the lobby).
   * Broadcasts the drawer to all clients. Signalling for the drawer to select a word.
   *
   * @param players - The players in the game.
   */
  socket.on("game-start", (players: ObjectId[]) => {
    currentGameState = getInitialGameState(players);
    socket.emit("drawer-select", currentGameState.drawer);
    console.log("broadcasting drawer", currentGameState.drawer);
  });

  /**
   * Listener for when the drawer selects a word.
   * Updates the previous game state with the new word.
   * Broadcasts the new game state to all clients. Indicating the start of the turn.
   *
   * @param word - The word selected by the drawer.
   */
  socket.on("word-selected", (word: string) => {
    console.log("Word selected: ", word);
    currentGameState.wordToGuess = word;
    socket.emit("new-turn", currentGameState);
  });

  /**
   * Listener for when someone guesses the word.
   * Broadcasts the player who guessed the word to all clients.
   *
   * @param player - The player who guessed the word.
   * @param timeRemaining - The time remaining when the word was guessed. Ill be kept track of on the clients side.
   */
  socket.on("word-guessed", (player: ObjectId, timeRemaining: number) => {
    numPlayersGuessed++;
    console.log("Word guessed by player: ", player);
    currentGameState.playerPoints = updatePlayerPoints(currentGameState, player, timeRemaining);

    // if all the players have guessed the word, the turn should end
    if (numPlayersGuessed >= currentGameState.playerPoints.length) {
      numPlayersGuessed = 0;
      endTurn();
    } else {
      socket.emit("word-guessed", player); // broadcast the player who guessed the word to update UI on other clients
    }
  });

  socket.on("time-out", () => {
    endTurn();
  });

  socket.on("canvas-data", (data) => {
    console.log("Server Canvas Data: ", data);
    socket.broadcast.emit("canvas-data", data);
  });

  socket.on("chat-data", (data) => {
    console.log("Server Chat Data: ", data);
    socket.broadcast.emit("chat-data", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

mongoose.connect(dbConnectionString).then(() => {
  server.listen(PORT, () => console.log(`App server listening on port ${PORT}!`));
});
