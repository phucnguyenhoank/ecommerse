import { Repository } from "typeorm";
import { Cart_item } from "../entity/CartItem";
import { Cart } from "../entity/Cart";
import { ProductItem } from "../entity/ProductItem";
import { AppDataSource } from "../config/datasource";

export class CartItemService {
    private cartItemRepository: Repository<Cart_item>;
    private cartRepository: Repository<Cart>;
    private productItemRepository: Repository<ProductItem>;

    constructor() {
        this.cartItemRepository = AppDataSource.getRepository(Cart_item);
        this.cartRepository = AppDataSource.getRepository(Cart);
        this.productItemRepository = AppDataSource.getRepository(ProductItem);
    }

    async getAllCartItems(): Promise<Cart_item[]> {
        return await this.cartItemRepository.find({
            relations: ['cart', 'productItem']
        });
    }

    async getCartItemById(id: number): Promise<Cart_item | null> {
        return await this.cartItemRepository.findOne({
            where: { id },
            relations: ['cart', 'productItem']
        });
    }

    async getCartItemsByCartId(cartId: number): Promise<Cart_item[]> {
        return await this.cartItemRepository.find({
            where: { cart: { id: cartId } },
            relations: ['productItem']
        });
    }

    async createCartItem(cartId: number, productItemId: number, quantity: number): Promise<Cart_item> {
        // Kiểm tra cart tồn tại
        const cart = await this.cartRepository.findOne({ where: { id: cartId } });
        if (!cart) {
            throw new Error("Cart not found");
        }

        // Kiểm tra product item tồn tại
        const productItem = await this.productItemRepository.findOne({ where: { id: productItemId } });
        if (!productItem) {
            throw new Error("Product item not found");
        }

        // Kiểm tra số lượng sản phẩm còn đủ không
        if (productItem.quantity < quantity) {
            throw new Error("Not enough product quantity");
        }

        const cartItem = this.cartItemRepository.create({
            cart: cart,
            productItem: productItem,
            quantity: quantity
        });

        return await this.cartItemRepository.save(cartItem);
    }

    async updateCartItem(id: number, quantity: number): Promise<Cart_item | null> {
        const cartItem = await this.getCartItemById(id);
        if (!cartItem) {
            return null;
        }

        // Kiểm tra số lượng sản phẩm còn đủ không
        if (cartItem.productItem.quantity < quantity) {
            throw new Error("Not enough product quantity");
        }

        cartItem.quantity = quantity;
        return await this.cartItemRepository.save(cartItem);
    }

    async deleteCartItem(id: number): Promise<boolean> {
        const result = await this.cartItemRepository.delete(id);
        return result.affected !== 0;
    }

    async deleteCartItemsByCartId(cartId: number): Promise<boolean> {
        const result = await this.cartItemRepository.delete({ cart: { id: cartId } });
        return result.affected !== 0;
    }

    async getCartTotal(cartId: number): Promise<number> {
        const cartItems = await this.getCartItemsByCartId(cartId);
        return cartItems.reduce((total, item) => {
            return total + (item.productItem.price * item.quantity);
        }, 0);
    }
}