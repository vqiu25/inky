import { User } from "../types/types.js";

const maxRounds: number = 1;
const turnTime: number = 90;

export interface GameState {
  round: number;
  wordToGuess: string;
  drawer: User;
  playerStates: PlayerState[];
  timeRemaining: number;
  splashExpiries: Record<string, number>;
}

export interface PlayerState {
  user: User;
  points: number;
  scoreMultiplier: boolean;
  hasLeftGame: boolean;
  hasGuessedWord: boolean;
}

export const getMaxRounds = (): number => {
  return maxRounds;
};

export const getInitialGameState = (players: User[]): GameState => {
  return {
    round: 1,
    wordToGuess: "",
    drawer: players[0],
    playerStates: players.map((player) => ({
      user: player,
      points: 0,
      scoreMultiplier: false,
      hasLeftGame: false,
      hasGuessedWord: false
    })),
    timeRemaining: turnTime,
    splashExpiries: {}
  };
};

/**
 * Create the new game state for the next turn.
 *
 * @param previousGameState - The previous turn's game state.
 * @returns the new game state for the next turn. or false if the game is over
 */
export const getNewGameState = (previousGameState: GameState): GameState => {
  const previousDrawerIndex = previousGameState.playerStates.findIndex(
    (player: PlayerState) => player.user == previousGameState.drawer
  );

  const isNewRound: boolean = previousDrawerIndex === previousGameState.playerStates.length - 1;
  const newRound = isNewRound ? previousGameState.round + 1 : previousGameState.round;

  const newDrawer = isNewRound
    ? previousGameState.playerStates[0].user
    : previousGameState.playerStates[previousDrawerIndex + 1]?.user;

  // Filter out players who have left the game
  previousGameState.playerStates = previousGameState.playerStates.filter(
    (player: PlayerState) => !player.hasLeftGame
  );

  if (previousGameState.playerStates.length === 0) {
    return {
      ...previousGameState
    };
  }

  // Reset scoreMultiplier and hasGuessedWord boolean in playerPoints to false
  for (let i = 0; i < previousGameState.playerStates.length; i++) {
    previousGameState.playerStates[i].scoreMultiplier = false;
    previousGameState.playerStates[i].hasGuessedWord = false;
  }

  return {
    round: newRound,
    wordToGuess: "",
    drawer: newDrawer,
    playerStates: previousGameState.playerStates,
    timeRemaining: turnTime,
    splashExpiries: {}
  };
};

/**
 * Calculates new points for when someone guesses the word.
 *
 * @param gameState - The current game state.
 * @param player - The player who guessed the word.
 * @param timeRemaining - The time remaining when the word was guessed.
 * @returns - The updated player points with the new points for the player and drawer.
 */
export const updatePlayerPoints = (
  gameState: GameState,
  player: User,
  timeRemaining: number
): PlayerState[] => {
  const scoreMultiplier = 1.5;
  const updatedPlayerStates: PlayerState[] = gameState.playerStates;
  for (let i = 0; i < updatedPlayerStates.length; i++) {
    // Award points to the guesser
    if (updatedPlayerStates[i].user._id === player._id) {
      updatedPlayerStates[i].points += Math.round(
        updatedPlayerStates[i].scoreMultiplier ? timeRemaining * scoreMultiplier : timeRemaining
      );
      // Award points to the drawer
      updatedPlayerStates[i].hasGuessedWord = true;
    } else if (updatedPlayerStates[i].user._id === gameState.drawer._id) {
      updatedPlayerStates[i].points += Math.round(
        timeRemaining / (gameState.playerStates.length - 1)
      );
    }
  }

  return updatedPlayerStates;
};

/**
 * Increments the count of a specific powerup for a player in the game state.
 *
 * @param gameState - The current game state.
 * @param userId - The ID of the user whose powerup count should be incremented.
 * @param powerupName - The key of the powerup to increment.
 * @returns true if update succeeded, false otherwise.
 */
export const incrementPowerupCountInGameState = (
  gameState: GameState,
  userId: string,
  powerupName: keyof User["powerups"]
): boolean => {
  for (let i = 0; i < gameState.playerStates.length; i++) {
    const user = gameState.playerStates[i].user;
    if (user._id === userId) {
      if (user.powerups[powerupName] !== undefined) {
        user.powerups[powerupName]++;
        return true;
      }
      // Invalid powerup name
      console.error(`Invalid powerup name: ${powerupName}`);
      return false;
    }
  }
  // User not found in the game state
  console.error(`User with ID ${userId} not found in game state`);
  return false;
};

/**
 * Activate a splash for a user for the given duration (ms).
 */
export const setUserSplash = (gameState: GameState, userId: string, durationMs: number): void => {
  gameState.splashExpiries[userId] = Date.now() + durationMs;
};

/**
 * Clear a user's splash immediately, or remove expired splashes if no userId.
 */
export const clearUserSplash = (gameState: GameState, userId?: string): void => {
  if (userId) {
    delete gameState.splashExpiries[userId];
  } else {
    const now = Date.now();
    Object.entries(gameState.splashExpiries).forEach(([id, expiry]) => {
      if (expiry <= now) {
        delete gameState.splashExpiries[id];
      }
    });
  }
};

/**
 * Check if a user's splash is still active.
 */
export const isUserSplashActive = (gameState: GameState, userId: string): boolean => {
  const expiry = gameState.splashExpiries[userId];
  return expiry !== undefined && expiry > Date.now();
};
