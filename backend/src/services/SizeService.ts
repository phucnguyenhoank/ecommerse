import { AppDataSource } from "../config/datasource";
import { Size } from "../entity/Size";

const repo = AppDataSource.getRepository(Size);

export const getAllSizes = async () => {
  return await repo.find({ relations: ["productItems"] });
};

export const createSize = async (data: Partial<Size>) => {
  const size = repo.create(data);
  return await repo.save(size);
};

export const deleteSize = async (id: number) => {
  return await repo.delete(id);
};
