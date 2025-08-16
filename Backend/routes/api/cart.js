import express from "express";

import {
    getCartItems,
    addToCart,
    updateQauntity,
    deleteFromCart
} from "../../controllers/cartContoller.js";
import { makePayment, placeOrder } from "../../controllers/ordersController.js";



const router = express.Router();

// Product routes
router.route('/')
  .get(getCartItems)
  .post(addToCart)
  .patch(updateQauntity)
  .delete(deleteFromCart)

  router.route("/create-checkout-session")
    .post(makePayment)

  router.route("/payment-success")
    .post(placeOrder);

export default router;