import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-range-input',
  templateUrl: './filter-range-input.component.html',
  styleUrls: ['./filter-range-input.component.css']
})
export class FilterRangeInputComponent {
  @Input() source!: string;
  @Input() max!: number;
  min = 0;
  @Input() step!: number;
  disabled = false;
  value = 0;
}
