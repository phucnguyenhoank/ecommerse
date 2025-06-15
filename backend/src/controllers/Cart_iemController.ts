import { Request, Response } from "express";
import { CartItemService } from "../services/CartItemService";

const cartItemService = new CartItemService();

export class CartItemController {
    static async getAllCartItems(req: Request, res: Response) {
        try {
            const cartItems = await cartItemService.getAllCartItems();
            res.json(cartItems);
        } catch (error) {
            res.status(500).json({ message: "Error fetching cart items", error });
        }
    }

    static async getCartItemById(req: Request, res: Response) {
        try {
            const cartItem = await cartItemService.getCartItemById(parseInt(req.params.id));
            if (!cartItem) res.status(404).json({ message: "Cart item not found" });
            else res.json(cartItem);
        } catch (error) {
            res.status(500).json({ message: "Error fetching cart item", error });
        }
    }
    static async createCartItem(req: Request, res: Response) {
        try {
            const { cartId, productItemId, quantity } = req.body;
            const cartItem = await cartItemService.createCartItem(cartId, productItemId, quantity);
            res.status(201).json(cartItem);
        } catch (error) {
            res.status(500).json({ message: "Error creating cart item", error });
        }
    }
    static async deleteCartItem(req: Request, res: Response) {
        try {
            const deleted = await cartItemService.deleteCartItem(parseInt(req.params.id));
            if (!deleted) res.status(404).json({ message: "Cart item not found" });
            else res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Error deleting cart item", error });
        }
    }
}
