import mongoose, { Schema } from "mongoose";

const phraseSchema = new Schema({
  phrase: { type: String, required: true, unique: true },
});

const Phrase = mongoose.model("Phrase", phraseSchema);
export default Phrase;