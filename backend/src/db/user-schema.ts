import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, required: true },
    totalGames: { type: Number, required: true, default: 0 },
    totalPoints: { type: Number, required: true, default: 0 },
    highScore: { type: Number, required: true, default: 0 },
    totalWins: { type: Number, required: true, default: 0 },
    powerups: {
      type: {
        timeIncrease: { type: Number, required: true },
        timeDecrease: { type: Number, required: true },
        revealLetter: { type: Number, required: true },
        inkSplatter: { type: Number, required: true },
        scoreMultiplier: { type: Number, required: true },
        eraseDrawing: { type: Number, required: true }
      },
      required: true,
      default: {
        timeIncrease: 0,
        timeDecrease: 0,
        revealLetter: 0,
        inkSplatter: 0,
        scoreMultiplier: 0,
        eraseDrawing: 0
      }
    },
    achievements: {
      type: {
        gameAchievement: { type: Boolean, required: true },
        pointsAchievement: { type: Boolean, required: true },
        powerupAchievement: { type: Boolean, required: true },
        winsAchievement: { type: Boolean, required: true },
        highScoreAchievement: { type: Boolean, required: true }
      },
      required: true,
      default: {
        gameAchievement: false,
        pointsAchievement: false,
        powerupAchievement: false,
        winsAchievement: false,
        highScoreAchievement: false
      }
    }
  },
  {
    timestamps: {}
  }
);

const User = mongoose.model("User", userSchema);
export default User;
