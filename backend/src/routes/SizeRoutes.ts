import { Router } from "express";
import { createSize, deleteSize, getSizes } from "../controllers/SizeController";

const router = Router();

router.get("/", getSizes);
router.post("/", createSize);
router.delete("/:id", deleteSize);

export default router;
