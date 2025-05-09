import { Server, Socket } from "socket.io";
import { User } from "../types/types";

export let lobbyPlayers: User[] = [];
const maxLobbyPlayers = 6;

export default function registerLobbyHandlers(io: Server, socket: Socket) {
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
}
