
import { Repository } from "typeorm";
import { Payment } from "../entity/Payment";
import { AppDataSource } from "../config/datasource";

export class PaymentService {
    private paymentRepository: Repository<Payment>;

    constructor() {
        this.paymentRepository = AppDataSource.getRepository(Payment);
    }

    // Lấy tất cả phương thức thanh toán
    async getAllPayments(): Promise<Payment[]> {
        return this.paymentRepository.find();
    }

    // Lấy phương thức thanh toán theo ID
    async getPaymentById(id: number): Promise<Payment | null> {
        return this.paymentRepository.findOne({
            where: { id },
        });
    }

    // Tạo phương thức thanh toán mới
    async createPayment(data: Partial<Payment>): Promise<Payment> {
        const payment = this.paymentRepository.create(data);
        return this.paymentRepository.save(payment);
    }

    // Cập nhật phương thức thanh toán
    async updatePayment(id: number, data: Partial<Payment>): Promise<Payment | null> {
        const payment = await this.getPaymentById(id);
        if (!payment) return null;

        Object.assign(payment, data);
        return this.paymentRepository.save(payment);
    }

    // Xóa phương thức thanh toán
    async deletePayment(id: number): Promise<boolean> {
        const result = await this.paymentRepository.delete(id);
        return result.affected !== 0;
    }
}
