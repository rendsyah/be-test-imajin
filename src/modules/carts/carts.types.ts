import { IPaginationResponse } from 'src/commons/utils';

export type CartsResponse = IPaginationResponse<{
  id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  quantity: number;
  amount: number;
}>;
