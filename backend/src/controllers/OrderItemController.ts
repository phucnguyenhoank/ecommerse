import { Request, Response } from "express";
import { OrderItemService } from "../services/OrderItemService";

const orderItemService = new OrderItemService();

export class OrderItemController {
  static async getAllOrderItems(req: Request, res: Response) {
    try {
      const orderItems = await orderItemService.getAllOrderItems();
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order items", error });
    }
  }

  static async createOrderItem(req: Request, res: Response) {
    try {
      await orderItemService.createOrderItem(req.body);
      res.status(201).json({ message: "Order item created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error creating order item", error });
    }
  }

  static async deleteOrderItem(req: Request, res: Response) {
    try {
      const deleted = await orderItemService.deleteOrderItem(parseInt(req.params.id));
      if (!deleted) res.status(404).json({ message: "Order item not found" });
      else res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting order item", error });
    }
  }
}
