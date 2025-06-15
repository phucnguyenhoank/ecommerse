
import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService";

const paymentService = new PaymentService();

export class PaymentController {
    // Lấy tất cả phương thức thanh toán
    static async getAllPayments(req: Request, res: Response) {
        try {
            const payments = await paymentService.getAllPayments();
            res.json(payments);
        } catch (error) {
            res.status(500).json({ message: "Error fetching payments", error });
        }
    }

    // Lấy phương thức thanh toán theo ID
    static async getPaymentById(req: Request, res: Response) {
        try {
            const payment = await paymentService.getPaymentById(parseInt(req.params.id));
            if (!payment) {
                res.status(404).json({ message: "Payment not found" });
            } else {
                res.json(payment);
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching payment", error });
        }
    }

    // Tạo phương thức thanh toán mới
    static async createPayment(req: Request, res: Response) {
        try {
            const payment = await paymentService.createPayment(req.body);
            res.status(201).json(payment);
        } catch (error) {
            res.status(500).json({ message: "Error creating payment", error });
        }
    }

    // Cập nhật phương thức thanh toán
    static async updatePayment(req: Request, res: Response) {
        try {
            const updatedPayment = await paymentService.updatePayment(parseInt(req.params.id), req.body);
            if (!updatedPayment) {
                res.status(404).json({ message: "Payment not found" });
            } else {
                res.json(updatedPayment);
            }
        } catch (error) {
            res.status(500).json({ message: "Error updating payment", error });
        }
    }

    // Xóa phương thức thanh toán
    static async deletePayment(req: Request, res: Response) {
        try {
            const deleted = await paymentService.deletePayment(parseInt(req.params.id));
            if (!deleted) {
                res.status(404).json({ message: "Payment not found" });
            } else {
                res.status(204).send();
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting payment", error });
        }
    }
}
