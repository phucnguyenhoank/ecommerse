import { Request, Response } from "express";
import { CartService } from "../services/CartService";

const cartService = new CartService();

export class CartController {
    static async getAllCarts(req: Request, res: Response) {
        try {
            const carts = await cartService.getAllCarts();
            res.json(carts);
        } catch (error) {
            res.status(500).json({ message: "Error fetching carts", error });
        }
    }

    static async getCartById(req: Request, res: Response) {
        try {
            const cart = await cartService.getCartById(parseInt(req.params.id));
            if (!cart) res.status(404).json({ message: "Cart not found" });
            else res.json(cart);
        } catch (error) {
            res.status(500).json({ message: "Error fetching cart", error });
        }
    }
    static async createCart(req: Request, res: Response) {
        try {
            const cart = await cartService.createCart(req.body);
            res.status(201).json(cart);
        } catch (error) {
            res.status(500).json({ message: "Error creating cart", error });
        }
    }
    static async deleteCart(req: Request, res: Response) {  
        try {
            const deleted = await cartService.deleteCart(parseInt(req.params.id));
            if (!deleted) res.status(404).json({ message: "Cart not found" });
            else res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Error deleting cart", error });
        }
    }
}