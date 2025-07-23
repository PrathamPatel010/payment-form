import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
3;
import { AmountSelectionComponent } from './components/amount-selection/amount-selection.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderService } from './services/order.service';

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
  fixedAmounts = [1000, 2500, 4000];
  tipOptions = [
    { label: '0%', value: 0 },
    { label: '5%', value: 5 },
    { label: '10%', value: 10 },
    { label: '18%', value: 18 },
  ];
  otherOptionSelected = false;
  selectedAmount: number | null = 0;
  selectedTip = 18;
  totalAmount = 0;
  userInfoForm: FormGroup;

  constructor(private _fb: FormBuilder, private _orderService: OrderService) {}

  ngOnInit() {
    this.userInfoForm = this._fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.email]],
      phone: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      address: [null, Validators.required],
    });
  }

  onAmountSelected(amount: number) {
    if (amount < 0) {
      this.selectedAmount = null;
      this.otherOptionSelected = true;
    } else {
      this.otherOptionSelected = false;
      this.selectedAmount = amount;
      this.updateTipOptions();
      this.calculateTotalAmount();
    }
  }

  onCustomAmountChange(value: string) {
    const amount = Number(value);
    if (!isNaN(amount) && amount > 0) {
      this.selectedAmount = amount;
      this.updateTipOptions();
      this.calculateTotalAmount();
    }
  }

  updateTipOptions() {
    this.tipOptions = [
      { label: '0% (INR 0)', value: 0 },
      {
        label: `5% (INR ${(this.selectedAmount * 0.05).toFixed()})`,
        value: 5,
      },
      {
        label: `10% (INR ${(this.selectedAmount * 0.1).toFixed()})`,
        value: 10,
      },
      {
        label: `18% (INR ${(this.selectedAmount * 0.18).toFixed()})`,
        value: 18,
      },
    ];
  }

  calculateTotalAmount() {
    const tip = (this.selectedAmount * this.selectedTip * 0.01).toFixed();
    const total = this.selectedAmount + Number.parseInt(tip);
    this.totalAmount = total;
  }

  formSubmitted() {
    console.log(this.userInfoForm.value);
    const userInfo = this.userInfoForm.value;
    const reqPayload = {
      ...userInfo,
      amount: this.selectedAmount,
      tip: this.totalAmount - this.selectedAmount,
      anonymous: false,
    };
    this.createOrder(reqPayload);
  }

  async createOrder(payload) {
    this._orderService.createOrder(payload).subscribe((res) => {
      console.log(res);
    });
  }
}
