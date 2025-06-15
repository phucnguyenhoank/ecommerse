import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Shipping_method {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;
}
