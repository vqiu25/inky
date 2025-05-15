import express from "express";
import type { Request, Response } from "express";
import Phrase from "../../db/phrase-schema.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Gets all phrases
router.get("/", async (_req: Request, res: Response) => {
  try {
    const phrases = await Phrase.find();
    res.send(phrases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Gets a phrase by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const phrase = await Phrase.findById(id);

    if (!phrase) {
      res.status(404).json({ message: "Phrase not found" });
      return;
    }

    res.send(phrase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Adds a new phrase
router.post("/", async (req: Request, res: Response) => {
  const { phrase } = req.body;

  try {
    const newPhrase = new Phrase({
      phrase: phrase
    });

    await Phrase.validate(newPhrase);

    const existingPhrase = await Phrase.findOne({ phrase: phrase });

    if (existingPhrase) {
      res.status(409).json({ message: "Phrase already exists" });
      return;
    }

    const addedPhrase = await newPhrase.save();
    res.status(201).json(addedPhrase);
  } catch (error) {
    if (
      error instanceof Error &&
      (error?.name === "ValidationError" || error?.name === "CastError")
    ) {
      res.status(400).json({ message: "Invalid phrase data" });
      return;
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Deletes a phrase by ID
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const deletedPhrase = await Phrase.findByIdAndDelete(id);

    if (!deletedPhrase) {
      res.status(404).json({ message: "Phrase not found" });
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
