import { createZodCustomDto } from 'src/commons/zod';
import { LoginSchema, RegisterSchema } from './auth.pipe';

export class RegisterDto extends createZodCustomDto(RegisterSchema) {}

export class LoginDto extends createZodCustomDto(LoginSchema) {}
