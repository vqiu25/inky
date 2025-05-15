import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import initializeSocketIO from "./socket/index.js";

const PORT = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

/**
 * CORS middleware to allow requests from specific origins.
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.startsWith("http://localhost") ||
        origin === "https://inky-frontend-ywb1.onrender.com"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(morgan("combined"));
app.use(express.json());
app.use(express.static("public"));

import routes from "./routes/routes.js";
app.use("/", routes);

const dbConnectionString = process.env.MONGODB_CONNECTION_STRING;

if (!dbConnectionString) {
  throw new Error("MONGODB_CONNECTION_STRING is not defined in .env file");
}

mongoose.connect(dbConnectionString).then(() => {
  server.listen(PORT, () => console.log(`App server listening on port ${PORT}!`));
});

// Initialize Socket.IO
initializeSocketIO(io);
