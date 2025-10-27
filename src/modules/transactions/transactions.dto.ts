import { createZodCustomDto } from 'src/commons/zod';
import { CreateTransactionSchema } from './transactions.pipe';

export class CreateTransactionDto extends createZodCustomDto(CreateTransactionSchema) {}
