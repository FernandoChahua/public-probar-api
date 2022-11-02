import { instanceToPlain } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../../../shared/utils/common-enums';
import { Product } from '../../products/entities/product.entity';

@Entity('brands')
export class Brand extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', length: 1000, unique: false, nullable: true })
  title: string;

  @Column({ name: 'description', length: 1000, nullable: true })
  description: string;

  @Column({ name: 'url_logo_link', length: 400, nullable: true })
  urlLogoLink: string;

  @Column({ name: 'path_file_logo', length: 400, nullable: true })
  pathFileLogo: string;

  @Column({ name: 'logo_filename', length: 400, nullable: true })
  logoFilename: string;

  @OneToMany(() => Product, (product: Product) => product.brand, {})
  products: Product[];

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

  public constructor(init?: Partial<Brand>) {
    super();
    Object.assign(this, init);
  }
}
