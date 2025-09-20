import express from "express"
import { getAllOrders, orderDelivered} from "../../controllers/ordersController.js";
import ROLES_LIST from '../../util/roles_list.js';
import verifyRoles from '../../Middleware/verifyRoles.js';
import { getAllAssociations } from '../../controllers/ordersController.js'

const router = express.Router()



router.route("/")
    .get(verifyRoles(ROLES_LIST.Admin),getAllOrders)
    .patch(verifyRoles(ROLES_LIST.Admin),orderDelivered);

router.route("/associations")
.get(verifyRoles(ROLES_LIST.Admin),getAllAssociations); 


export default router;
