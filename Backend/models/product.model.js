import mongoose from "mongoose";
const ProductSchema = mongoose.Schema({
  id:{
    type: Number,
    require: true,
  },
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
  reviews: {
    type: Number,
  },
  ratings: {
    type: Number,
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