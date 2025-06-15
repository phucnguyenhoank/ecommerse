import { Repository } from "typeorm";
import { AppDataSource } from "../config/datasource";
import { Order } from "../entity/Order";
import { ProductItem } from "../entity/ProductItem";
import { OrderItem } from "../entity/OrderItem";

export class OrderItemService {
  private orderItemRepository: Repository<OrderItem>;
  private orderRepository: Repository<Order>;
  private productItemRepository: Repository<ProductItem>;

  constructor() {
    this.orderItemRepository = AppDataSource.getRepository(OrderItem);
    this.orderRepository = AppDataSource.getRepository(Order);
    this.productItemRepository = AppDataSource.getRepository(ProductItem);
  }

  async getAllOrderItems(): Promise<OrderItem[]> {
    return this.orderItemRepository.find({
      relations: ["order", "productItem"],
    });
  }

  async createOrderItem(data: {
    order: { id: number };
    productItem: { id: number };
    quantity: string;
    price: string;
  }): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id: data.order.id } });
    if (!order) throw new Error("Order not found");

    const productItem = await this.productItemRepository.findOne({ where: { id: data.productItem.id } });
    if (!productItem) throw new Error("ProductItem not found");

    const orderItem = this.orderItemRepository.create({
      order,
      productItem,
      quantity: data.quantity,
      price: data.price,
    });

    await this.orderItemRepository.save(orderItem);
  }

  async deleteOrderItem(id: number): Promise<boolean> {
    const result = await this.orderItemRepository.delete(id);
    return result.affected !== 0;
  }
}
