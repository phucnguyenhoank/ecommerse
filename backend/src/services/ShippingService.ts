import { AppDataSource } from "../config/datasource";
import { Shipping_method } from "../entity/ShippingMethod";

const repo = AppDataSource.getRepository(Shipping_method);

export const getAllShippingMethods = async () => {
  return await repo.find();
};

export const createShippingMethod = async (data: Partial<Shipping_method>) => {
  const shipping = repo.create(data);
  return await repo.save(shipping);
};

export const deleteShippingMethod = async (id: number) => {
  return await repo.delete(id);
};
