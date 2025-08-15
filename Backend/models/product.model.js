import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5, 
  },
  comment: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
const ProductSchema = mongoose.Schema({
  type :{
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  details: {
    type: String,
    require: true,
  },
  reviews: [reviewSchema], 
  ratings: {
    type: Number,
    default: 0, 
  },
  imgURL: {
    type: String,
    require: true,
  },
  img2: {
    type: String,
  },
  img3: {
    type: String,
  },
  img4: {
    type: String,
  }
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;