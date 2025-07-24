import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [RouterModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss',
})
export class PaymentSuccessComponent {
  name = '';
  amount = 0;
  paymentId = '';
  orderId = '';

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    if (state) {
      this.name = state.name;
      this.amount = state.amount;
      this.paymentId = state.paymentId;
      this.orderId = state.orderId;
    }
  }
}
