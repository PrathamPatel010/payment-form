import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AmountSelectionComponent } from './components/amount-selection/amount-selection.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderService } from './services/order.service';
import { CreateOrderReq } from '@models/index';
import { Router } from '@angular/router';
declare var Razorpay: any;

@Component({
  selector: 'app-contribution',
  imports: [
    CommonModule,
    AmountSelectionComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contribution.component.html',
  styleUrl: './contribution.component.scss',
})
export class ContributionComponent {
  requestSent = false;
  fixedAmounts = [1000, 2500, 4000];
  tipOptions = [];
  otherOptionSelected = false;
  isAnonymous = false;
  customAmount: number | null = null;
  selectedAmount: number | null = 2500;
  selectedTip = 18;
  totalAmount = 0;
  userInfoForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _orderService: OrderService,
    public router: Router
  ) {}

  ngOnInit() {
    this.updateTipOptions();
    this.calculateTotalAmount();
    this.userInfoForm = this._fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      address: [null],
      anonymous: [false],
    });
  }

  getControl(name: string) {
    return this.userInfoForm.get(name)!;
  }

  hasError(name: string): boolean {
    const control = this.getControl(name);
    return control.invalid && (control.touched || control.dirty);
  }

  onAmountSelected(amount: number) {
    if (amount == -1) {
      this.selectedAmount = 0;
      this.otherOptionSelected = true;
      this.updateTipOptions();
      this.calculateTotalAmount();
    } else {
      this.otherOptionSelected = false;
      this.selectedAmount = amount;
      this.updateTipOptions();
      this.calculateTotalAmount();
    }
  }

  setCustomAmount(value: string) {
    this.selectedAmount = Number.parseInt(value);
    this.updateTipOptions();
    this.calculateTotalAmount();
  }

  updateTipOptions() {
    this.tipOptions = [
      { label: '0% (INR 0)', value: 0 },
      {
        label: `5% (INR ${Math.round(this.selectedAmount * 0.05)})`,
        value: 5,
      },
      {
        label: `10% (INR ${Math.round(this.selectedAmount * 0.1)})`,
        value: 10,
      },
      {
        label: `18% (INR ${Math.round(this.selectedAmount * 0.18)})`,
        value: 18,
      },
    ];
  }

  calculateTotalAmount() {
    const tip = Math.round(this.selectedAmount * this.selectedTip * 0.01);
    const total = this.selectedAmount + tip;
    this.totalAmount = total;
  }

  formSubmitted() {
    const userInfo = this.userInfoForm.value;
    const reqPayload = {
      ...userInfo,
      amount: this.selectedAmount,
      tip: Number(this.selectedTip),
    };
    this.isAnonymous = this.userInfoForm.value.anonymous;
    this.createOrder(reqPayload);
  }

  async createOrder(payload: CreateOrderReq) {
    this.requestSent = true;
    this._orderService.createOrder(payload).subscribe({
      next: (res) => {
        this.proceedPayment(res);
      },
      error: (err) => {
        alert(err?.error?.messages?.join('\n') ?? 'Something went wrong');
        this.requestSent = false;
      },
    });
  }

  proceedPayment(res) {
    const options = {
      key: res.key,
      amount: res.amount,
      currency: res.currency,
      name: res.name,
      order_id: res.orderId,
      prefill: {
        contact: this.userInfoForm.value.phone,
        ...(this.userInfoForm.value.anonymous
          ? {}
          : {
              name: this.userInfoForm.value.name,
              email: this.userInfoForm.value.email,
            }),
      },
      handler: (response: any) => {
        this._orderService
          .verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          })
          .subscribe({
            next: () => {
              this.requestSent = false;
              this.router.navigate(['/payment-success'], {
                state: {
                  name: !this.isAnonymous ? this.userInfoForm.value.name : '',
                  amount: this.totalAmount,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                },
              });
            },
            error: () => {
              this.requestSent = false;
              alert('Payment verification failed.');
            },
          });
      },
      theme: { color: '#3399cc' },
      modal: {
        // when user closes the razor pay modal
        ondismiss: () => {
          this.requestSent = false;
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }
}
