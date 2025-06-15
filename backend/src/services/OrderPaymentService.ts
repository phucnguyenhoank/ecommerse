import { Repository } from "typeorm";
import { AppDataSource } from "../config/datasource";
import { Order_payment } from "../entity/OrderPayment";
import { Order } from "../entity/Order";
import { Payment } from "../entity/Payment";

export class OrderPaymentService {
    private orderPaymentRepository: Repository<Order_payment>;
    private orderRepository: Repository<Order>;
    private paymentRepository: Repository<Payment>;

    constructor() {
        this.orderPaymentRepository = AppDataSource.getRepository(Order_payment);
        this.orderRepository = AppDataSource.getRepository(Order);
        this.paymentRepository = AppDataSource.getRepository(Payment);
    }

    async getAllOrderPayment(): Promise<Order_payment[]> {
        return this.orderPaymentRepository.find({
            relations: ["order", "payment"]
        });
    }

    async getOrderPaymentById(order_id: number, payment_id: number): Promise<Order_payment | null> {
        return this.orderPaymentRepository.findOne({
            where: { order_id, payment_id },
            relations: ["order", "payment"]
        });
    }

    async createOrderPayment(data: Partial<Order_payment>): Promise<Order_payment> {
        const order = await this.orderRepository.findOne({ where: { id: data.order?.id } });
        const payment = await this.paymentRepository.findOne({ where: { id: data.payment?.id } });

        if (!order || !payment) throw new Error("Order or Payment not found");

        const orderPayment = this.orderPaymentRepository.create({
            order,
            payment
        });

        return this.orderPaymentRepository.save(orderPayment);
    }

    async updateOrderPayment(order_id: number, payment_id: number, data: Partial<Order_payment>): Promise<Order_payment | null> {
        const orderPayment = await this.getOrderPaymentById(order_id, payment_id);
        if (!orderPayment) return null;

        // Chỉ cập nhật nếu cần (ở đây không có nhiều trường cần cập nhật ngoại trừ `created_at`)
        return this.orderPaymentRepository.save({ ...orderPayment, ...data });
    }

    async deleteOrderPayment(order_id: number, payment_id: number): Promise<boolean> {
        const result = await this.orderPaymentRepository.delete({ order_id, payment_id });
        return result.affected !== 0;
    }
}
