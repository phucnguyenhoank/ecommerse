import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order";
import { ProductItem } from "./ProductItem";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @ManyToOne(() => ProductItem, productItem => productItem.orderItems)
  @JoinColumn({ name: "product_item_id" })
  productItem!: ProductItem;

  @Column()
  quantity!: string;

  @Column()
  price!: string;
}
