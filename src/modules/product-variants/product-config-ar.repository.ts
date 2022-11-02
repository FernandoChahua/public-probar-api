import { EntityRepository, Repository } from 'typeorm';
import { ProductConfigAR } from './entities/product-config-ar.entity';

@EntityRepository(ProductConfigAR)
export class ProductConfigRepository extends Repository<ProductConfigAR> {}
