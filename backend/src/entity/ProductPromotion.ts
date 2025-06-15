import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Product } from "./Product";
import { Promotion } from "./Promotion";

@Entity()
export class Product_promotion {
  @PrimaryColumn()
  product_id!: number; // Khóa chính đầu tiên

  @PrimaryColumn()
  promotion_id!: number; // Khóa chính thứ hai

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @ManyToOne(() => Promotion, { onDelete: "CASCADE" })
  @JoinColumn({ name: "promotion_id" })
  promotion!: Promotion;
}
