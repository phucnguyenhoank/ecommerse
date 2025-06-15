import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";

const categoryService = new CategoryService();

export class CategoryController {
    static async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { name, parent_id } = req.body;

            if (!name) {
                res.status(400).json({ message: "Name is required" });
                return;
            }

            await categoryService.updateCategory(id, { name, parent_id: parent_id ?? null });

            res.status(200).json({ message: "Cập nhật danh mục thành công" });
        } catch (error: any) {
            console.error("❌ Error in updateCategory:", error);
            res.status(500).json({ message: error.message || "Update failed" });
        }
    }

    static async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: "Error fetching categories", error });
        }
    }

    static async getCategoryById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const category = await categoryService.getCategoryById(id);
            if (!category) {
                res.status(404).json({ message: "Category not found" });
            } else {
                res.status(200).json(category);
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching category", error });
        }
    }

    static async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const { name, parent_id } = req.body;

            if (!name) {
                res.status(400).json({ message: "Name is required" });
                return;
            }

            await categoryService.createCategory({ name, parent_id: parent_id ?? null });

            res.status(201).json({ message: "Tạo danh mục thành công" });
        } catch (error) {
            res.status(500).json({ message: "Error creating category", error });
        }
    }

    static async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const category = await categoryService.getCategoryById(id);

            if (!category) {
                res.status(404).json({ message: "Category not found" });
                return;
            }

            await categoryService.deleteCategory(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Error deleting category", error });
        }
    }
}
