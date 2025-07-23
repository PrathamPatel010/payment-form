import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiUrl = environment.API_URL;
  constructor(private _httpClient: HttpClient) {}

  createOrder(payload: any) {
    return this._httpClient.post(`${this.apiUrl}/create-order`, payload);
  }
}
