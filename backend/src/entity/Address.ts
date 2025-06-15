import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User_address } from "./UserAddress";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  street_name!: string;

  @Column({ length: 50 })
  city!: string;

  @Column({ length: 50 })
  region!: string;

  @Column({ length: 50 })
  district!: string;

  @Column({ length: 50 })
  country!: string;

  @OneToMany(() => User_address, (user_address) => user_address.address)
  user_addresses!: User_address[];
}
