import { Request, Response } from "express";
import { OrderPaymentService } from "../services/OrderPaymentService";

const orderPaymentService = new OrderPaymentService();

export class OrderPaymentController {
    static async getAllOrderPayment(req: Request, res: Response) {
        try {
            const orderPayment = await orderPaymentService.getAllOrderPayment();
            res.json(orderPayment);
        } catch (error) {
            res.status(500).json({ message: "Error fetching order payment", error });
        }
    }

    static async getOrderPaymentById(req: Request, res: Response) {
        try {
            const { order_id, payment_id } = req.params;
            const orderPayment = await orderPaymentService.getOrderPaymentById(
                parseInt(order_id),
                parseInt(payment_id)
            );
            if (!orderPayment) res.status(404).json({ message: "Order payment not found" });
            else res.json(orderPayment);
        } catch (error) {
            res.status(500).json({ message: "Error fetching order payment", error });
        }
    }

    static async createOrderPayment(req: Request, res: Response) {
        try {
            const orderPayment = await orderPaymentService.createOrderPayment(req.body);
            res.status(201).json(orderPayment);
        } catch (error) {
            res.status(500).json({ message: "Error creating order payment", error });
        }
    }

    static async updateOrderPayment(req: Request, res: Response) {
        try {
            const { order_id, payment_id } = req.params;
            const updated = await orderPaymentService.updateOrderPayment(
                parseInt(order_id),
                parseInt(payment_id),
                req.body
            );
            if (!updated) res.status(404).json({ message: "Order payment not found" });
            else res.json(updated);
        } catch (error) {
            res.status(500).json({ message: "Error updating order payment", error });
        }
    }

    static async deleteOrderPayment(req: Request, res: Response) {
        try {
            const { order_id, payment_id } = req.params;
            const deleted = await orderPaymentService.deleteOrderPayment(
                parseInt(order_id),
                parseInt(payment_id)
            );
            if (!deleted) res.status(404).json({ message: "Order payment not found" });
            else res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Error deleting order payment", error });
        }
    }
}
