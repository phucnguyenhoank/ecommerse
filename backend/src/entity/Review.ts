import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { OrderItem } from "./OrderItems";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => OrderItem, (orderItem) => orderItem.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "order_item_id" })
  orderItem!: OrderItem;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rate!: number;

  @Column()
  create_at!: Date;
}
