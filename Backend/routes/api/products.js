import express from "express";
import {
    getAllProducts,
    handleNewProduct,
    getProduct,
    addProductReview,
    getAllProductReviews
    
} from "../../controllers/productsController.js";

import ROLES_LIST from '../../util/roles_list.js';
import verifyRoles from '../../Middleware/verifyRoles.js';
import verifyJWT from "../../Middleware/verifyJWT.js";

const router = express.Router();

// Product routes
router.route('/')
  .get(getAllProducts)
  .post(verifyJWT, verifyRoles(ROLES_LIST.Admin), handleNewProduct)

router.route('/:id')
  .get(getProduct)

router.route('/:id/reviews')
  .post(verifyJWT, addProductReview)
  .get(getAllProductReviews)

export default router;