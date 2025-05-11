import { describe, it, beforeAll, afterAll, beforeEach, expect, vi } from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import phraseRoutes from "../api/phrases.js";
import Phrase from "../../db/phrase-schema.js";

let mongod: MongoMemoryServer;
const app = express();
app.use(express.json());
app.use("/", phraseRoutes);

// Sample phrases for testing
const phrase1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000001"),
  phrase: "bungy jumping"
};

const phrase2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000002"),
  phrase: "cinnamoroll"
};

const phrases = [phrase1, phrase2];

/**
 * Before all tests, create an in-memory MongoDB instance and connect.
 */
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

/**
 * Before each test, initialise the database with some data.
 */
beforeEach(async () => {
  await Phrase.deleteMany({});
  await Phrase.insertMany(phrases);
});

/**
 * After all tests, terminate the MongoDB instance and mongoose connection.
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("GET /", () => {
  it("returns all phrases", async () => {
    const res = await request(app).get("/").expect(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].phrase).toBe("bungy jumping");
  });

  it("returns 500 on DB error", async () => {
    // Simulating a database error
    vi.spyOn(Phrase, "find").mockRejectedValueOnce(new Error("DB error"));
    const res = await request(app).get("/").expect(500);
    expect(res.body.message).toBe("Internal Server Error");
    vi.restoreAllMocks();
  });
});

describe("GET /:id", () => {
  it("returns a phrase by ID", async () => {
    const res = await request(app).get("/000000000000000000000001").expect(200);
    expect(res.body.phrase).toBe("bungy jumping");
  });

  it("returns 404 if phrase not found", async () => {
    const res = await request(app).get("/000000000000000000000003").expect(404);
    expect(res.body.message).toBe("Phrase not found");
  });

  it("returns 400 for invalid ID", async () => {
    const res = await request(app).get("/bad-id").expect(400);
    expect(res.body.message).toBe("Invalid ID format");
  });

  it("returns 500 on DB error", async () => {
    vi.spyOn(Phrase, "findById").mockRejectedValueOnce(new Error("DB error"));
    const res = await request(app).get("/000000000000000000000001").expect(500);
    expect(res.body.message).toBe("Internal server error");
    vi.restoreAllMocks();
  });
});

describe("POST /", () => {
  it("adds a new phrase", async () => {
    const res = await request(app).post("/").send({ phrase: "test phrase" }).expect(201);
    expect(res.body.phrase).toBe("test phrase");

    const allPhrases = await Phrase.find();
    expect(allPhrases.length).toBe(3);
  });

  it("returns 409 for duplicate phrase", async () => {
    const res = await request(app).post("/").send({ phrase: "bungy jumping" }).expect(409);
    expect(res.body.message).toBe("Phrase already exists");
  });

  it("returns 400 for invalid phrase data", async () => {
    const res = await request(app).post("/").send({ wrongField: "oops" }).expect(400);
    expect(res.body.message).toBe("Invalid phrase data");
  });

  it("returns 500 on DB error", async () => {
    vi.spyOn(Phrase.prototype, "save").mockRejectedValueOnce(new Error("DB error"));
    const res = await request(app).post("/").send({ phrase: "new one" }).expect(500);
    expect(res.body.message).toBe("Internal server error");
    vi.restoreAllMocks();
  });
});

describe("DELETE /:id", () => {
  it("deletes a phrase", async () => {
    await request(app).delete("/000000000000000000000001").expect(204);
    const phrase = await Phrase.findById("000000000000000000000001");
    expect(phrase).toBeNull();
  });

  it("returns 404 if phrase not found", async () => {
    const res = await request(app).delete("/000000000000000000000003").expect(404);
    expect(res.body.message).toBe("Phrase not found");
  });

  it("returns 400 for invalid ID", async () => {
    const res = await request(app).delete("/bad-id").expect(400);
    expect(res.body.message).toBe("Invalid ID format");
  });

  it("returns 500 on DB error", async () => {
    vi.spyOn(Phrase, "findByIdAndDelete").mockRejectedValueOnce(new Error("DB error"));
    const res = await request(app).delete("/000000000000000000000001").expect(500);
    expect(res.body.message).toBe("Internal server error");
    vi.restoreAllMocks();
  });
});
