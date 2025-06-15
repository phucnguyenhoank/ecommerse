import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ProductItem } from "./ProductItem";

@Entity()
export class Size {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => ProductItem, (productItem) => productItem.size)
  productItems!: ProductItem[]; // Mối quan hệ một-nhiều với ProductItem.
}
