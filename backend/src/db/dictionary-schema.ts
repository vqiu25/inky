import mongoose, { Schema } from "mongoose";

const dictionarySchema = new Schema({
  phrase: String
});

const Dictionary = mongoose.model("Dictionary", dictionarySchema);
export default Dictionary;