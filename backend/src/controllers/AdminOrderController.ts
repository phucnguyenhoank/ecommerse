import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { OrderService } from "../services/OrderService";
import { Order } from "../entity/Order";
import { ProductItem } from "../entity/ProductItem";
import { User } from "../entity/User";
import { Address } from "../entity/Address";
import { Shipping_method } from "../entity/ShippingMethod";
import { Order_status } from "../entity/Order_status";

const orderService = new OrderService();

export class AdminOrderController {
static async getAllOrders(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string)?.trim() || "";

    const queryBuilder = AppDataSource.getRepository(Order)
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.orderItems", "orderItems")
      .leftJoinAndSelect("orderItems.productItem", "productItem")
      .orderBy("order.orderDate", "DESC")
      .skip(skip)
      .take(limit);

    if (search) {
      const searchId = parseInt(search);

      queryBuilder.andWhere(
        `(
          LOWER(CONVERT(VARCHAR(255), user.username)) LIKE :search OR
          LOWER(CONVERT(VARCHAR(255), order.guest_name)) LIKE :search OR
          LOWER(CONVERT(VARCHAR(255), order.guest_email)) LIKE :search OR
          order.id = :searchId
        )`,
        {
          search: `%${search.toLowerCase()}%`,
          searchId: isNaN(searchId) ? -1 : searchId,
        }
      );
    }

    const [orders, totalCount] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);

    res.json({ data: orders, totalCount });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
}


  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const order = await AppDataSource.getRepository(Order).findOne({
        where: { id: parseInt(req.params.id) },
        relations: [
          "user",
          "shippingAddress",
          "shippingMethod",
          "orderStatus",
          "orderItems",
          "orderItems.productItem",
          "orderItems.productItem.images",
           "orderItems.productItem.product", 
        ],
      });

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Error fetching order", error });
    }
  }

  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Error creating order", error });
    }
  }
static async createOrderWithItems(req: Request, res: Response): Promise<void> {
  console.log(" REQ BODY", JSON.stringify(req.body, null, 2));

  try {
      console.log(" REQ BODY", JSON.stringify(req.body, null, 2));

    const {
      user_id,
      shipping_address_id,
      shipping_method_id,
      order_status_id,
      order_total,
      order_items,
      guest_info,
    } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const addressRepo = AppDataSource.getRepository(Address);
    const shippingRepo = AppDataSource.getRepository(Shipping_method);
    const statusRepo = AppDataSource.getRepository(Order_status);
    const productItemRepo = AppDataSource.getRepository(ProductItem);

    let user: User | undefined;
    let address: Address | null = null;

    const order = new Order();

    if (user_id) {
      user = await userRepo.findOneBy({ id: user_id }) ?? undefined;
      address = await addressRepo.findOneBy({ id: shipping_address_id });

      console.log(" [User found]:", user);
      console.log(" [User Address found]:", address);

      if (!user) {
        throw new Error("User not found");
      }

      order.user = user;
    } 
    
    else if (guest_info) {
      address = addressRepo.create({
        street_name: guest_info.street_name,
        city: guest_info.city,
        region: guest_info.region,
        district: guest_info.district,
        country: guest_info.country,
      });

      await addressRepo.save(address);

      console.log("[Guest info]:", guest_info);
      console.log(" [Guest Address saved]:", address);

      order.guest_name = guest_info.guest_name;
      order.guest_email = guest_info.guest_email;
      order.guest_phone = guest_info.guest_phone;
    }

    // Phương thức giao hàng và trạng thái
    const shippingMethod = await shippingRepo.findOneBy({ id: parseInt(shipping_method_id) });
    const orderStatus = await statusRepo.findOneBy({ id: parseInt(order_status_id) });

    console.log(" [Shipping Method]:", shippingMethod);
    console.log(" [Order Status]:", orderStatus);

    if (!shippingMethod) throw new Error("Shipping method not found");
    if (!orderStatus) throw new Error("Order status not found");

    order.shippingAddress = address!;
    order.shippingMethod = shippingMethod;
    order.orderStatus = orderStatus;
    order.order_total = order_total;

    
    order.user = user ?? null;
    order.shippingAddress = address ?? null;
    order.shippingMethod = shippingMethod ?? null;
    order.orderStatus = orderStatus ?? null;

    console.log("[Order before save]:", order);

    const newOrder = await AppDataSource.getRepository(Order).save(order);
    console.log(" [Order saved]:", newOrder);

    const createdItems = [];

    for (const item of order_items) {
      const productItem = await productItemRepo.findOne({
        where: { id: item.product_item_id },
        relations: ["product", "color", "size", "images"], 
      });

      console.log(" [ProductItem]:", productItem);

      if (!productItem) continue;

      const orderItem = await orderService.addOrderItem(newOrder.id, {
        productItem,
        quantity: item.quantity,
        price: item.price,
      });

      console.log("[OrderItem created]:", orderItem);
      createdItems.push(orderItem);
    }

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: newOrder,
      order_items: createdItems,
    });
  } catch (error) {
    console.error(" Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error });
  }
}



  static async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const updatedOrder = await orderService.updateOrder(
        parseInt(req.params.id),
        req.body
      );
      if (!updatedOrder) {
        res.status(404).json({ message: "Order not found" });
      } else {
        res.json(updatedOrder);
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating order", error });
    }
  }

  static async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await orderService.deleteOrder(parseInt(req.params.id));
      if (!deleted) {
        res.status(404).json({ message: "Order not found" });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting order", error });
    }
  }

  static async addOrderItem(req: Request, res: Response): Promise<void> {
    try {
      const orderItem = await orderService.addOrderItem(
        parseInt(req.params.id),
        req.body
      );
      res.status(201).json(orderItem);
    } catch (error) {
      res.status(500).json({ message: "Error adding order item", error });
    }
  }
  static async getOrdersCount(req: Request, res: Response) {
    try {
      const count= await orderService.getOrderCount();
      
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Error counting Order", error });
    }
  }
}
