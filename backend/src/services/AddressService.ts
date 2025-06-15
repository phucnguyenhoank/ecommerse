import { Repository } from "typeorm";
import { Address } from "../entity/Address";
import { User_address } from "../entity/UserAddress";
import { AppDataSource } from "../config/datasource";

export class AddressService {
    private addressRepository: Repository<Address>;
    private userAddressRepository: Repository<User_address>;

    constructor() {
        this.addressRepository = AppDataSource.getRepository(Address);
        this.userAddressRepository = AppDataSource.getRepository(User_address);
    }

    async getAllAddresses(): Promise<Address[]> {
        return await this.addressRepository.find({
            relations: ['user_addresses']
        });
    }

    async getAddressById(id: number): Promise<Address | null> {
        return await this.addressRepository.findOne({
            where: { id },
            relations: ['user_addresses']
        });
    }

    async getUserAddresses(userId: number): Promise<Address[]> {
        const userAddresses = await this.userAddressRepository.find({
            where: { user_id: userId },
            relations: ['address']
        });
        return userAddresses.map(ua => ua.address);
    }

    async createAddress(addressData: Partial<Address>): Promise<Address> {
        const address = this.addressRepository.create(addressData);
        return await this.addressRepository.save(address);
    }

    async addUserAddress(userId: number, addressData: Partial<Address>, isDefault: boolean = false): Promise<User_address> {
        // Tạo địa chỉ mới
        const address = this.addressRepository.create(addressData);
        const savedAddress = await this.addressRepository.save(address);

        // Tạo liên kết giữa user và địa chỉ
        const userAddress = this.userAddressRepository.create({
            user_id: userId,
            address_id: savedAddress.id,
            is_default: isDefault ? "true" : "false",
            address: savedAddress
        });

        return await this.userAddressRepository.save(userAddress);
    }

    async updateAddress(id: number, addressData: Partial<Address>): Promise<Address | null> {
        const address = await this.getAddressById(id);
        if (!address) {
            return null;
        }
        
        Object.assign(address, addressData);
        return await this.addressRepository.save(address);
    }

    async deleteAddress(id: number): Promise<boolean> {
        // Xóa liên kết user_address trước
        await this.userAddressRepository.delete({ address_id: id });
        // Sau đó xóa địa chỉ
        const result = await this.addressRepository.delete(id);
        return result.affected !== 0;
    }

    async setDefaultAddress(userId: number, addressId: number): Promise<boolean> {
        try {
            // Kiểm tra địa chỉ tồn tại
            const address = await this.getAddressById(addressId);
            if (!address) {
                return false;
            }

            // Đặt tất cả địa chỉ của user thành không mặc định
            await this.userAddressRepository.update(
                { user_id: userId },
                { is_default: "false" }
            );

            // Đặt địa chỉ được chọn làm mặc định
            const result = await this.userAddressRepository.update(
                { user_id: userId, address_id: addressId },
                { is_default: "true" }
            );

            return result.affected !== 0;
        } catch (error) {
            return false;
        }
    }
}