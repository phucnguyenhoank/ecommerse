import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Shipping_method } from "../entity/ShippingMethod";

const repo = AppDataSource.getRepository(Shipping_method);

export const getShippingMethods = async (_: Request, res: Response) => {
  const data = await repo.find();
  res.json(data);
};

export const createShippingMethod = async (req: Request, res: Response) => {
  const shipping = repo.create(req.body);
  await repo.save(shipping);
  res.status(201).json(shipping);
};

export const deleteShippingMethod = async (req: Request, res: Response) => {
  await repo.delete(req.params.id);
  res.status(204).send();
};
