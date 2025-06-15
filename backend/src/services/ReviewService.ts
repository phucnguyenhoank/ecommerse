import { AppDataSource } from "../config/datasource";
import { Review } from "../entity/Review";

const repo = AppDataSource.getRepository(Review);

export const getAllReviews = async () => {
  return await repo.find({ relations: ["order_item"] });
};

export const createReview = async (data: Partial<Review>) => {
  const review = repo.create(data);
  return await repo.save(review);
};

export const deleteReview = async (id: number) => {
  return await repo.delete(id);
};
