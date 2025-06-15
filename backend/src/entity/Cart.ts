import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Cart_item } from "./CartItem"; 

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User; 

  @OneToMany(() => Cart_item, (cartItem) => cartItem.cart, { cascade: true })
  cartItems!: Cart_item[]; 
}
