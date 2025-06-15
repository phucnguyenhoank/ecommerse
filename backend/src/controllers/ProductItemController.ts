import { Request, Response } from "express";
import { ProductItemService } from "../services/ProductItemService";

const productItemService = new ProductItemService();

export class ProductItemController {
  static async getAllProductItems(req: Request, res: Response) {
    try {
      const productItems = await productItemService.getAllProductItems();
      res.json(productItems);
    } catch (error) {
      console.error("Error getAllProductItems:", error);
      res.status(500).json({ message: "Error fetching product items", error });
    }
  }

  static async getProductItemById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const productItem = await productItemService.getProductItemById(id);
      if (!productItem) {
        res.status(404).json({ message: "Product item not found" });
        return;
      }
      res.json(productItem);
    } catch (error) {
      console.error("❌ Error getProductItemById:", error);
      res.status(500).json({ message: "Error fetching product item", error });
    }
  }

  static async getProductItemsByProductId(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.productId);
      const productItems = await productItemService.getProductItemsByProductId(productId);
      res.json(productItems);
    } catch (error) {
      console.error("❌ Error getProductItemsByProductId:", error);
      res.status(500).json({ message: "Error fetching product items", error });
    }
  }

  static async createProductItem(req: Request, res: Response) {
    try {
      const productItem = await productItemService.createProductItem(req.body);
      res.status(201).json(productItem);
    } catch (error) {
      console.error("❌ Error createProductItem:", error);
      res.status(500).json({ message: "Error creating product item", error });
    }
  }

  static async updateProductItem(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updatedProductItem = await productItemService.updateProductItem(id, req.body);
      if (!updatedProductItem) {
        res.status(404).json({ message: "Product item not found" });
        return;
      }
      res.json(updatedProductItem);
    } catch (error) {
      console.error("❌ Error updateProductItem:", error);
      res.status(500).json({ message: "Error updating product item", error });
    }
  }

  static async deleteProductItem(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await productItemService.deleteProductItem(id);
      if (!deleted) {
        res.status(404).json({ message: "Product item not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.error("❌ Error deleteProductItem:", error);
      res.status(500).json({ message: "Error deleting product item", error });
    }
  }
  static async getPaginatedProductItems(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const categoryIds = (req.query.categoryIds as string || "")
      .split(",")
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    const { data, totalCount } = await productItemService.getPaginatedProductItems(
      page,
      limit,
      categoryIds
    );

    res.json({ data, totalCount });
  } catch (error) {
    console.error(" Error getPaginatedProductItems:", error);
    res.status(500).json({ message: "Error fetching paginated product items", error });
  }
}

}
