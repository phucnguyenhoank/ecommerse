import { Request, Response } from "express";
import { OrderStatusService } from "../services/OrderStatusService";

const orderStatusService = new OrderStatusService();

export class OrderStatusController {
    static async getAll(req: Request, res: Response) {
        try {
            const statuses = await orderStatusService.getAllOrderStatuses();
            res.json(statuses);
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch order statuses", error: err });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const status = await orderStatusService.getOrderStatusById(id);
            if (!status) {
                res.status(404).json({ message: "Order status not found" });
                return;
            }
            res.json(status);
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch order status", error: err });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const newStatus = await orderStatusService.createOrderStatus(req.body);
            res.status(201).json(newStatus);
        } catch (err) {
            res.status(500).json({ message: "Failed to create order status", error: err });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const updated = await orderStatusService.updateOrderStatus(id, req.body);
            if (!updated) {
                res.status(404).json({ message: "Order status not found" });
                return;
            }
            res.json(updated);
        } catch (err) {
            res.status(500).json({ message: "Failed to update order status", error: err });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await orderStatusService.deleteOrderStatus(id);
            if (!deleted) {
                res.status(404).json({ message: "Order status not found" });
                return;
            }
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ message: "Failed to delete order status", error: err });
        }
    }
}
