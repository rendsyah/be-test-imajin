type Payments = {
  id: number;
  name: string;
};

export type PaymentMethodsResponse = {
  id: string;
  name: string;
  payments: Payments[];
};
