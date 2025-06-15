import { Repository } from "typeorm";
import { Cart } from "../entity/Cart";
import { User } from "../entity/User";
import { AppDataSource } from "../config/datasource";

export class CartService {
    private cartRepository: Repository<Cart>;
    private userRepository: Repository<User>;

    constructor() {
        this.cartRepository = AppDataSource.getRepository(Cart);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async getAllCarts(): Promise<Cart[]> {
        return await this.cartRepository.find({
            relations: ['user', 'cartItems']
        });
    }

    async getCartById(id: number): Promise<Cart | null> {
        return await this.cartRepository.findOne({
            where: { id },
            relations: ['user', 'cartItems']
        });
    }

    async getCartByUserId(userId: number): Promise<Cart | null> {
        return await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ['cartItems']
        });
    }

    async createCart(userId: number): Promise<Cart> {
        // Kiểm tra user tồn tại
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error("User not found");
        }

        // Kiểm tra user đã có cart chưa
        const existingCart = await this.getCartByUserId(userId);
        if (existingCart) {
            throw new Error("User already has a cart");
        }

        const cart = this.cartRepository.create({
            user: user
        });

        return await this.cartRepository.save(cart);
    }

    async updateCart(id: number, cartData: Partial<Cart>): Promise<Cart | null> {
        const cart = await this.getCartById(id);
        if (!cart) {
            return null;
        }

        // Chỉ cho phép cập nhật một số trường nhất định
        const allowedFields = ['status'];
        Object.keys(cartData).forEach(key => {
            if (allowedFields.includes(key)) {
                (cart as any)[key] = cartData[key as keyof Cart];
            }
        });

        return await this.cartRepository.save(cart);
    }

    async deleteCart(id: number): Promise<boolean> {
        const result = await this.cartRepository.delete(id);
        return result.affected !== 0;
    }

    async clearCart(id: number): Promise<boolean> {
        const cart = await this.getCartById(id);
        if (!cart) {
            return false;
        }

        // Xóa tất cả cart items
        cart.cartItems = [];
        await this.cartRepository.save(cart);
        return true;
    }

    async getCartTotal(id: number): Promise<number> {
        const cart = await this.getCartById(id);
        if (!cart) {
            return 0;
        }

        return cart.cartItems.reduce((total, item) => {
            return total + (parseFloat(item.productItem.price) * item.quantity);
        }, 0);
    }
}