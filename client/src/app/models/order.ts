export interface CreateOrderReq {
  name: string;
  email: string;
  phone: string;
  amount: number;
  tip: number;
  anonymous: boolean;
  address: string;
}

export interface OrderCreatedRes {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
  name: string;
}
