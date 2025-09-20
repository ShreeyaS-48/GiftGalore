// models/Recommendation.js
import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  lhs: [{ type: String }], // store product ids as strings for simplicity
  rhs: [{ type: String }],
  support: Number,
  confidence: Number,
  lift: Number,
});

export default mongoose.model("Recommendation", recommendationSchema);
