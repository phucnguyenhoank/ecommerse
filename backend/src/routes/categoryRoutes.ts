import {Router } from "express";

import { CategoryController } from "../controllers/CategoryController";
const router = Router();

router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.post("/create", CategoryController.createCategory);
router.delete("/:id/delete", CategoryController.deleteCategory);
router.put("/:id", CategoryController.updateCategory);
export default router;