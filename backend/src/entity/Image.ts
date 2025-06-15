import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { ProductItem } from './ProductItem';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  image_url!: string;

  @ManyToOne(() => ProductItem, (productItem) => productItem.images, {
    onDelete: 'CASCADE',  
    nullable: true,
  })
  productItem?: ProductItem;
}
