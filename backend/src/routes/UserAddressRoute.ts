import { Router } from "express";
import { createUserAddress, deleteUserAddress, getUserAddresses } from "../controllers/User_addressController";

const router = Router();

router.get("/", getUserAddresses);
router.post("/", createUserAddress);
router.delete("/:user_id", deleteUserAddress);

export default router;
