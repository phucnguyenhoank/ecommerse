import {Router } from "express";
import { ColorController } from "../controllers/ColorController";

const router = Router();

router.get("/", ColorController.getAllColors);
router.get("/:id", ColorController.getColorById);
router.post("/create", ColorController.createColor);
router.delete("/:id/delete", ColorController.deleteColor);

export default router;