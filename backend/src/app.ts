import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { User } from "./types/types.js";
import {
  GameState,
  getInitialGameState,
  getNewGameState,
  updatePlayerPoints,
  getMaxRounds,
  incrementPowerupCountInGameState
} from "./game-state/game-state.js";

const PORT = process.env.PORT ?? 3000;

let currentGameState: GameState;
let numPlayersGuessed = 0;
let lobbyPlayers: User[] = [];
const maxLobbyPlayers = 6;

let currentTimerDuration: number | null = null; // Remaining time in seconds
let timerInterval: NodeJS.Timeout | null = null;

const turnTime = 90; // Duration of each turn in seconds

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
  console.log("A user connected", socket.id);

  /**
   * Starts a timer for the game.
   * It emits the remaining time every second.
   *
   * @param duration - The duration in seconds for the timer.
   */
  const startTimer = (duration: number): void => {
    currentTimerDuration = duration; // Set the initial duration
    console.log("Starting timer with duration:", duration);

    // Clear any existing interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    // Start a new interval to emit the timer every second
    timerInterval = setInterval(() => {
      if (currentTimerDuration !== null) {
        currentTimerDuration -= 1; // Decrement the timer

        if (currentTimerDuration <= 0) {
          if (timerInterval) {
            clearInterval(timerInterval); // Stop the timer when it reaches 0
          }
          timerInterval = null;
          currentTimerDuration = null;

          console.log("Timer ended");
          io.to("game-room").emit("timer", 0); // Emit 0 to indicate the timer has ended

          endTurn();
        } else {
          io.to("game-room").emit("timer", currentTimerDuration); // Emit the time
        }
      }
    }, 1000);
  };

  /**
   * Ends the current turn and starts a new one.
   * If the game is finished, it emits a "game-finished" event.
   * Otherwise, it emits a "drawer-select" event to select the next drawer.
   */
  const endTurn = (): void => {
    currentGameState = getNewGameState(currentGameState);
    // if the game is finished
    if (currentGameState.round > getMaxRounds()) {
      io.to("game-room").emit("game-finished", currentGameState);
    } else {
      io.to("game-room").emit("drawer-select", currentGameState.drawer);
    }
  };

  /**
   * Listener for when a player joins the game.
   * Broadcasts the updated list of players to all clients.
   *
   * @param newPlayer - the new player joining the lobby.
   */
  socket.on("player-join", (newPlayer: User) => {
    console.log("I'm the server. Got new player", newPlayer.username);
    if (lobbyPlayers.length >= maxLobbyPlayers) {
      console.log("I'm the server. Lobby is full. Can't add more players.");
      io.to(socket.id).emit("lobby-full", "hey there");
      return;
    }
    if (!lobbyPlayers.some((p) => p._id === newPlayer._id)) {
      lobbyPlayers.push(newPlayer);
    }

    socket.join("game-room");
    console.log("I'm the server. Updated players count:", lobbyPlayers.length);
    io.to("game-room").emit("lobby-change", lobbyPlayers);
  });

  /**
   * Listener for when a player leaves the lobby.
   * Broadcasts the updated list of lobby players to clients in lobby room.
   *
   * @param leavingPlayer - the player leaving the lobby.
   */
  socket.on("player-leave", (leavingPlayer: User) => {
    playerLeaveLobby(leavingPlayer);
  });

  const playerLeaveLobby = (leavingPlayer: User): void => {
    console.log("I'm the server. Got player leave", leavingPlayer.username);
    lobbyPlayers = lobbyPlayers.filter((player) => player._id !== leavingPlayer._id);
    console.log("I'm the server. Updated players count:", lobbyPlayers.length);
    socket.leave("game-room");
    io.to("game-room").emit("lobby-change", lobbyPlayers);
  };

  /**
   * Listener for when the game starts (from the lobby).
   * Broadcasts the drawer to all clients, signaling for the drawer to select a word.
   *
   * @param players - The players in the game.
   */
  socket.on("game-start", (players: User[]) => {
    currentGameState = getInitialGameState(players);

    // Remove all players from the lobby
    lobbyPlayers = [];
    io.to("game-room").emit("lobby-change", lobbyPlayers);

    io.to("game-room").emit("drawer-select", currentGameState.drawer);
    console.log("Broadcasting drawer to game-room:", currentGameState.drawer);

    startTimer(turnTime); // TODO: Remove this line as timer should be started in the word-selected event
  });

  /**
   * Listener for when the drawer selects a word.
   * Updates the previous game state with the new word.
   * Broadcasts the new game state to all clients, indicating the start of the turn.
   *
   * @param word - The word selected by the drawer.
   */
  socket.on("word-selected", (word: string) => {
    console.log("Word selected: ", word);
    currentGameState.wordToGuess = word;
    io.to("game-room").emit("new-turn", currentGameState);

    startTimer(turnTime); // Restart the timer for the new turn
  });

  /**
   * Listener for when someone guesses the word.
   * Broadcasts the player who guessed the word to all clients.
   *
   * @param player - The player who guessed the word.
   * @param timeRemaining - The time remaining when the word was guessed.
   */
  socket.on("word-guessed", (player: User, timeRemaining: number) => {
    numPlayersGuessed++;
    console.log("Word guessed by player: ", player);
    currentGameState.playerPoints = updatePlayerPoints(currentGameState, player, timeRemaining);

    // If all players have guessed the word, the turn should end
    if (numPlayersGuessed >= currentGameState.playerPoints.length) {
      numPlayersGuessed = 0;
      endTurn();
    } else {
      io.to("game-room").emit("word-guessed", player); // Broadcast the player who guessed the word
    }
  });

  socket.on("canvas-data", (data) => {
    console.log("Server Canvas Data: ", data);
    // Broadcast the canvas data to all clients in the game room except the sender
    socket.to("game-room").emit("canvas-data", data);
  });

  socket.on("chat-data", (data) => {
    console.log("Server Chat Data: ", data);
    // Broadcast the chat data to all clients in the game room except the sender
    socket.to("game-room").emit("chat-data", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });

  /* Powerup Socket Listeners */
  socket.on("increment-powerup", (userId: string, powerupName: keyof User["powerups"]) => {
    incrementPowerupCountInGameState(currentGameState, userId, powerupName);
  });
});

mongoose.connect(dbConnectionString).then(() => {
  server.listen(PORT, () => console.log(`App server listening on port ${PORT}!`));
});
