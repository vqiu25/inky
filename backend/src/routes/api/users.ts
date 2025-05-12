import express from "express";
import type { Request, Response } from "express";
import User from "../../db/user-schema.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { email } = req.query;
  try {
    if (typeof email == "string") {
      const user = await User.findOne({ email: email });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.send(user);
      return;
    }

    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.send(user);
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
      profilePicture: profilePicture
    });

    await User.validate(newUser);

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const addedUser = await newUser.save();
    res.status(201).json(addedUser);
  } catch (error) {
    if (
      error instanceof Error &&
      (error?.name === "ValidationError" || error?.name === "CastError")
    ) {
      res.status(400).json({ message: "Invalid user data" });
      return;
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const user = User.castObject(req.body);

    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
      context: "query"
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.send(updatedUser);
  } catch (error) {
    if (
      error instanceof Error &&
      (error?.name === "ValidationError" || error?.name === "CastError")
    ) {
      res.status(400).json({ message: "Invalid user data" });
      return;
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
