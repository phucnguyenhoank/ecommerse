import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Cart } from "./Cart";
import { Order } from "./Order";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'keycloak_id'})
  keycloakId!: string;

  @Column()
  username!: string;

  @Column()
  hash_password!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
  carts!: Cart[];
  @OneToMany(() => Order, (order) => order.user)  
  orders!: Order[];
}
