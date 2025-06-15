import { Repository } from "typeorm";
import { Image } from "../entity/Image";
import { AppDataSource } from "../config/datasource";

export class ImageService {
    private imageRepository: Repository<Image>;

    constructor() {
        this.imageRepository = AppDataSource.getRepository(Image);
    }

    async getAllImages(): Promise<Image[]> {
        return this.imageRepository.find();
    }

    async getImageById(id: number): Promise<Image | null> {
        return this.imageRepository.findOne({ where: { id } });
    }

    async createImage(data: Partial<Image>): Promise<Image> {
        const image = this.imageRepository.create(data);
        return this.imageRepository.save(image);
    }

    async deleteImage(id: number): Promise<boolean> {
        const result = await this.imageRepository.delete(id);
        return result.affected !== 0;
    }
    async updateImage(id: number, data: Partial<Image>): Promise<Image> {
  await this.imageRepository.update(id, data);
  const updatedImage = await this.imageRepository.findOneBy({ id });
  if (!updatedImage) {
    throw new Error(`Image with id ${id} not found`);
  }
  return updatedImage;
}

    async getImageList(): Promise<{ id: number; image_url: string }[]> {
    return this.imageRepository.find({
        select: ['id', 'image_url'],
    });
}


}