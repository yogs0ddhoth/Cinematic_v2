import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxClickAction } from '@angular/material/checkbox';

@Component({
  selector: 'app-filter-range-input',
  templateUrl: './filter-range-input.component.html',
  styleUrls: ['./filter-range-input.component.css']
})
export class FilterRangeInputComponent {
  @Input() source!: string;
  min = 0;
  @Input() max!: number;
  @Input() step!: number;
  @Input() disabled!: boolean;
  @Output() disabledChange = new EventEmitter<boolean>();
  @Input() score!: number;
  @Output() scoreChange = new EventEmitter<number>();

  updateDisabled(event: MatCheckboxChange): void {
    this.disabled = event.checked;
    this.disabledChange.emit(this.disabled);
  }

  updateScore(event: any): void {
    this.score = event.target.value;
    this.scoreChange.emit(this.score);
  }
}
