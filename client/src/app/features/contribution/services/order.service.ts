import {
  CreateOrderReq,
  OrderCreatedRes,
  PaymentVerificationReq,
} from '@models/index';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiUrl = environment.API_URL;
  constructor(private _httpClient: HttpClient) {}

  createOrder(payload: CreateOrderReq) {
    return this._httpClient.post<OrderCreatedRes>(
      `${this.apiUrl}/create-order`,
      payload
    );
  }

  verifyPayment(payload: PaymentVerificationReq) {
    return this._httpClient.post(`${this.apiUrl}/verify-payment`, payload);
  }
}
