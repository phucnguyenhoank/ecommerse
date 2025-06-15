import { Repository } from "typeorm";
import { ProductItem } from "../entity/ProductItem";
import { Product } from "../entity/Product";
import { Size } from "../entity/Size";
import { Color } from "../entity/Color";
import { Image } from "../entity/Image";
import { AppDataSource } from "../config/datasource";
import { In } from "typeorm";

const repo = AppDataSource.getRepository(ProductItem);
export class ProductItemService {
  private productItemRepository: Repository<ProductItem>;
  private productRepository: Repository<Product>;
  private sizeRepository: Repository<Size>;
  private colorRepository: Repository<Color>;
  private imageRepository: Repository<Image>;

  constructor() {
    this.productItemRepository = AppDataSource.getRepository(ProductItem);
    this.productRepository = AppDataSource.getRepository(Product);
    this.sizeRepository = AppDataSource.getRepository(Size);
    this.colorRepository = AppDataSource.getRepository(Color);
    this.imageRepository = AppDataSource.getRepository(Image);
  }

  async getAllProductItems(): Promise<ProductItem[]> {
    return this.productItemRepository.find({
      relations: ["product", "size", "color", "images"],
    });
  }

  async getProductItemById(id: number): Promise<ProductItem | null> {
    return this.productItemRepository.findOne({
      where: { id },
      relations: ["product", "size", "color", "images"],
    });
  }

  async getProductItemsByProductId(productId: number): Promise<ProductItem[]> {
    return this.productItemRepository.find({
      where: { product: { id: productId } },
      relations: ["product", "size", "color", "images"],
    });
  }

  async createProductItem(data: {
    product_id: number;
    price: number;
    quantity: number;
    size_id?: number;
    color_id?: number;
    images: { image_url: string }[];
  }): Promise<ProductItem> {
    const product = await this.productRepository.findOne({ where: { id: data.product_id } });
    if (!product) throw new Error("Product not found");

    let size: Size | null = null;
    if (data.size_id) {
      size = await this.sizeRepository.findOne({ where: { id: data.size_id } });
      if (!size) throw new Error("Size not found");
    }

    let color: Color | null = null;
    if (data.color_id) {
      color = await this.colorRepository.findOne({ where: { id: data.color_id } });
      if (!color) throw new Error("Color not found");
    }

    const productItem = new ProductItem();
    productItem.product = product;
    productItem.size = size;
    productItem.color = color;
    productItem.quantity = data.quantity;
    productItem.price = data.price;
    productItem.images = this.mapImages(data.images);

    return await this.productItemRepository.save(productItem);
  }

  async updateProductItem(id: number, data: {
    price?: number;
    quantity?: number;
    images?: { image_url: string }[];
  }): Promise<ProductItem | null> {
    const productItem = await this.productItemRepository.findOne({
      where: { id },
      relations: ["images"],
    });

    if (!productItem) return null;

    if (data.price !== undefined) productItem.price = data.price;
    if (data.quantity !== undefined) productItem.quantity = data.quantity;

    if (data.images !== undefined) {
      // Khi client truyền mảng rỗng thì cũng xóa sạch ảnh
      await this.imageRepository.delete({ productItem: { id } });
      productItem.images = this.mapImages(data.images);
    }

    return await this.productItemRepository.save(productItem);
  }

  async deleteProductItem(id: number): Promise<boolean> {
    const result = await this.productItemRepository.delete(id);
    return result.affected !== 0;
  }

  private mapImages(images: { image_url: string }[]): Image[] {
    return images.map(img => {
      const image = new Image();
      image.image_url = img.image_url;
      return image;
    });
  }
  
  async getPaginatedProductItems(page: number, limit: number, categoryIds: number[]) {
    const productItemRepo = AppDataSource.getRepository(ProductItem);
    const skip = (page - 1) * limit;

    const query = productItemRepo
      .createQueryBuilder("productItem")
      .leftJoinAndSelect("productItem.product", "product")
      .leftJoinAndSelect("productItem.images", "images");

    if (categoryIds.length > 0) {
      query.where("product.category_id IN (:...categoryIds)", { categoryIds });
    }

    const [data, totalCount] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, totalCount };
  }
}
