import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String, required: true },
  totalGames: { type: Number, required: true },
  totalPoints: { type: Number, required: true },
  highScore: { type: Number, required: true },
  powerups: {
    type: {
      timeIncrease: Number,
      timeDecrease: Number,
      revealLetter: Number,
      inkSplatter: Number,
      removePoints: Number,
      eraseDrawing: Number,
    }, required: true
  },
  achievements: {
    type: {
      gameAchievement: Boolean,
      powerupAchievement: Boolean,
      scoreAchievement: Boolean,
    }, required: true
  },
}, {
  timestamps: {}
});

const User = mongoose.model("User", userSchema);
export default User;
