import {Request, Response} from 'express';
import { ImageService } from "../services/ImageService";

const imageService = new ImageService();

export class ImageController {
    static async getAllImages(req: Request, res: Response) {
        try {
            const images = await imageService.getAllImages();
            res.json(images);
        } catch (error) {
            res.status(500).json({ message: "Error fetching images", error });
        }
    }

    static async getImageById(req: Request, res: Response) {
        try {
            const image = await imageService.getImageById(parseInt(req.params.id));
            if (!image) res.status(404).json({ message: "Image not found" });
            else res.json(image);
        } catch (error) {
            res.status(500).json({ message: "Error fetching image", error });
        }
    }

    static async createImage(req: Request, res: Response) {
        try {
            const image = await imageService.createImage(req.body);
            res.status(201).json(image);
        } catch (error) {
            res.status(500).json({ message: "Error creating image", error });
        }
    }

    static async deleteImage(req: Request, res: Response) {
        try {
            const deleted = await imageService.deleteImage(parseInt(req.params.id));
            if (!deleted) res.status(404).json({ message: "Image not found" });
            else res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Error deleting image", error });
        }
    }
}
