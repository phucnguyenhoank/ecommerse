import { AppDataSource } from "../config/datasource";
import { Between } from "typeorm";
import { Order } from "../entity/Order";
import { ProductItem } from "../entity/ProductItem";

function getTimeRange(type: string, date: string) {
    const inputDate = new Date(date);
    let start: Date, end: Date;

    switch (type) {
        case "day":
            start = new Date(inputDate.setHours(0, 0, 0, 0));
            end = new Date(inputDate.setHours(23, 59, 59, 999));
            break;
        case "week":
            const first = inputDate.getDate() - inputDate.getDay() + 1;
            start = new Date(inputDate.setDate(first));
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;
        case "month":
            start = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1, 0, 0, 0, 0);
            end = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        case "year":
            start = new Date(inputDate.getFullYear(), 0, 1, 0, 0, 0, 0);
            end = new Date(inputDate.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
        default:
            throw new Error("Type must be one of: day, week, month, year");
    }
    return { start, end };
}

export class StatisticsService {
    static async productsInStock() {
        const productItemRepo = AppDataSource.getRepository(ProductItem);
        const result = await productItemRepo
            .createQueryBuilder("productItem")
            .select("(SUM(productItem.quantity), 0)", "totalInStock")
            .getRawOne();

        return { totalInStock: Number(result.totalInStock) };
    }

    static async ordersStatistics(type: string, date: string) {
        const { start, end } = getTimeRange(type, date);
        const orderRepo = AppDataSource.getRepository(Order);
        const orders = await orderRepo.find({
            where: {
                orderDate: Between(start, end)
            }
        });
        const totalOrders = orders.length;
        return { totalOrders};
    }
}
