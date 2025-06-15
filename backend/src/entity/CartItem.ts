import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Cart } from "./Cart";
import { ProductItem } from "./ProductItem"; // Sửa tên class để khớp với định danh TypeScript.

@Entity()
export class Cart_item {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  cart!: Cart; // Liên kết với thực thể `Cart`.

  @ManyToOne(() => ProductItem, (productItem) => productItem.cartItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_item_id" })
  productItem!: ProductItem; // Liên kết với thực thể `ProductItem`.

  @Column()
  quantity!: number; // Kiểu dữ liệu là `number` cho số lượng.
}
