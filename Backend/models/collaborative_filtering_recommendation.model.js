import mongoose from "mongoose";

const collaborative_filtering_recommendationSchema = new mongoose.Schema({
  user_id: String,
  recommended_products: [{ type: String }],
});

export default mongoose.model(
  "collaborative_filtering_recommendation",
  collaborative_filtering_recommendationSchema
);
