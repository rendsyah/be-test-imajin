import { Nullable } from 'src/commons/utils';

export type UserResponse = Nullable<{
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string;
}>;
