import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { User_address } from "../entity/UserAddress";

const repo = AppDataSource.getRepository(User_address);

export const getUserAddresses = async (_: Request, res: Response) => {
  const data = await repo.find({ relations: ["address"] });
  res.json(data);
};

export const createUserAddress = async (req: Request, res: Response) => {
  const address = repo.create(req.body);
  await repo.save(address);
  res.status(201).json(address);
};

export const deleteUserAddress = async (req: Request, res: Response) => {
  await repo.delete(req.params.user_id);
  res.status(204).send();
};
