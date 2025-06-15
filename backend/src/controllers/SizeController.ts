import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Size } from "../entity/Size";

const repo = AppDataSource.getRepository(Size);

export const getSizes = async (_: Request, res: Response) => {
  const data = await repo.find({ relations: ["productItems"] });
  res.json(data);
};

export const createSize = async (req: Request, res: Response) => {
  const size = repo.create(req.body);
  await repo.save(size);
  res.status(201).json(size);
};

export const deleteSize = async (req: Request, res: Response) => {
  await repo.delete(req.params.id);
  res.status(204).send();
};
