// import { Request, Response } from "express";
// import { AppDataSource } from "../config/datasource";
// //import { AddressService } from "../services/AddressService";
// import { Address } from "../entity/Address";
// import { User_address } from "../entity/User_address";

// const addressService = new AddressService();

// interface AuthenticatedRequest extends Request {
//     user: {
//         id: number;
//     };
// }

// export class AddressController {
//     static async getAllAddresses(req: Request, res: Response) {
//         try {
//             const userId = (req as AuthenticatedRequest).user.id;
//             const addresses = await addressService.getUserAddresses(userId);
//             res.json(addresses);
//         } catch (error) {
//             res.status(500).json({ message: "Error fetching addresses", error });
//         }
//     }

//     static async getAddressById(req: Request, res: Response) {
//         try {
//             const address = await addressService.getAddressById(parseInt(req.params.id));
//             if (!address) res.status(404).json({ message: "Address not found" });
//             else res.json(address);
//         } catch (error) {
//             res.status(500).json({ message: "Error fetching address", error });
//         }
//     }

//     static async createAddress(req: Request, res: Response) {
//         try {
//             const userId = (req as AuthenticatedRequest).user.id;
//             const { street_name, city, region, district, country, is_default } = req.body;
//             const addressData = { street_name, city, region, district, country };
//             const userAddress = await addressService.addUserAddress(userId, addressData, is_default);
//             res.status(201).json(userAddress);
//         } catch (error) {
//             res.status(500).json({ message: "Error creating address", error });
//         }
//     }

//     static async updateAddress(req: Request, res: Response) {
//         try {
//             const { street_name, city, region, district, country } = req.body;
//             const addressData = { street_name, city, region, district, country };
//             const updatedAddress = await addressService.updateAddress(parseInt(req.params.id), addressData);
//             if (!updatedAddress) res.status(404).json({ message: "Address not found" });
//             else res.json(updatedAddress);
//         } catch (error) {
//             res.status(500).json({ message: "Error updating address", error });
//         }
//     }

//     static async deleteAddress(req: Request, res: Response) {
//         try {
//             const isDeleted = await addressService.deleteAddress(parseInt(req.params.id));
//             if (!isDeleted) res.status(404).json({ message: "Address not found" });
//             else res.status(204).send();
//         } catch (error) {
//             res.status(500).json({ message: "Error deleting address", error });
//         }
//     }

//     static async setDefaultAddress(req: Request, res: Response) {
//         try {
//             const userId = (req as AuthenticatedRequest).user.id;
//             const isSet = await addressService.setDefaultAddress(userId, parseInt(req.params.id));
//             if (!isSet) res.status(404).json({ message: "Address not found" });
//             else res.json({ message: "Default address set successfully" });
//         } catch (error) {
//             res.status(500).json({ message: "Error setting default address", error });
//         }
//     }
// }