import {Request, Response} from "express";
import {AdminService} from "../services/AdminService";

const adminService = new AdminService();

export class AdminController {
    static async getAllAdmins(req: Request, res: Response) {
        try {
            const admins = await adminService.getAllAdmins();
            res.json(admins);
        } catch (error) {
            res.status(500).json({message: "Error fetching admins", error});
        }
    }

    static async getAdminById(req: Request, res: Response) {
        try {
            const admin = await adminService.getAdminById(parseInt(req.params.id));
            if (!admin) res.status(404).json({message: "Admin not found"});
            else res.json(admin);
        } catch (error) {
            res.status(500).json({message: "Error fetching admin", error});
        }
    }
    static async createAdmin(req: Request, res: Response) {
        try {
            const admin = await adminService.createAdmin(req.body);
            res.status(201).json(admin);
        } catch (error) {
            res.status(500).json({message: "Error creating admin", error});
        }
    }
    static async deleteAdmin(req: Request, res: Response) { 
        try {
            const deleted = await adminService.deleteAdmin(parseInt(req.params.id));
            if (!deleted) res.status(404).json({message: "Admin not found"});
            else res.status(204).send();
        } catch (error) {
            res.status(500).json({message: "Error deleting admin", error});
        }
    }
}