import { Request, Response } from "express";
import { ProductPromotionService } from "../services/ProductPromotionService";
import { AppDataSource } from "../config/datasource";
import { Promotion } from "../entity/Promotion";
import { Product } from "../entity/Product";

const productPromotionService = new ProductPromotionService();

export class ProductPromotionController {
    // Lấy tất cả các product promotion
    static async getAllProductPromotions(req: Request, res: Response) {
        try {
            const productPromotions = await productPromotionService.getAllProductPromotions();
            res.json(productPromotions);
        } catch (error) {
            res.status(500).json({ message: "Error fetching product promotions", error });
        }
    }

    // Lấy product promotion theo product_id và promotion_id
    static async getProductPromotionByIds(req: Request, res: Response) {
        try {
            const { productId, promotionId } = req.params;
            const productPromotion = await productPromotionService.getProductPromotionByIds(
                parseInt(productId),
                parseInt(promotionId)
            );
            if (!productPromotion) {
                res.status(404).json({ message: "Product promotion not found" });
            } else {
                res.json(productPromotion);
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching product promotion", error });
        }
    }

    // Tạo product promotion mới
    static async createProductPromotion(req: Request, res: Response) {
        try {
            const productPromotion = await productPromotionService.createProductPromotion(req.body);
            res.status(201).json(productPromotion);
        } catch (error) {
            res.status(500).json({ message: "Error creating product promotion", error });
        }
    }

    // Cập nhật product promotion
    static async updateProductPromotion(req: Request, res: Response) {
        try {
            const { productId, promotionId } = req.params;
            const updatedProductPromotion = await productPromotionService.updateProductPromotion(
                parseInt(productId),
                parseInt(promotionId),
                req.body
            );
            if (!updatedProductPromotion) {
                res.status(404).json({ message: "Product promotion not found" });
            } else {
                res.json(updatedProductPromotion);
            }
        } catch (error) {
            res.status(500).json({ message: "Error updating product promotion", error });
        }
    }

    // Xóa product promotion
    static async deleteProductPromotion(req: Request, res: Response) {
        try {
            const { productId, promotionId } = req.params;
            const deleted = await productPromotionService.deleteProductPromotion(
                parseInt(productId),
                parseInt(promotionId)
            );
            if (!deleted) {
                res.status(404).json({ message: "Product promotion not found" });
            } else {
                res.status(204).send();
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting product promotion", error });
        }
    }
}

// Định nghĩa hàm setDiscount ngoài class
export async function setDiscount(req: Request, res: Response) {
        try {
            const { product_id, discount_rate } = req.body;

            if (!product_id || discount_rate === undefined) {
                return res.status(400).json({ message: "Product ID and discount rate are required" });
            }

        if (discount_rate < 0 || discount_rate > 1) {
            return res.status(400).json({ message: "Discount rate must be between 0 and 1" });
            }

            // Kiểm tra xem sản phẩm có tồn tại không
            const productRepo = AppDataSource.getRepository(Product);
            const product = await productRepo.findOne({ where: { id: product_id } });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

        // Truyền discount_rate thẳng vào service
        await productPromotionService.setDiscount(product_id, discount_rate);

            res.status(200).json({
            message: discount_rate === 0 ? "Discount removed successfully" : "Discount set successfully"
            });
        } catch (error) {
            console.error("Error setting discount:", error);
            res.status(500).json({ message: "Error setting discount", error });
    }
}
