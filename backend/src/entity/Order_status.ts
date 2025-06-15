import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order_status {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  status!: string;
}
