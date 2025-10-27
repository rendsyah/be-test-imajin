import { createZodCustomDto } from 'src/commons/zod';
import { CartIdSchema, CartSchema, CreateCartSchema, UpdateCartSchema } from './carts.pipe';

export class CartIdDto extends createZodCustomDto(CartIdSchema) {}

export class CartDto extends createZodCustomDto(CartSchema) {}

export class CreateCartDto extends createZodCustomDto(CreateCartSchema) {}

export class UpdateCartDto extends createZodCustomDto(UpdateCartSchema) {}
