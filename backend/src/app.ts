import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const PORT = process.env.PORT ?? 3000;

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

import routes from "./routes/routes";
app.use("/", routes);

const dbConnectionString = process.env.MONGODB_CONNECTION_STRING;

if (!dbConnectionString) {
  throw new Error("MONGODB_CONNECTION_STRING is not defined in .env file");
}

io.on("connection", (socket: Socket) => {
  console.log("A user connected", socket.id);

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
