import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, required: true },
    lobby: { type: Number, required: true },
    totalGames: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    highScore: { type: Number, required: true },
    totalWins: { type: Number, required: true },
    powerups: {
      type: {
        timeIncrease: { type: Number, required: true },
        timeDecrease: { type: Number, required: true },
        revealLetter: { type: Number, required: true },
        inkSplatter: { type: Number, required: true },
        scoreMultiplier: { type: Number, required: true },
        eraseDrawing: { type: Number, required: true }
      },
      required: true
    },
    achievements: {
      type: {
        gameAchievement: { type: Boolean, required: true },
        powerupAchievement: { type: Boolean, required: true },
        scoreAchievement: { type: Boolean, required: true }
      },
      required: true
    }
  },
  {
    timestamps: {}
  }
);

const User = mongoose.model("User", userSchema);
export default User;
