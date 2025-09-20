import express from "express";
import upload from "../../Middleware/upload.js";
import {
    getAllProducts,
    handleNewProduct,
    getProduct,
    addProductReview,
    getAllProductReviews,
    getRecommendations
    
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

router.route('/:id/recommendations')
.get(getRecommendations)

router.route('/:id/reviews')
  .post(verifyJWT, upload.array("attachments", 3),addProductReview)
  .get(getAllProductReviews)

export default router;