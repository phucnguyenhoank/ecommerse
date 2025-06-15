import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryColumn } from "typeorm";
import { Payment } from "./Payment";
import { Order } from "./Order";

@Entity()
export class Order_payment {
  @PrimaryColumn()
  order_id!: number; // Dùng làm một phần của khóa chính

  @PrimaryColumn()
  payment_id!: number; // Dùng làm một phần của khóa chính

  @ManyToOne(() => Order, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @ManyToOne(() => Payment, { onDelete: "CASCADE" })
  @JoinColumn({ name: "payment_id" })
  payment!: Payment;

  @CreateDateColumn()
  created_at!: Date; 
}
