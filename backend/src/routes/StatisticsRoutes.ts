import { Router } from "express";
import { StatisticsController } from "../controllers/StatisticsController";

const router = Router();

router.get("/products", StatisticsController.productsStatistics);
router.get("/orders", StatisticsController.ordersStatistics);
export default router;
