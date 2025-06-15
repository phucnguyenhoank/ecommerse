import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Product_promotion } from "./ProductPromotion"; 

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  start_at!: Date;

  @Column()
  end_at!: Date;

  @Column("decimal", { precision: 5, scale: 2 })
  discount_rate!: number;

  @OneToMany(() => Product_promotion, (productPromotion) => productPromotion.promotion)
  productPromotions!: Product_promotion[];
}
