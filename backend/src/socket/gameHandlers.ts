import { Server, Socket } from "socket.io";
import { User } from "../types/types.js";
import {
  GameState,
  getNewGameState,
  updatePlayerPoints,
  getMaxRounds,
  incrementPowerupCountInGameState,
  getInitialGameState,
  setUserSplash,
  clearUserSplash
} from "../game-state/game-state.js";
import { lobbyPlayers } from "./lobbyHandlers.js";

export let currentGameState: GameState;
let numPlayersGuessed = 0;

let currentTimerDuration: number | null = null; // Remaining time in seconds
let timerInterval: NodeJS.Timeout | null = null;

// For the word reveal
let revealInterval: NodeJS.Timeout | null = null;
let unrevealedIndices: number[] = [];

const turnTime = 90; // Duration of each turn in seconds

// Benchmark values for achievements
const gamesForAchievement = 5;
const pointsForAchievement = 1000;
const powerupsForAchievement = 10;
const winsForAchievement = 5;
const highScoreForAchievement = 500;

export default function registerGameHandlers(io: Server, socket: Socket) {
  /**
   * Listener for when the game starts (from the lobby).
   * Broadcasts the drawer to all clients, signaling for the drawer to select a word.
   *
   * @param players - The players in the game.
   */
  socket.on("game-start", (players: User[]) => {
    currentGameState = getInitialGameState(players);

    io.to("game-room").emit("lobby-change", lobbyPlayers);

    io.to("game-room").emit("drawer-select", currentGameState.drawer);
    console.log("Broadcasting drawer to game-room:", currentGameState.drawer.username);
  });

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

          endTurn(true);
        } else {
          io.to("game-room").emit("timer", currentTimerDuration); // Emit the time
        }
      }
    }, 1000);
  };

  /**
   * Update all of the user properties based on the game results.
   */
  const finishGame = (): [User, number][] => {
    const updatedPlayerPoints = currentGameState.playerPoints;
    let winners: [User, number][] = [];
    for (let i = 0; i < updatedPlayerPoints.length; i++) {
      const user = updatedPlayerPoints[i][0];
      const userPoints = updatedPlayerPoints[i][1];

      if (winners.length === 0 || userPoints > winners[0][1]) {
        winners = [updatedPlayerPoints[i]];
      } else if (userPoints === winners[0][1]) {
        winners.push(updatedPlayerPoints[i]);
      }

      user.totalGames += 1;
      user.totalPoints += userPoints;
      user.highScore = Math.max(user.highScore, userPoints);

      if (user.totalGames === gamesForAchievement) {
        user.achievements.gameAchievement = true;
      }
      if (user.totalPoints >= pointsForAchievement) {
        user.achievements.pointsAchievement = true;
      }
      const totalPowerups = Object.values(user.powerups)
        .filter((value) => typeof value === "number")
        .reduce((acc, value) => acc + value, 0);
      if (totalPowerups >= powerupsForAchievement) {
        user.achievements.powerupAchievement = true;
      }
      if (user.highScore >= highScoreForAchievement) {
        user.achievements.highScoreAchievement = true;
      }
    }

    for (const winner of winners) {
      const winnerUser = winner[0];
      winnerUser.totalWins += 1;
      if (winnerUser.totalWins === winsForAchievement) {
        winnerUser.achievements.winsAchievement = true;
      }
    }

    return updatedPlayerPoints;
  };

  /**
   * Ends the current turn and starts a new one.
   * If the game is finished, it emits a "game-finished" event and updates user properties.
   * Otherwise, it emits a "drawer-select" event to select the next drawer.
   */
  const endTurn = (timeOut: boolean): void => {
    currentGameState = getNewGameState(currentGameState);

    // Reset the timer for word reveal
    if (revealInterval) {
      clearInterval(revealInterval);
      revealInterval = null;
    }

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    io.to("game-room").emit("turn-end", timeOut);
  };

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

    // Reset & Start the Word Reveal Interval
    if (revealInterval) clearInterval(revealInterval);
    unrevealedIndices = word
      .slice(1)
      .split("")
      .map((_, i) => i + 1);

    revealInterval = setInterval(() => {
      if (unrevealedIndices.length === 0) {
        clearInterval(revealInterval!);
        return;
      }
      // Pick a random index from unrevealedIndices every 20 seconds
      const pickIdx = Math.floor(Math.random() * unrevealedIndices.length);
      const letterIndex = unrevealedIndices.splice(pickIdx, 1)[0];
      io.to("game-room").emit("reveal-letter", { index: letterIndex });
    }, 20_000);
  });

  socket.on("next-turn", () => {
    // if the game is finished
    if (currentGameState.round > getMaxRounds()) {
      finishGame();
      io.to("game-room").emit("game-finished", currentGameState);
    } else {
      io.to("game-room").emit("drawer-select", currentGameState.drawer);
    }
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
    console.log("Word guessed by player: ", player.username);
    currentGameState.playerPoints = updatePlayerPoints(currentGameState, player, timeRemaining);
    io.to("game-room").emit("new-scores", currentGameState.playerPoints);
    io.to("game-room").emit("word-guessed", player); // Broadcast the player who guessed the word
    // If all players have guessed the word, the turn should end
    if (numPlayersGuessed >= currentGameState.playerPoints.length - 1) {
      numPlayersGuessed = 0;
      endTurn(false);
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

  /* Powerup Socket Listeners */
  socket.on("increment-powerup", (userId: string, powerupName: keyof User["powerups"]) => {
    incrementPowerupCountInGameState(currentGameState, userId, powerupName);
  });

  /* Increase Time Powerup Listener */
  socket.on("increase-time", (userId: string) => {
    if (currentTimerDuration) {
      startTimer((currentTimerDuration += 30));
    }
    incrementPowerupCountInGameState(currentGameState, userId, "timeIncrease");
  });

  /* Decrease Time Powerup Listener */
  socket.on("decrease-time", (userId: string) => {
    if (currentTimerDuration) {
      startTimer((currentTimerDuration -= 30));
    }
    incrementPowerupCountInGameState(currentGameState, userId, "timeDecrease");
  });

  /* Ink Splatter Powerup Listener  */
  socket.on("ink-splash", (userId: string) => {
    const durationMs = Math.min(10000, (currentTimerDuration ?? turnTime) * 1000);
    setUserSplash(currentGameState, userId, durationMs);
    const drawerId = currentGameState.drawer._id;
    const expiry = currentGameState.splashExpiries[userId];

    // notify clients of splash with expiry timestamp
    io.to("game-room").emit("splash-changed", {
      userId,
      expiry,
      drawer: drawerId
    });

    setTimeout(() => {
      clearUserSplash(currentGameState, userId);
    }, durationMs);

    incrementPowerupCountInGameState(currentGameState, userId, "inkSplatter");
  });

  /* Reveal Letter Powerup Listener */
  socket.on("reveal-letter-powerup", (userId: string) => {
    io.to("game-room").emit("reveal-letter", { index: 0, userId });
    incrementPowerupCountInGameState(currentGameState, userId, "revealLetter");
  });
}
