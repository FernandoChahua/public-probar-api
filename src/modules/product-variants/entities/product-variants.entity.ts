import { instanceToPlain } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../../../shared/utils/common-enums';
import { Favorite } from '../../favorites/entities/favorites.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductConfigAR } from './product-config-ar.entity';

@Entity('product_variants')
export class ProductVariant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'title',
    length: 1000,
    unique: false,
    nullable: true,
    default: '',
  })
  title: string;

  @Column({ name: 'description', length: 1000, nullable: true, default: '' })
  description: string;

  @Column({ name: 'url_image', length: 300, nullable: true, default: '' })
  urlImage: string;

  @Column({ name: 'link_preview_model_ar', length: 1000, nullable: true, default: '' })
  linkPreviewModelAR: string;

  @Column({ name: 'path_file_image', length: 400, nullable: true, default: '' })
  pathFileImage: string;

  @Column({ name: 'image_filename', length: 400, nullable: true, default: '' })
  imageFilename: string;

  @Column({ name: 'color_name', length: 50, nullable: true, default: '' })
  colorName: string;

  @Column({ name: 'color_rgb', length: 30, nullable: true, default: '' })
  colorRGB: string;

  @Column({ name: 'size', length: 30, nullable: true, default: '' })
  size: string;

  @Column({ name: 'price', type: 'decimal', nullable: false, default: 0 })
  price: number;

  @ManyToOne(() => Product, (product: Product) => product.productVariants, {})
  product: Product;

  @OneToMany(() => Favorite, (favorite: Favorite) => favorite.productVariant)
  favorites: Favorite[];

  @OneToOne(
    () => ProductConfigAR,
    (productConfig: ProductConfigAR) => productConfig.productVariant,
    {},
  )
  productConfigAR: ProductConfigAR;

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

  public constructor(init?: Partial<ProductVariant>) {
    super();
    Object.assign(this, init);
  }
}
