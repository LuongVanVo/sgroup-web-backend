import UserController from "@/controllers/userController";
import express from "express";
import { asyncHandler } from "@/helpers/asyncHandler";
import { errorHandler } from "@/middlewares/errorHandler";

const router = express.Router()

router.get('/', asyncHandler(UserController.getAllUsers))

router.use(errorHandler)

export default router