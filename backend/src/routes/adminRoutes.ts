import {Router } from "express";
import { AdminController } from "../controllers/AdminController";

const router = Router();

router.get("/", AdminController.getAllAdmins);
router.get("/:id", AdminController.getAdminById);
router.post("/create", AdminController.createAdmin);
router.delete("/:id/delete", AdminController.deleteAdmin);

export default router;