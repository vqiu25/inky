import { describe, it, beforeAll, afterAll, beforeEach, expect, vi } from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import userRoutes from "../api/users.js";
import User from "../../db/user-schema.js";

let mongod: MongoMemoryServer;
const app = express();
app.use(express.json());
app.use("/", userRoutes);

// Sample users for testing
const user1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000001"),
  username: "alice",
  email: "alice@gmail.com",
  profilePicture: "pic1.svg"
};

const user2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000002"),
  username: "bob",
  email: "bob@gmail.com",
  profilePicture: "pic2.svg"
};

const users = [user1, user2];

/**
 * Before all tests, create an in-memory MongoDB instance and connect.
 */
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

/**
 * Before each test, initialise the database with some data.
 */
beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(users);
});

/**
 * After all tests, terminate the MongoDB instance and mongoose connection.
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

/**
 * Tests for GET / endpoint
 */
describe("GET /", () => {
  it("returns all users", async () => {
    const res = await request(app).get("/").expect(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].email).toBe("alice@gmail.com");
  });

  it("returns a user by email", async () => {
    const res = await request(app).get("/?email=alice@gmail.com").expect(200);
    expect(res.body.username).toBe("alice");
  });

  it("returns 404 if user email not found", async () => {
    const res = await request(app).get("/?email=ghost@example.com").expect(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns 500 if there's a database error", async () => {
    // Simulating a database error
    vi.spyOn(User, "find").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const res = await request(app).get("/").expect(500);
    expect(res.body.message).toBe("Internal server error");

    vi.restoreAllMocks();
  });
});

describe("GET /:id", () => {
  it("returns a user by ID", async () => {
    const res = await request(app).get(`/000000000000000000000001`).expect(200);
    expect(res.body.username).toBe("alice");
  });

  it("returns 404 for nonexistent user ID", async () => {
    const res = await request(app).get(`/000000000000000000000003`).expect(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns 400 for invalid ID format", async () => {
    const res = await request(app).get("/invalid-id").expect(400);
    expect(res.body.message).toBe("Invalid ID format");
  });

  it("returns 500 for database error", async () => {
    vi.spyOn(User, "findById").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const res = await request(app).get(`/000000000000000000000001`).expect(500);
    expect(res.body.message).toBe("Internal server error");

    vi.restoreAllMocks();
  });
});

describe("POST /", () => {
  it("creates a new user", async () => {
    const newUser = {
      username: "charlie",
      email: "charlie@example.com",
      profilePicture: "pic3.jpg"
    };

    const res = await request(app).post("/").send(newUser).expect(201);
    expect(res.body.email).toBe("charlie@example.com");

    const usersInDb = await User.find();
    expect(usersInDb.length).toBe(3);
  });

  it("rejects duplicate email", async () => {
    const res = await request(app).post("/").send({
      username: "someone",
      email: "alice@gmail.com",
      profilePicture: "picx.jpg"
    });
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email already in use");
  });

  it("returns 400 if there is a validation or cast error", async () => {
    const res = await request(app).post("/").send({
      username: "someone",
      profilePicture: "picx.jpg"
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid user data");
  });

  it("returns 500 if there's a database error", async () => {
    vi.spyOn(User.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const newUser = {
      username: "charlie",
      email: "charlie@gmail.com",
      profilePicture: "pic3.svg"
    };

    const res = await request(app).post("/").send(newUser).expect(500);
    expect(res.body.message).toBe("Internal server error");

    vi.restoreAllMocks();
  });
});

describe("PATCH /:id", () => {
  it("updates a user", async () => {
    const res = await request(app)
      .patch("/000000000000000000000001")
      .send({ username: "newAlice" })
      .expect(200);
    expect(res.body.username).toBe("newAlice");
  });

  it("returns 404 for missing user", async () => {
    const res = await request(app)
      .patch("/000000000000000000000003")
      .send({ username: "x" })
      .expect(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns 400 for invalid ID", async () => {
    const res = await request(app).patch("/bad-id").send({ username: "x" }).expect(400);
    expect(res.body.message).toBe("Invalid ID format");
  });

  it("returns 400 if there is a validation or cast error", async () => {
    const res = await request(app).patch("/000000000000000000000001").send({ totalGames: "x" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid user data");
  });

  it("returns 500 if there's a database error", async () => {
    vi.spyOn(User, "findByIdAndUpdate").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const res = await request(app)
      .patch("/000000000000000000000001")
      .send({ username: "newAlice" })
      .expect(500);

    expect(res.body.message).toBe("Internal server error");

    vi.restoreAllMocks();
  });
});

describe("DELETE /:id", () => {
  it("deletes a user", async () => {
    await request(app).delete("/000000000000000000000001").expect(204);
    const user = await User.findById("000000000000000000000001");
    expect(user).toBeNull();
  });

  it("returns 404 if user not found", async () => {
    const res = await request(app).delete("/000000000000000000000003").expect(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns 400 for invalid ID", async () => {
    const res = await request(app).delete("/bad-id").expect(400);
    expect(res.body.message).toBe("Invalid ID format");
  });

  it("returns 500 if there's a database error", async () => {
    vi.spyOn(User, "findByIdAndDelete").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const res = await request(app).delete("/000000000000000000000001").expect(500);
    expect(res.body.message).toBe("Internal server error");

    vi.restoreAllMocks();
  });
});
