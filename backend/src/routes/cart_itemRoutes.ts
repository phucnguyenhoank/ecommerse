import {Router } from "express";
import { CartItemController } from "../controllers/Cart_iemController";

const router = Router();

router.get("/", CartItemController.getAllCartItems);
router.get("/:id", CartItemController.getCartItemById);
router.post("/create", CartItemController.createCartItem);
router.delete("/:id/delete", CartItemController.deleteCartItem);

export default router;