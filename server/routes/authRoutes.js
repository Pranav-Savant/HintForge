import express from"express";
import {
    signup,
    login,
    logout,
    isAuth
} from "../controllers/authController.js";
import optionalAuth from "../middlewares/optionalAuth.js";

const router=express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);
router.get('/isAuth',optionalAuth,isAuth);

export default router;