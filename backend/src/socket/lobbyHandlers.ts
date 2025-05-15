import { Server, Socket } from "socket.io";
import { User } from "../types/types.js";

export let lobbyPlayers: User[] = [];
const maxLobbyPlayers = 6;
let gameInProgress = false;

export function setGameInProgress(value: boolean) {
  gameInProgress = value;
}

export default function registerLobbyHandlers(io: Server, socket: Socket) {
  /**
   * Listener for when a player joins the game.
   * Broadcasts the updated list of players to all clients.
   *
   * @param newPlayer - the new player joining the lobby.
   */
  socket.on("player-join", (newPlayer: User) => {
    if (lobbyPlayers.length >= maxLobbyPlayers) {
      io.to(socket.id).emit("lobby-full");
      return;
    }
    if (gameInProgress) {
      io.to(socket.id).emit("game-in-progress");
      return;
    }
    if (!lobbyPlayers.some((p) => p._id === newPlayer._id)) {
      lobbyPlayers.push(newPlayer);
    }

    socket.join("game-room");
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
    lobbyPlayers = lobbyPlayers.filter((player) => player._id !== leavingPlayer._id);
    socket.leave("game-room");
    io.to("game-room").emit("lobby-change", lobbyPlayers);
  };
}
