import { Repository } from "typeorm";
import { Admin } from "../entity/Admin";
import { AppDataSource } from "../config/datasource";
import bcrypt from "bcrypt";

export class AdminService {
    private adminRepository: Repository<Admin>;

    constructor() {
        this.adminRepository = AppDataSource.getRepository(Admin);
    }

    async getAllAdmins(): Promise<Admin[]> {
        return await this.adminRepository.find();
    }

    async getAdminById(id: number): Promise<Admin | null> {
        return await this.adminRepository.findOne({ where: { id } });
    }

    async getAdminByUsername(username: string): Promise<Admin | null> {
        return await this.adminRepository.findOne({ where: { username } });
    }

    async createAdmin(adminData: Partial<Admin>): Promise<Admin> {
        // Hash mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(adminData.password!, 10);
        
        const admin = this.adminRepository.create({
            username: adminData.username,
            password: hashedPassword,
            full_name: adminData.full_name
        });
        
        return await this.adminRepository.save(admin);
    }

    async updateAdmin(id: number, adminData: Partial<Admin>): Promise<Admin | null> {
        const admin = await this.getAdminById(id);
        if (!admin) {
            return null;
        }

        // Nếu cập nhật mật khẩu, hash mật khẩu mới
        if (adminData.password) {
            adminData.password = await bcrypt.hash(adminData.password, 10);
        }

        Object.assign(admin, adminData);
        return await this.adminRepository.save(admin);
    }

    async deleteAdmin(id: number): Promise<boolean> {
        const result = await this.adminRepository.delete(id);
        return result.affected !== 0;
    }

    async validateAdmin(username: string, password: string): Promise<Admin | null> {
        const admin = await this.getAdminByUsername(username);
        if (!admin) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return null;
        }

        return admin;
    }

    async changePassword(id: number, oldPassword: string, newPassword: string): Promise<boolean> {
        const admin = await this.getAdminById(id);
        if (!admin) {
            return false;
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
        if (!isPasswordValid) {
            return false;
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedNewPassword;
        await this.adminRepository.save(admin);
        
        return true;
    }
}