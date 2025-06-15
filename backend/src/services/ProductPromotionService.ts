import { Repository } from "typeorm";
import { Product_promotion } from "../entity/ProductPromotion";
import { AppDataSource } from "../config/datasource";
import { Promotion } from "../entity/Promotion";
import { ProductItem } from "../entity/ProductItem";
import { Product } from "../entity/Product";

export class ProductPromotionService {
    private productPromotionRepository: Repository<Product_promotion>;
    private promotionRepository: Repository<Promotion>;
    private productRepository: Repository<Product>;

    constructor() {
        this.productPromotionRepository = AppDataSource.getRepository(Product_promotion);
        this.promotionRepository = AppDataSource.getRepository(Promotion);
        this.productRepository = AppDataSource.getRepository(Product);
    }

    // Lấy tất cả các product promotion
    async getAllProductPromotions(): Promise<Product_promotion[]> {
        return this.productPromotionRepository.find({
            relations: ["product", "promotion"]
        });
    }

    // Lấy product promotion theo product_id và promotion_id
    async getProductPromotionByIds(productId: number, promotionId: number): Promise<Product_promotion | null> {
        return this.productPromotionRepository.findOne({
            where: {
                product_id: productId,
                promotion_id: promotionId,
            },
            relations: ["product", "promotion"]
        });
    }

    // Lấy tất cả promotion của một sản phẩm
    async getProductPromotions(productId: number): Promise<Product_promotion[]> {
        return this.productPromotionRepository.find({
            where: { product_id: productId },
            relations: ["promotion"]
        });
    }

    // Tạo một product promotion mới
    async createProductPromotion(data: Partial<Product_promotion>): Promise<Product_promotion> {
        // Xóa các promotion cũ của sản phẩm này
        await this.deleteProductPromotions(data.product_id!);
        
        const productPromotion = this.productPromotionRepository.create(data);
        return this.productPromotionRepository.save(productPromotion);
    }

    // Cập nhật một product promotion
    async updateProductPromotion(productId: number, promotionId: number, data: Partial<Product_promotion>): Promise<Product_promotion | null> {
        const productPromotion = await this.getProductPromotionByIds(productId, promotionId);
        if (!productPromotion) return null;

        Object.assign(productPromotion, data);
        return this.productPromotionRepository.save(productPromotion);
    }

    // Xóa một product promotion
    async deleteProductPromotion(productId: number, promotionId: number): Promise<boolean> {
        const result = await this.productPromotionRepository.delete({
            product_id: productId,
            promotion_id: promotionId,
        });
        return result.affected !== 0;
    }

    // Xóa tất cả promotion của một sản phẩm
    async deleteProductPromotions(productId: number): Promise<boolean> {
        const result = await this.productPromotionRepository.delete({
            product_id: productId
        });
        return result.affected !== 0;
    }

    // Lấy promotion hiện tại của sản phẩm
    async getCurrentPromotion(productId: number): Promise<Promotion | null> {
        const now = new Date();
        const productPromotion = await this.productPromotionRepository.findOne({
            where: {
                product_id: productId
            },
            relations: ["promotion"]
        });

        if (!productPromotion?.promotion) return null;

        const promotion = productPromotion.promotion;
        if (promotion.start_at <= now && promotion.end_at >= now) {
            return promotion;
        }

        return null;
    }

    async setDiscount(productId: number, discountRate: number): Promise<void> {
        const now = new Date();
        // Tìm promotion hiện tại (còn hiệu lực)
        const productPromotion = await this.productPromotionRepository.findOne({
            where: { product: { id: productId } },
            relations: ["promotion"]
        });

        if (discountRate > 0) {
            if (productPromotion && productPromotion.promotion && productPromotion.promotion.end_at > now) {
                // Cập nhật promotion hiện tại
                productPromotion.promotion.discount_rate = discountRate;
                productPromotion.promotion.start_at = now;
                productPromotion.promotion.end_at = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                await this.promotionRepository.save(productPromotion.promotion);
            } else {
        // Tạo promotion mới
                const product = await this.productRepository.findOne({ where: { id: productId } });
                const promotion = this.promotionRepository.create({
                    name: product?.name || "Promotion",
                    discount_rate: discountRate,
                    start_at: now,
                    end_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        });
                await this.promotionRepository.save(promotion);
                const newProductPromotion = this.productPromotionRepository.create({
                    product: { id: productId },
                    promotion: promotion
                });
                await this.productPromotionRepository.save(newProductPromotion);
            }
        } else {
            // discount = 0, kết thúc promotion hiện tại nếu có
            if (productPromotion && productPromotion.promotion && productPromotion.promotion.end_at > now) {
                productPromotion.promotion.end_at = now;
                await this.promotionRepository.save(productPromotion.promotion);
            }
        }
    }

    async getProductDiscount(productId: number): Promise<number> {
        const productPromotion = await this.productPromotionRepository.findOne({
            where: { product: { id: productId } },
            relations: ["promotion"]
        });

        return productPromotion?.promotion?.discount_rate || 0;
    }
}
