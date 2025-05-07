import { User } from "../types/types";

const maxRounds: number = 3;
const turnTime: number = 90;

export interface GameState {
  round: number;
  wordToGuess: string;
  drawer: User;
  playerPoints: [User, number][];
  timeRemaining: number;
}

export const getMaxRounds = (): number => {
  return maxRounds;
};

export const getInitialGameState = (players: User[]): GameState => {
  return {
    round: 1,
    wordToGuess: "",
    drawer: players[0],
    playerPoints: players.map((player) => [player, 0]),
    timeRemaining: turnTime
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

  return {
    round: newRound,
    wordToGuess: newWord,
    drawer: newDrawer,
    playerPoints: previousGameState.playerPoints,
    timeRemaining: turnTime
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
): [User, number][] => {
  const updatedPlayerPoints: [User, number][] = gameState.playerPoints;
  for (let i = 0; i < updatePlayerPoints.length; i++) {
    if (updatedPlayerPoints[i][0] == player) {
      updatedPlayerPoints[i][1] += timeRemaining; //TODO: check what we want for this
    } else if (updatedPlayerPoints[i][0] == gameState.drawer) {
      updatedPlayerPoints[i][1] += timeRemaining / gameState.playerPoints.length; //TODO: check what we want for this
    }
  }

  return updatedPlayerPoints;
};
