import { Repository } from "typeorm";
import { Color } from "../entity/Color";
import { AppDataSource } from "../config/datasource";
import { NotFoundException } from "@nestjs/common";

export class ColorService {
    private colorRepository: Repository<Color>;

    constructor() {
        this.colorRepository = AppDataSource.getRepository(Color);
    }

    async getAllColors(): Promise<Color[]> {
        try {
            return await this.colorRepository.find({
                relations: ['productItems']
            });
        } catch (error) {
            throw new Error('Failed to fetch colors');
        }
    }

    async getColorById(id: number): Promise<Color> {
        try {
            const color = await this.colorRepository.findOne({
                where: { id },
                relations: ['productItems']
            });
            if (!color) {
                throw new NotFoundException(`Color with ID ${id} not found`);
            }
            return color;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('Failed to fetch color');
        }
    }

    async createColor(colorData: Partial<Color>): Promise<Color> {
        try {
            // Kiểm tra tên màu đã tồn tại chưa
            const existingColor = await this.colorRepository.findOne({
                where: { name: colorData.name }
            });
            if (existingColor) {
                throw new Error('Color name already exists');
            }

            const color = this.colorRepository.create(colorData);
            return await this.colorRepository.save(color);
        } catch (error) {
            throw new Error('Failed to create color');
        }
    }

    async updateColor(id: number, colorData: Partial<Color>): Promise<Color> {
        try {
            const color = await this.getColorById(id);
            
            // Kiểm tra tên màu mới đã tồn tại chưa (nếu có thay đổi tên)
            if (colorData.name && colorData.name !== color.name) {
                const existingColor = await this.colorRepository.findOne({
                    where: { name: colorData.name }
                });
                if (existingColor) {
                    throw new Error('Color name already exists');
                }
            }

            // Cập nhật các trường được phép
            Object.assign(color, colorData);
            return await this.colorRepository.save(color);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('Failed to update color');
        }
    }

    async deleteColor(id: number): Promise<void> {
        try {
            const color = await this.getColorById(id);
            
            // Kiểm tra xem màu có được sử dụng trong product items không
            if (color.productItems && color.productItems.length > 0) {
                throw new Error('Cannot delete color that is being used in product items');
            }

            await this.colorRepository.remove(color);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('Failed to delete color');
        }
    }

    async getColorsByProductId(productId: number): Promise<Color[]> {
        try {
            return await this.colorRepository
                .createQueryBuilder('color')
                .innerJoin('color.productItems', 'productItem')
                .where('productItem.productId = :productId', { productId })
                .getMany();
        } catch (error) {
            throw new Error('Failed to fetch colors by product');
        }
    }
}