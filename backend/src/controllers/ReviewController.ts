import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Review } from "../entity/Review";

const repo = AppDataSource.getRepository(Review);

export const getReviews = async (_: Request, res: Response) => {
  const data = await repo.find({ relations: ["order_item"] });
  res.json(data);
};

export const createReview = async (req: Request, res: Response) => {
  const review = repo.create(req.body);
  await repo.save(review);
  res.status(201).json(review);
};

export const deleteReview = async (req: Request, res: Response) => {
  await repo.delete(req.params.id);
  res.status(204).send();
};
