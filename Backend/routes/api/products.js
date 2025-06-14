import express from "express";
import {
    getAllProducts,
    handleNewProduct,
    getProduct
    
} from "../../controllers/productsController.js";

import ROLES_LIST from '../../util/roles_list.js';
import verifyRoles from '../../Middleware/verifyRoles.js';
import verifyJWT from "../../Middleware/verifyJwt.js";

const router = express.Router();

// Product routes
router.route('/')
  .get(getAllProducts)
  router.route('/')
    .post(verifyJWT, verifyRoles(ROLES_LIST.Admin), handleNewProduct)

router.route('/:id')
  .get(getProduct)

export default router;