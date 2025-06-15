import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order"; 
import { ProductItem } from "./ProductItem";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, order => order.id)
  @JoinColumn({ name: 'order_id' })
  order!: Order; // sửa lại nếu muốn truy cập order, không dùng order_id

  @ManyToOne(() => ProductItem, productItem => productItem.orderItems)
  @JoinColumn({ name: 'product_item_id' })
  productItem!: ProductItem; // ✅ sửa từ product_item_id thành productItem

  @Column()
  quantity!: string;

  @Column()
  price!: string;
}
