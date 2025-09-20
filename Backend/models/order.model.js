import mongoose from "mongoose";
const OrderSchema = mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name:{
      type: String,
      require: true,
    },
    items: {
      type: Array,
      require: true,
    },
    totalAmount: {
      type: Number,
      require: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    status: {
      type: Number, // 0 -> placed 1->processing 2->dispatched 3-> delivered
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;