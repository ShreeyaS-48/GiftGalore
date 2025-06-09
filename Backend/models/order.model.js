import mongoose from "mongoose";
const OrderSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
    products: {
      type: Array,
      require: true,
    },
    total: {
      type: Number,
      require: true,
    },

    address: {
      type: String,
      require: true,
    },

    phone: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      require: true,
    },

    status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
