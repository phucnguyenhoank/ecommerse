import {Request, Response} from "express";
import {ColorService} from "../services/ColorService";

const colorService = new ColorService();

export class ColorController {
    static async getAllColors(req: Request, res: Response) {
        try {
            const colors = await colorService.getAllColors();
            res.json(colors);
        } catch (error) {
            res.status(500).json({message: "Error fetching colors", error});
        }
    }

    static async getColorById(req: Request, res: Response) {
        try {
            const color = await colorService.getColorById(parseInt(req.params.id));
            if (!color) res.status(404).json({message: "Color not found"});
            else res.json(color);
        } catch (error) {
            res.status(500).json({message: "Error fetching color", error});
        }
    }
    static async createColor(req: Request, res: Response) {
        try {
            const color = await colorService.createColor(req.body);
            res.status(201).json(color);
        } catch (error) {
            res.status(500).json({message: "Error creating color", error});
        }
    }
    static async deleteColor(req: Request, res: Response) {
        try {
            await colorService.deleteColor(parseInt(req.params.id));
            res.status(204).send();
        } catch (error) {
            res.status(500).json({message: "Error deleting color", error});
        }
    }
}