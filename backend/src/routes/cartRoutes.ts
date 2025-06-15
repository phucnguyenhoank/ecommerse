import {Router } from "express";
import { CartController } from "../controllers/CartController";

const router = Router();

router.get("/", CartController.getAllCarts);
router.get("/:id", CartController.getCartById);
router.post("/create", CartController.createCart);
router.delete("/:id/delete", CartController.deleteCart);

export default router;
