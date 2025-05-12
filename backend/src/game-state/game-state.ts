import { User } from "../types/types.js";

const maxRounds: number = 3;
const turnTime: number = 90;

export interface GameState {
  round: number;
  wordToGuess: string;
  drawer: User;
  playerPoints: [User, number, boolean][];
  timeRemaining: number;
  splashExpiries: Record<string, number>;
}

export const getMaxRounds = (): number => {
  return maxRounds;
};

export const getInitialGameState = (players: User[]): GameState => {
  return {
    round: 1,
    wordToGuess: "",
    drawer: players[0],
    playerPoints: players.map((player) => [player, 0, false]),
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
  const previousDrawerIndex = previousGameState.playerPoints.findIndex(
    (player) => player[0] == previousGameState.drawer
  );

  const isNewRound: boolean = previousDrawerIndex === previousGameState.playerPoints.length - 1;
  const newRound = isNewRound ? previousGameState.round + 1 : previousGameState.round;
  const newWord = "";
  const newDrawer = isNewRound
    ? previousGameState.playerPoints[0][0]
    : previousGameState.playerPoints[previousDrawerIndex + 1][0];

  // reset boolean in playerPoints to false
  for (let i = 0; i < previousGameState.playerPoints.length; i++) {
    previousGameState.playerPoints[i][2] = false;
  }

  return {
    round: newRound,
    wordToGuess: newWord,
    drawer: newDrawer,
    playerPoints: previousGameState.playerPoints,
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
): [User, number, boolean][] => {
  const updatedPlayerPoints: [User, number, boolean][] = gameState.playerPoints;
  for (let i = 0; i < updatedPlayerPoints.length; i++) {
    if (updatedPlayerPoints[i][0]._id === player._id) {
      updatedPlayerPoints[i][1] += updatedPlayerPoints[i][2] ? timeRemaining * 2 : timeRemaining;
      console.log(
        `Updating points for ${updatedPlayerPoints[i][0].username}(guesser) to ${updatedPlayerPoints[i][1]}`
      );
    } else if (updatedPlayerPoints[i][0]._id === gameState.drawer._id) {
      updatedPlayerPoints[i][1] += timeRemaining / (gameState.playerPoints.length - 1);
      console.log(
        `Updating points for ${updatedPlayerPoints[i][0].username}(drawer) to ${updatedPlayerPoints[i][1]}`
      );
    }
  }

  return updatedPlayerPoints;
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
  for (let i = 0; i < gameState.playerPoints.length; i++) {
    const [user] = gameState.playerPoints[i];
    if (user._id === userId) {
      if (user.powerups[powerupName] !== undefined) {
        user.powerups[powerupName]++;
        console.log(
          `Powerup ${powerupName} for user ${userId} incremented to ${user.powerups[powerupName]}`
        );
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
