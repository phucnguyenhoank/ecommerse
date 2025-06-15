import { Router } from "express";
import { createReview, deleteReview, getReviews } from "../controllers/ReviewController";

const router = Router();

router.get("/", getReviews);
router.post("/", createReview);
router.delete("/:id", deleteReview);

export default router;
