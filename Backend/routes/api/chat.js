import express from "express";
import { getResponse } from "../../controllers/chatController.js";

const router = express.Router();

router.route("/").post(getResponse);

export default router;
