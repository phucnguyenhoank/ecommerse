

import { Repository } from "typeorm";
import { AppDataSource } from "../config/datasource"; // hoặc đường dẫn đúng đến datasource của bạn
import { Order_status } from "../entity/Order_status";

export class OrderStatusService {
    private orderStatusRepository: Repository<Order_status>;

    constructor() {
        this.orderStatusRepository = AppDataSource.getRepository(Order_status);
    }

    async getAllOrderStatuses(): Promise<Order_status[]> {
        return this.orderStatusRepository.find();
    }

    async getOrderStatusById(id: number): Promise<Order_status | null> {
        return this.orderStatusRepository.findOneBy({ id });
    }

    async createOrderStatus(data: Partial<Order_status>): Promise<Order_status> {
        const status = this.orderStatusRepository.create(data);
        return this.orderStatusRepository.save(status);
    }

    async updateOrderStatus(id: number, data: Partial<Order_status>): Promise<Order_status | null> {
        const status = await this.getOrderStatusById(id);
        if (!status) return null;

        Object.assign(status, data);
        return this.orderStatusRepository.save(status);
    }

    async deleteOrderStatus(id: number): Promise<boolean> {
        const result = await this.orderStatusRepository.delete(id);
        return result.affected !== 0;
    }
}
