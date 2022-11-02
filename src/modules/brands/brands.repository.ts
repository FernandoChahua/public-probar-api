import { EntityRepository, Repository } from 'typeorm';
import { Brand } from './entities/brands.entity';

@EntityRepository(Brand)
export class BrandsRepository extends Repository<Brand> {}
