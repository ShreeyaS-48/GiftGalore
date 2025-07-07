import express from "express"
import { placeOrder, getAllOrders, orderDelivered } from "../../controllers/ordersController.js";
import ROLES_LIST from '../../util/roles_list.js';
import verifyRoles from '../../Middleware/verifyRoles.js';
const router = express.Router()

router.route("/")
    .post(placeOrder)
    .get(verifyRoles(ROLES_LIST.Admin),getAllOrders)
    .patch(verifyRoles(ROLES_LIST.Admin),orderDelivered);

export default router;