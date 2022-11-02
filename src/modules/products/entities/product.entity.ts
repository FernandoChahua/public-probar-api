import { instanceToPlain } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../../../shared/utils/common-enums';
import { Brand } from '../../brands/entities/brands.entity';
import { ProductVariant } from '../../product-variants/entities/product-variants.entity';

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', length: 1000, unique: false, nullable: true })
  title: string;

  @Column({ name: 'description', length: 1000, nullable: true })
  description: string;

  @Column({ name: 'price', type: 'decimal', nullable: false })
  price: number;

  @ManyToOne(() => Brand, (brand: Brand) => brand.products, {})
  brand: Brand;

  @OneToMany(
    () => ProductVariant,
    (productVariant: ProductVariant) => productVariant.product,
    {},
  )
  productVariants: ProductVariant[];

  @Column({
    name: 'redirect_to_url_shop',
    length: 1000,
    nullable: false,
    default: '',
  })
  redirectToUrlShop: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    name: 'status',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  toJSON() {
    return instanceToPlain(this);
  }

  public constructor(init?: Partial<Product>) {
    super();
    Object.assign(this, init);
  }
}
