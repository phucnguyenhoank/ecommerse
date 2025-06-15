import { Router } from "express";
import { createShippingMethod, deleteShippingMethod, getShippingMethods } from "../controllers/Shipping_methodController";

const router = Router();

router.get("/", getShippingMethods);
router.post("/", createShippingMethod);
router.delete("/:id", deleteShippingMethod);

export default router;
