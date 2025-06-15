import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Order_payment } from "./OrderPayment";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  payment_method!: string;

  @OneToMany(() => Order_payment, orderPayment => orderPayment.payment_id)
  orders!: Order_payment[];
}
