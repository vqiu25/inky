import express from "express";
import type { Request, Response } from "express";
import User from "../../db/user-schema";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json({ message: "Internal server error" });
  }
});

export default router;
