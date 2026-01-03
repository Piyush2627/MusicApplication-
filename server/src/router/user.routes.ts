import { Router } from "express";
import {
	createUser,
	getAllUser,
	updateUser,
	deleteUser,
	loginUser,
	signup,
	getUser,
} from "../controllers/user.controller";

const router = Router();
router.get("/getUser/:id", getUser);
router.post("/createUser", createUser);
router.get("/getAllUser", getAllUser);
router.post("/loginUser", loginUser);
router.post("/signup", signup);
router.patch("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);

export default router;
