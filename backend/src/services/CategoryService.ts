import { Repository, IsNull } from "typeorm";
import { Category } from "../entity/Category";
import { AppDataSource } from "../config/datasource";
import { NotFoundException } from "@nestjs/common";
import util from "util";

// Khai báo type input gọn gàng
interface CategoryInput {
    name: string;
    parent_id?: number | null;
}

export class CategoryService {
    private categoryRepository: Repository<Category>;

    constructor() {
        this.categoryRepository = AppDataSource.getRepository(Category);
    }

    async getAllCategories(): Promise<Category[]> {
        try {
            return await this.categoryRepository.find({
                relations: ['parent', 'children', 'products'],
            });
        } catch (error: any) {
            console.error("getAllCategories Error:", util.inspect(error, { depth: null }));
            throw new Error(error?.message || 'Failed to fetch categories');
        }
    }

    async getCategoryById(id: number): Promise<Category> {
        try {
            const category = await this.categoryRepository.findOne({
                where: { id },
                relations: ['parent', 'children', 'products'],
            });
            if (!category) {
                throw new NotFoundException(`Category with ID ${id} not found`);
            }
            return category;
        } catch (error: any) {
            console.error("❌ getCategoryById Error:", util.inspect(error, { depth: null }));
            if (error instanceof NotFoundException) throw error;
            throw new Error(error?.message || 'Failed to fetch category');
        }
    }

    async createCategory(data: CategoryInput): Promise<Category> {
        try {
            const category = new Category();
            category.name = data.name;

            if (data.parent_id) {
                const parent = await this.categoryRepository.findOne({
                    where: { id: data.parent_id },
                });
                if (!parent) {
                    throw new NotFoundException('Parent category not found');
                }
                category.parent = parent;
            } else {
                category.parent = null;
            }

            return await this.categoryRepository.save(category);
        } catch (error: any) {
            console.error("❌ createCategory Error:", util.inspect(error, { depth: null }));
            if (error instanceof NotFoundException) throw error;
            throw new Error(error?.message || 'Failed to create category');
        }
    }

    async updateCategory(id: number, data: CategoryInput): Promise<Category> {
        try {
            const category = await this.getCategoryById(id);
            category.name = data.name;

            if (data.parent_id) {
                const parent = await this.categoryRepository.findOne({
                    where: { id: data.parent_id },
                });
                if (!parent) {
                    throw new NotFoundException('Parent category not found');
                }
                category.parent = parent;
            } else {
                category.parent = null;
            }

            return await this.categoryRepository.save(category);
        } catch (error: any) {
            console.error("❌ updateCategory Error:", util.inspect(error, { depth: null }));
            if (error instanceof NotFoundException) throw error;
            throw new Error(error?.message || 'Failed to update category');
        }
    }

    async deleteCategory(id: number): Promise<void> {
        try {
            const category = await this.getCategoryById(id);

            if (category.products?.length) {
                throw new Error('Cannot delete category with associated products');
            }

            const childCategories = await this.categoryRepository.find({
                where: { parent: { id } } as any,
            });

            if (childCategories.length > 0) {
                throw new Error('Cannot delete category with child categories');
            }

            await this.categoryRepository.remove(category);
        } catch (error: any) {
            console.error("❌ deleteCategory Error:", util.inspect(error, { depth: null }));
            if (error instanceof NotFoundException) throw error;
            throw new Error(error?.message || 'Failed to delete category');
        }
    }

    async getCategoryHierarchy(): Promise<Category[]> {
        try {
            return await this.categoryRepository.find({
                where: { parent: IsNull() } as any,
                relations: ['children', 'children.children'],
            });
        } catch (error: any) {
            console.error("❌ getCategoryHierarchy Error:", util.inspect(error, { depth: null }));
            throw new Error(error?.message || 'Failed to fetch category hierarchy');
        }
    }

    async getCategoriesByParentId(parentId: number): Promise<Category[]> {
        try {
            return await this.categoryRepository.find({
                where: { parent: { id: parentId } } as any,
                relations: ['children', 'products'],
            });
        } catch (error: any) {
            console.error("❌ getCategoriesByParentId Error:", util.inspect(error, { depth: null }));
            throw new Error(error?.message || 'Failed to fetch child categories');
        }
    }
}