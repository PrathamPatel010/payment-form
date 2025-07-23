import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-amount-selection',
  templateUrl: './amount-selection.component.html',
  styleUrls: ['./amount-selection.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AmountSelectionComponent {
  @Input() amount: number | null = null;
  @Input() selected: boolean = false;
  @Output() amountSelected = new EventEmitter<number>();

  onSelectAmount() {
    if (this.amount !== null) {
      this.amountSelected.emit(this.amount);
    } else {
      this.amountSelected.emit(-1); // signals the parent to show custom input
    }
  }
}
