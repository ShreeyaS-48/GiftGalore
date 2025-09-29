import express from "express";
import {
  getAllOrders,
  getOrderAnalytics,
  getOrdersForUser,
  getSalesAnalytics,
  updateOrderStatus,
} from "../../controllers/ordersController.js";
import ROLES_LIST from "../../util/roles_list.js";
import verifyRoles from "../../Middleware/verifyRoles.js";
import { getAllAssociations } from "../../controllers/ordersController.js";

const router = express.Router();

router.route("/").get(verifyRoles(ROLES_LIST.Admin), getAllOrders);

router.route("/:id").patch(verifyRoles(ROLES_LIST.Admin), updateOrderStatus);

router.route("/order-history").get(getOrdersForUser);

router
  .route("/associations")
  .get(verifyRoles(ROLES_LIST.Admin), getAllAssociations);

router
  .route("/sales-analytics")
  .get(verifyRoles(ROLES_LIST.Admin), getSalesAnalytics);

router
  .route("/order-analytics")
  .get(verifyRoles(ROLES_LIST.Admin), getOrderAnalytics);

export default router;
