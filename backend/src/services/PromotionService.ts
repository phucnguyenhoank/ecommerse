import { AppDataSource } from "../config/datasource";
import { Promotion } from "../entity/Promotion";

const repo = AppDataSource.getRepository(Promotion);

// Lấy tất cả khuyến mãi
export const getAllPromotions = async () => {
  return await repo.find({ relations: ["productPromotions"] });
};

// Tạo khuyến mãi mới
export const createPromotion = async (data: Partial<Promotion>) => {
  const promotion = repo.create(data);
  return await repo.save(promotion);
};

// Xoá khuyến mãi theo ID
export const deletePromotion = async (id: number) => {
  return await repo.delete(id);
};
