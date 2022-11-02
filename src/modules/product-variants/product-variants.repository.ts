import { EntityRepository, Repository } from 'typeorm';
import { ProductVariant } from './entities/product-variants.entity';

@EntityRepository(ProductVariant)
export class ProductVariantsRepository extends Repository<ProductVariant> {}
