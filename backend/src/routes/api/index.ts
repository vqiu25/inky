import express from "express";

const router = express.Router();

import users from "./users.js";
import phrases from "./phrases.js";
router.use("/users", users);
router.use("/phrases", phrases);

export default router;
