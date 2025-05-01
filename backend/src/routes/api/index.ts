import express from "express";

const router = express.Router();

import users from "./users";
import phrases from "./phrases";
router.use("/users", users);
router.use("/phrases", phrases);

export default router;