import { Server, Socket } from "socket.io";
import { User } from "../types/types.js";
import { lobbyPlayers, setGameInProgress } from "./lobbyHandlers.js";
import {
  GameState,
  getNewGameState,
  updatePlayerPoints,
  getMaxRounds,
  incrementPowerupCountInGameState,
  getInitialGameState,
  setUserSplash,
  clearUserSplash,
  PlayerState
} from "../game-state/game-state.js";

export let currentGameState: GameState;
let numPlayersGuessed = 0;

// For the timer
let currentTimerDuration: number | null = null; // Remaining time in seconds
let timerInterval: NodeJS.Timeout | null = null;
const turnTime = 90; // Duration of each turn in seconds

// For the word reveal
let revealInterval: NodeJS.Timeout | null = null;
let unrevealedIndices: number[] = [];

// For the next turn countdown
let nextTurnCountdownInterval: NodeJS.Timeout | null = null;
let nextTurnCountdownDuration = 4;

// Benchmark values for achievements
const gamesForAchievement = 5;
const pointsForAchievement = 10000;
const powerupsForAchievement = 50;
const winsForAchievement = 5;
const highScoreForAchievement = 1000;

export default function registerGameHandlers(io: Server, socket: Socket) {
  /**
   * Listener for when the game starts (from the lobby).
   * Broadcasts the drawer to all clients, signaling for the drawer to select a word.
   *
   * @param players - The players in the game.
   */
  socket.on("game-start", (players: User[]) => {
    currentGameState = getInitialGameState(players);
    setGameInProgress(true);

    io.to("game-room").emit("drawer-select", currentGameState.drawer);
  });

  /**
   * Starts a timer for the game.
   * It emits the remaining time every second.
   *
   * @param duration - The duration in seconds for the timer.
   */
  const startTimer = (duration: number): void => {
    currentTimerDuration = duration; // Set the initial duration

    // Clear any existing interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    io.to("game-room").emit("timer", currentTimerDuration); // Emit the time

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
  const finishGame = (): PlayerState[] => {
    const updatedPlayerStates = currentGameState.playerStates;
    let winners: PlayerState[] = [];
    for (let i = 0; i < updatedPlayerStates.length; i++) {
      const user = updatedPlayerStates[i].user;
      const userPoints = updatedPlayerStates[i].points;

      if (winners.length === 0 || userPoints > winners[0].points) {
        winners = [updatedPlayerStates[i]];
      } else if (userPoints === winners[0].points) {
        winners.push(updatedPlayerStates[i]);
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
      const winnerUser = winner.user;
      winnerUser.totalWins += 1;
      if (winnerUser.totalWins === winsForAchievement) {
        winnerUser.achievements.winsAchievement = true;
      }
    }

    setGameInProgress(false);

    return updatedPlayerStates;
  };

  /**
   * Ends the current turn and starts a new one.
   * If the game is finished, it emits a "game-finished" event and updates user properties.
   * Otherwise, it emits a "drawer-select" event to select the next drawer.
   */
  const endTurn = (timeOut: boolean, drawerLeft?: boolean, goToResults?: boolean): void => {
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
    io.to("game-room").emit("turn-end", timeOut, drawerLeft);
    numPlayersGuessed = 0;

    // Clear any existing interval
    if (nextTurnCountdownInterval) {
      clearInterval(nextTurnCountdownInterval);
    }

    io.to("game-room").emit("next-turn-timer", nextTurnCountdownDuration);

    // Start a new interval to emit the timer every second
    nextTurnCountdownInterval = setInterval(() => {
      nextTurnCountdownDuration -= 1; // Decrement the timer
      if (nextTurnCountdownDuration <= 0) {
        if (nextTurnCountdownInterval) {
          clearInterval(nextTurnCountdownInterval); // Stop the timer when it reaches 0
        }
        nextTurnCountdownInterval = null;
        nextTurnCountdownDuration = 4;

        io.to("game-room").emit("next-turn-timer", 0); // Emit 0 to indicate the timer has ended

        if (currentGameState.round > getMaxRounds() || goToResults) {
          finishGame();
          io.to("game-room").emit("game-finished", currentGameState);
        } else {
          io.to("game-room").emit("drawer-select", currentGameState.drawer);
        }
      } else {
        io.to("game-room").emit("next-turn-timer", nextTurnCountdownDuration); // Emit the time
      }
    }, 1000);
  };

  /**
   * Listener for when the drawer selects a word.
   * Updates the previous game state with the new word.
   * Broadcasts the new game state to all clients, indicating the start of the turn.
   *
   * @param word - The word selected by the drawer.
   */
  socket.on("word-selected", (word: string) => {
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
      if (
        unrevealedIndices.length === 0 ||
        unrevealedIndices.length < currentGameState.wordToGuess.length / 2
      ) {
        clearInterval(revealInterval!);
        return;
      }
      // Pick a random index from unrevealedIndices every 20 seconds
      const pickIdx = Math.floor(Math.random() * unrevealedIndices.length);
      const letterIndex = unrevealedIndices.splice(pickIdx, 1)[0];
      io.to("game-room").emit("reveal-letter", { index: letterIndex });
    }, 20_000);
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
    currentGameState.playerStates = updatePlayerPoints(currentGameState, player, timeRemaining);
    io.to("game-room").emit("new-scores", currentGameState.playerStates);
    io.to("game-room").emit("word-guessed", player); // Broadcast the player who guessed the word
    // If all players have guessed the word, the turn should end
    if (numPlayersGuessed >= lobbyPlayers.length - 1) {
      numPlayersGuessed = 0;
      endTurn(false);
    }
  });

  socket.on("canvas-data", (data) => {
    // Broadcast the canvas data to all clients in the game room except the sender
    socket.to("game-room").emit("canvas-data", data);
  });

  socket.on("chat-data", (data) => {
    // Broadcast the chat data to all clients in the game room except the sender
    socket.to("game-room").emit("chat-data", data);
  });

  type PowerupKey =
    | "eraseDrawing"
    | "inkSplatter"
    | "scoreMultiplier"
    | "revealLetter"
    | "timeIncrease"
    | "timeDecrease";

  const emitPowerupMessage = (powerupLabel: string, username: string, powerup: PowerupKey) => {
    const message = {
      username: "System",
      text: `${username} used ${powerupLabel}!`,
      type: "powerup",
      powerup
    };

    io.to("game-room").emit("chat-data", message);
  };

  const getUserById = (userId: string): User | undefined => {
    return currentGameState.playerStates.find((player: PlayerState) => player.user._id === userId)
      ?.user;
  };

  /* Increase Time Powerup Listener */
  socket.on("increase-time", (userId: string) => {
    if (currentTimerDuration) {
      startTimer((currentTimerDuration += 30));
    }
    incrementPowerupCountInGameState(currentGameState, userId, "timeIncrease");
    emitPowerupMessage("Increase Time", getUserById(userId)?.username || "Unknown", "timeIncrease");
  });

  /* Decrease Time Powerup Listener */
  socket.on("decrease-time", (userId: string) => {
    if (currentTimerDuration) {
      startTimer((currentTimerDuration -= 30));
    }
    incrementPowerupCountInGameState(currentGameState, userId, "timeDecrease");
    emitPowerupMessage("Decrease Time", getUserById(userId)?.username || "Unknown", "timeDecrease");
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
    emitPowerupMessage("Ink Splash", getUserById(userId)?.username || "Unknown", "inkSplatter");
  });

  socket.on("clear-canvas-powerup", (userId: string) => {
    incrementPowerupCountInGameState(currentGameState, userId, "eraseDrawing");
    emitPowerupMessage("Erase Canvas", getUserById(userId)?.username || "Unknown", "eraseDrawing");
  });

  /* Reveal Letter Powerup Listener */
  socket.on("reveal-letter-powerup", (userId: string) => {
    io.to("game-room").emit("reveal-letter", { index: 0, userId });
    incrementPowerupCountInGameState(currentGameState, userId, "revealLetter");
    emitPowerupMessage("Reveal Letter", getUserById(userId)?.username || "Unknown", "revealLetter");
  });

  /* Multiplier Powerup Listener */
  socket.on("multiplier-powerup", (userId: string) => {
    //set boolean in playerPoints for the player to true
    currentGameState.playerStates.forEach((player) => {
      if (player.user._id === userId) {
        player.scoreMultiplier = true;
      }
    });
    incrementPowerupCountInGameState(currentGameState, userId, "scoreMultiplier");
    emitPowerupMessage(
      "Score Multiplier",
      getUserById(userId)?.username || "Unknown",
      "scoreMultiplier"
    );
  });

  /**
   * Listener for when a player leaves the game.
   * Removes the player from the game state and ends the turn if the drawer leaves.
   */
  socket.on("leave-game", (userId: string) => {
    if (!currentGameState?.playerStates?.length) {
      return;
    }

    // Remove the player from the game state
    currentGameState.playerStates.forEach((player) => {
      if (player.user._id === userId) {
        player.hasLeftGame = true;
      }
    });

    const isDrawerLeaving = currentGameState.drawer._id === userId;
    const isOnePlayerLeft = currentGameState.playerStates.length === 2;
    const haveAllLeft = currentGameState.playerStates.length === 1;

    if ((isDrawerLeaving || isOnePlayerLeft) && !haveAllLeft) {
      nextTurnCountdownDuration = 5;
      numPlayersGuessed = 0;
      endTurn(isOnePlayerLeft && !isDrawerLeaving, isDrawerLeaving, isOnePlayerLeft);
      return;
    }

    // If all players have in the game have guessed the word, the turn should end
    if (numPlayersGuessed >= currentGameState.playerStates.length - 2 && !haveAllLeft) {
      numPlayersGuessed = 0;
      nextTurnCountdownDuration = 5;
      endTurn(false);
      return;
    }

    currentGameState.playerStates = currentGameState.playerStates.filter(
      (player) => player.user._id !== userId
    );
  });
}
