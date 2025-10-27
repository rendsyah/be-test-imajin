import { createZodCustomDto } from 'src/commons/zod';
import { ProductSchema, ProductSlugSchema } from './products.pipe';

export class ProductSlugDto extends createZodCustomDto(ProductSlugSchema) {}

export class ProductDto extends createZodCustomDto(ProductSchema) {}
