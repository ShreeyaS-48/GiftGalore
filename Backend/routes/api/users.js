import express from "express"
import {getAllUsers, getUser, deleteUser} from "../../controllers/usersController.js";
import ROLES_LIST from '../../util/roles_list.js';
import verifyRoles from '../../Middleware/verifyRoles.js';
const router = express.Router()

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin),getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin),deleteUser)

router.route('/:name')
    .get(getUser)

export default router;