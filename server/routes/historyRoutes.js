import express from "express";
import { history } from "../controllers/historyController.js";
import auth from "../middlewares/auth.js";

const router=express.Router();
router.get('/history',auth,history);

export default router;