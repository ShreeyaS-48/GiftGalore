import express from "express"
import {getAllUsers, getUser, deleteUser, getAllAdmins} from "../../controllers/usersController.js";
import ROLES_LIST from '../../util/roles_list.js';
import verifyRoles from '../../Middleware/verifyRoles.js';
const router = express.Router()

router.route('/users')
    .get(verifyRoles(ROLES_LIST.Admin),getAllUsers)
router.route('/admins')
    .get(verifyRoles(ROLES_LIST.Admin), getAllAdmins)
router.route('/')
    .delete(verifyRoles(ROLES_LIST.Admin),deleteUser)

router.route('/:name')
    .get(getUser)

export default router;