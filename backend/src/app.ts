import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

const PORT = process.env.PORT ?? 3000;

const app = express();

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

mongoose.connect(dbConnectionString).then(() => {
  app.listen(PORT, () => console.log(`App server listening on port ${PORT}!`));
});
