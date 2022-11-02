import { Exclude, instanceToPlain } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Favorite } from '../../favorites/entities/favorites.entity';

export enum Role {
  ADMIN = 'A',
  USER = 'U',
}

export enum UserStatus {
  ACTIVE = 'A',
  INACTIVE = 'I',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', unique: true, nullable: false })
  username: string;

  @Column({ name: 'password', nullable: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    name: 'role',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToMany(() => Favorite, (favorite: Favorite) => favorite.user)
  favorites: Favorite[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    name: 'status',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  toJSON() {
    return instanceToPlain(this);
  }

  public constructor(init?: Partial<User>) {
    super();
    Object.assign(this, init);
  }
}
