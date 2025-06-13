import express from "express";
import {
    getCartItems,
    addToCart,
    updateQauntity,
    deleteFromCart
} from "../../controllers/cartContoller.js";



const router = express.Router();

// Product routes
router.route('/')
  .get(getCartItems)
  .post(addToCart)
  .patch(updateQauntity)
  .delete(deleteFromCart)

export default router;