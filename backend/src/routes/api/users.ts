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
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { username, profilePicture, email } = req.body;

  try {
    const newUser = new User({
      username: username,
      email: email,
      profileImage: profilePicture,
      totalGames: 0,
      totalPoints: 0,
      highScore: 0,
      powerups: {
        timeIncrease: 0,
        timeDecrease: 0,
        revealLetter: 0,
        inkSplatter: 0,
        removePoints: 0,
        eraseDrawing: 0
      },
      achievements: {
        gameAchievement: false,
        powerupAchievement: false,
        scoreAchievement: false
      }
    });

    const addedUser = await newUser.save();
    res.status(201).json(addedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
