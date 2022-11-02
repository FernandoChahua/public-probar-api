import { instanceToPlain } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../../../shared/utils/common-enums';
import { User } from '../../auth/entities/user.entity';
import { ProductVariant } from '../../product-variants/entities/product-variants.entity';

@Entity('favorites')
export class Favorite extends BaseEntity {
  @ManyToOne(() => User, (user: User) => user.favorites, { primary: true })
  user: User;

  @ManyToOne(
    () => ProductVariant,
    (productVariant: ProductVariant) => productVariant.favorites,
    {
      primary: true,
    },
  )
  productVariant: ProductVariant;

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

  public constructor(init?: Partial<Favorite>) {
    super();
    Object.assign(this, init);
  }
}
