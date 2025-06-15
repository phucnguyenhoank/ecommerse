import { Request, Response } from "express";
import { StatisticsService } from "../services/StatisticsService";

export class StatisticsController {
    static async productsStatistics(req: Request, res: Response) {
        const { type, date } = req.query;
        try {
            const result = await StatisticsService.productsInStock();
            res.json(result);
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ message: err.message });
            } else {
                res.status(500).json({ message: String(err) });
            }
        }
    }

    static async ordersStatistics(req: Request, res: Response) {
        const { type, date } = req.query;
        try {
            const result = await StatisticsService.ordersStatistics(type as string, date as string);
            res.json(result);
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ message: err.message });
            } else {
                res.status(500).json({ message: String(err) });
            }
        }
    }
}
