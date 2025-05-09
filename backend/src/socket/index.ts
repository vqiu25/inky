import { Server, Socket } from "socket.io";
import registerLobbyHandlers from "./lobbyHandlers.js";
import registerGameHandlers from "./gameHandlers.js";

export default function initializeSocketIO(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    // Register lobby-related handlers
    registerLobbyHandlers(io, socket);

    // Register game-related handlers
    registerGameHandlers(io, socket);

    /**
     * Listener for when a user disconnects.
     */
    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
    });
  });
}
