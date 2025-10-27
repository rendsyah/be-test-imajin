import { IPaginationResponse, Nullable } from 'src/commons/utils';

export type DetailProductResponse = Nullable<{
  id: number;
  category: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
}>;

export type ProductsResponse = IPaginationResponse<{
  id: number;
  category: string;
  name: string;
  slug: string;
  image: string;
  price: number;
}>;
