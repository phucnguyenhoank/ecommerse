import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Address } from "./Address";

@Entity()
export class User_address {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column()
  address_id!: number;

  @Column()
  is_default!: string;

  @ManyToOne(() => Address, (address) => address.user_addresses, { cascade: true })
  address!: Address;
}
