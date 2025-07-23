import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
3;
import { AmountSelectionComponent } from './components/amount-selection/amount-selection.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contribution',
  imports: [CommonModule, AmountSelectionComponent, FormsModule],
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
}
