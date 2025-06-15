import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Address } from "./Address";
import { Shipping_method } from "./ShippingMethod";
import { Order_status } from "./Order_status";
import { OrderItem } from "./OrderItems"; //  Import thêm

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User | null = null;

  @Column({ nullable: true })
  guest_name!: string;

  @Column({ nullable: true })
  guest_email!: string;

  @Column({ nullable: true })
  guest_phone!: string;

  @ManyToOne(() => Address, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "shipping_address_id" })
  shippingAddress: Address | null = null;

  @ManyToOne(() => Shipping_method, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "shipping_method_id" })
  shippingMethod: Shipping_method | null = null;

  @ManyToOne(() => Order_status, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "order_status_id" })
  orderStatus: Order_status | null = null;

  @CreateDateColumn()
  orderDate!: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  order_total!: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems!: OrderItem[];
}
