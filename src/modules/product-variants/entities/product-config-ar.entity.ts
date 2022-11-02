import { instanceToPlain } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../../../shared/utils/common-enums';
import { ProductVariant } from './product-variants.entity';
@Entity('product_config_ar')
export class ProductConfigAR extends BaseEntity {
  @OneToOne(() => ProductVariant, { primary: true, cascade: true })
  @JoinColumn({ name: 'id' })
  productVariant: ProductVariant;

  @Column({ name: 'url_left_model', length: 500, nullable: false, default: '' })
  urlLeftModel: string;

  @Column({
    name: 'file_left_model_name',
    length: 500,
    nullable: false,
    default: '',
  })
  fileLeftModelName: string;

  @Column({
    name: 'url_right_model',
    length: 500,
    nullable: false,
    default: '',
  })
  urlRightModel: string;

  @Column({
    name: 'file_right_model_name',
    length: 500,
    nullable: false,
    default: '',
  })
  fileRightModelName: string;

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
