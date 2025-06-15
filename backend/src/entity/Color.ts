import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ProductItem } from "./ProductItem";

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  color_code!: string; // Mã màu (ví dụ: #FFFFFF).

  @OneToMany(() => ProductItem, (productItem) => productItem.color)
  productItems!: ProductItem[]; // Mối quan hệ một-nhiều với ProductItem.
}
