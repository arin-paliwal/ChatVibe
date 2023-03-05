import express from "express";
import {login} from "../controllers/auth.js";

const router=express.Router(); // configuring routes

router.post("/login",login);
export default router;